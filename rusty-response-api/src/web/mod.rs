mod error;
mod routes;
mod utils;

pub use error::WebError;
pub use routes::{AppState, RawState, server_routes, user_routes};
use tokio::sync::mpsc::UnboundedSender;
pub use utils::shutdown_signal;

use axum::Router;

use crate::{ModelManager, channel::ControlMessage};

// TODO: Provide config
pub fn app_state(
    mm: &ModelManager,
    jwt: &str,
    control_tx: UnboundedSender<ControlMessage>,
) -> AppState {
    RawState::new(mm.clone(), "key".to_string(), control_tx.clone())
}

pub fn app<S>(state: AppState) -> Router<S> {
    let all_routes = Router::new()
        .nest(
            "/api/v1/account/",
            routes::user_routes(AppState::clone(&state)),
        )
        .nest(
            "/api/v1/server/",
            routes::server_routes(AppState::clone(&state)),
        )
        .layer(tower_cookies::CookieManagerLayer::new())
        .with_state(AppState::clone(&state));

    all_routes
}
