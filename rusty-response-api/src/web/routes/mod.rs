mod middlewares;
use tokio::sync::mpsc::UnboundedSender;

mod notifier;
mod server;
mod server_log;
mod user;

pub use notifier::routes as notify_routes;
pub use server::routes as server_routes;
pub use server_log::routes as server_log_routes;
pub use user::routes as user_routes;

use crate::{ModelManager, channel::ControlMessage, notify::NotifyManager};

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
