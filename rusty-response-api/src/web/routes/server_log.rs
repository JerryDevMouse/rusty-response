use axum::{
    Json, Router,
    extract::{Path, Query, State},
    middleware,
    response::{IntoResponse, Response},
    routing::get,
};
use reqwest::StatusCode;

use crate::{
    Ctx,
    model::{ServerBmc, ServerLogBmc, UserRole},
    web::{AppState, WebError, routes::middlewares::verify_token_middleware, utils::PageQuery},
};

pub fn routes<S>(state: AppState) -> Router<S> {
    Router::new()
        .route("/{id}", get(get_server_logs))
        .layer(middleware::from_fn_with_state(
            AppState::clone(&state),
            verify_token_middleware,
        ))
        .with_state(state)
}

pub async fn get_server_logs(
    State(state): State<AppState>,
    ctx: Ctx,
    Path(id): Path<i64>,
    Query(query): Query<PageQuery>,
) -> Result<Response, WebError> {
    let server = ServerBmc::get_by_id(&state.mm, &ctx, id).await?;
    if server.is_none() {
        return Err(WebError::ServerNotFound);
    }
    let server = server.unwrap();

    if server.user_id != ctx.user_id && !matches!(ctx.role, UserRole::Admin) {
        return Err(WebError::ServerNotAllowed);
    }

    let logs = ServerLogBmc::page(&state.mm, &ctx, id, query.offset, query.limit).await?;

    Ok((StatusCode::OK, Json(logs)).into_response())
}
