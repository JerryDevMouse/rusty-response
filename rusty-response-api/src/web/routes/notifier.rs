use axum::{
    Json, Router,
    extract::{Path, Query, State},
    middleware,
    response::{IntoResponse, Response},
    routing::{get, post, put},
};
use reqwest::StatusCode;
use serde_json::json;

use crate::{
    model::{Ctx, NotifierBmc, NotifierCreate, ServerBmc, UserRole},
    web::{WebError, routes::PaginationQuery},
};

use super::{AppState, middlewares::verify_token_middleware};

pub fn routes<S: Send + Sync>(state: AppState) -> Router<S> {
    Router::new()
        .route("/", post(notifier_add))
        .route("/{id}", put(notifier_modify).delete(notifier_remove))
        .route("/server/{id}", get(notifier_list))
        .layer(middleware::from_fn_with_state(
            AppState::clone(&state),
            verify_token_middleware,
        ))
        .with_state(state)
}

async fn notifier_add(
    State(state): State<AppState>,
    ctx: Ctx,
    Json(payload): Json<NotifierCreate>,
) -> Result<Response, WebError> {
    let found = ServerBmc::get_by_id(&state.mm, &ctx, payload.server_id).await?;
    if found.is_none() {
        return Err(WebError::ServerNotFound);
    }
    let found = found.unwrap();

    if ctx.user_id != found.user_id && !matches!(ctx.role, UserRole::Admin) {
        return Err(WebError::ServerNotAllowed);
    }

    let notifier = NotifierBmc::insert(&state.mm, &ctx, payload).await?;
    state.notify_manager.add(&notifier).await?; // add new notifier via shared ref

    Ok((StatusCode::OK, Json(notifier)).into_response())
}

async fn notifier_list(
    State(state): State<AppState>,
    ctx: Ctx,
    Path(id): Path<i64>,
    Query(query): Query<PaginationQuery>,
) -> Result<Response, WebError> {
    let limit = query.limit.unwrap_or(10);
    let offset = query.offset.unwrap_or(0);

    let notifiers = NotifierBmc::list(&state.mm, &ctx, id, Some((limit, offset).into())).await?;
    Ok((StatusCode::OK, Json(notifiers)).into_response())
}

async fn notifier_modify(
    State(state): State<AppState>,
    ctx: Ctx,
    Path(id): Path<i64>,
    Json(payload): Json<NotifierCreate>,
) -> Result<Response, WebError> {
    let found = NotifierBmc::find_by_id(&state.mm, &ctx, id).await?;
    if found.is_none() {
        return Err(WebError::NotifierNotFound);
    }
    let found = found.unwrap();

    if ctx.user_id != found.user_id && !matches!(ctx.role, UserRole::Admin) {
        return Err(WebError::NotifierNotAllowed);
    }

    NotifierBmc::update_notifier(&state.mm, &ctx, id, payload).await?;

    Ok((StatusCode::OK, Json(json!({"message": "Success"}))).into_response())
}

async fn notifier_remove(
    State(state): State<AppState>,
    ctx: Ctx,
    Path(id): Path<i64>,
) -> Result<Response, WebError> {
    let found = NotifierBmc::find_by_id(&state.mm, &ctx, id).await?;
    if found.is_none() {
        return Err(WebError::NotifierNotFound);
    }
    let found = found.unwrap();

    if ctx.user_id != found.user_id && !matches!(ctx.role, UserRole::Admin) {
        return Err(WebError::NotifierNotAllowed);
    }

    NotifierBmc::delete(&state.mm, &ctx, id).await?;
    state.notify_manager.remove_by_nid(id).await?;

    Ok((StatusCode::OK, Json(json!({ "message": "Success" }))).into_response())
}
