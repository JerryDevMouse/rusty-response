mod middlewares;

mod notifier;
mod server;
mod user;

pub use notifier::routes as notify_routes;
use serde::Deserialize;
pub use server::routes as server_routes;
use tokio::sync::mpsc::UnboundedSender;
pub use user::routes as user_routes;

use crate::{ModelManager, channel::ControlMessage, notify::NotifyManager};

#[derive(Deserialize)]
pub struct PaginationQuery {
    limit: Option<i64>,
    offset: Option<i64>,
}

pub struct RawState {
    pub mm: ModelManager,
    secret: String,
    pub control_tx: UnboundedSender<ControlMessage>,
    pub notify_manager: NotifyManager,
}

pub type AppState = std::sync::Arc<RawState>;

impl RawState {
    pub fn new(
        mm: ModelManager,
        secret: String,
        tx: UnboundedSender<ControlMessage>,
        notify_manager: NotifyManager,
    ) -> AppState {
        AppState::new(Self {
            mm,
            secret,
            control_tx: tx,
            notify_manager,
        })
    }
}
