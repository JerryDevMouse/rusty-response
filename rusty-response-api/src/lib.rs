pub mod channel;
pub mod config;
pub mod crypt;
pub mod model;
pub mod notify;
pub mod web;

use std::env;

pub use channel::{ControlMessage, Error, ServerMessage};
pub use config::Settings;
pub use crypt::{BcryptController, JWTController};
pub use model::{Ctx, ModelManager};
pub use notify::ArcNotifier;

pub fn log_runtime_info() {
    let cwd = env::current_dir().unwrap();
    let exe = env::current_exe().unwrap();
    let log_level = env::var("RUST_LOG").unwrap_or(String::from("None"));

    tracing::info!("Current Working Directory: {}", cwd.display());
    tracing::info!("Current Executable: {}", exe.display());
    tracing::info!("Log level: {log_level}");
}
