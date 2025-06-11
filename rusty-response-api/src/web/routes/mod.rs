mod middlewares;

mod server;
mod user;

pub use server::routes as server_routes;
use tokio::sync::mpsc::UnboundedSender;
pub use user::routes as user_routes;

use crate::{ModelManager, channel::ControlMessage};

pub struct RawState {
    mm: ModelManager,
    secret: String,
    control_tx: UnboundedSender<ControlMessage>,
}

pub type AppState = std::sync::Arc<RawState>;

impl RawState {
    pub fn new(mm: ModelManager, secret: String, tx: UnboundedSender<ControlMessage>) -> AppState {
        AppState::new(Self {
            mm,
            secret,
            control_tx: tx,
        })
    }
}
