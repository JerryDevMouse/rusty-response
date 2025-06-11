use axum::{
    Json, Router,
    extract::State,
    middleware,
    response::{IntoResponse, Response},
    routing::post,
};
use reqwest::StatusCode;

use crate::{
    model::{Ctx, NotifierBmc, NotifierCreate, ServerBmc, UserRole},
    web::WebError,
};

use super::{AppState, middlewares::verify_token_middleware};

pub fn routes<S: Send + Sync>(state: AppState) -> Router<S> {
    Router::new()
        .route("/", post(notifier_add))
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
