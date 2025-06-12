mod error;
mod routes;
mod utils;

pub use error::WebError;
pub use routes::{AppState, RawState, server_routes, user_routes};
use tokio::sync::mpsc::UnboundedSender;
pub use utils::shutdown_signal;

use axum::Router;

use crate::{ModelManager, channel::ControlMessage, model::Ctx, notify::NotifyManager};

pub async fn app_state(
    mm: &ModelManager,
    jwt: &str,
    ctx: &Ctx,
    control_tx: UnboundedSender<ControlMessage>,
) -> Result<AppState, eyre::Report> {
    let notify_manager = NotifyManager::new();
    notify_manager.extend_from_db(mm, ctx).await?;

    Ok(RawState::new(
        mm.clone(),
        jwt.to_string(),
        control_tx.clone(),
        notify_manager,
    ))
}

pub fn app<S>(state: AppState) -> Router<S> {
    Router::new()
        .nest(
            "/api/v1/account/",
            routes::user_routes(AppState::clone(&state)),
        )
        .nest(
            "/api/v1/server/",
            routes::server_routes(AppState::clone(&state)),
        )
        .nest(
            "/api/v1/notify/",
            routes::notify_routes(AppState::clone(&state)),
        )
        .layer(tower_cookies::CookieManagerLayer::new())
        .with_state(AppState::clone(&state))
}
