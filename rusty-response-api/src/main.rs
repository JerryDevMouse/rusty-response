#![allow(unused)]

mod channel;
mod crypt;
mod model;
mod notify;
mod web;

use std::{sync::Arc, time::Duration};

use crate::{
    channel::{ServerMessage, UnboundedMPSCController},
    model::{Ctx, ServerBmc, UserBmc, UserCreate},
    web::{AppState, RawState},
};

use axum::Router;
use eyre::Result;
pub use model::ModelManager;
use model::UserClaims;
use tokio::{net::TcpListener, signal, sync::mpsc};
use tokio_util::sync::CancellationToken;
use tracing::{debug, info, trace};
use tracing_subscriber::EnvFilter;

fn setup_tracing() {
    use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt};
    tracing_subscriber::registry()
        .with(fmt::layer())
        .with(EnvFilter::from_default_env())
        .with(tracing_error::ErrorLayer::default())
        .init();
}

#[tokio::main]
async fn main() -> Result<()> {
    setup_tracing();
    let mm = ModelManager::new("./sqlite.db");
    mm.migrate("./rusty-response-api/migrations").await?;

    run(mm).await?;

    Ok(())
}

async fn run(mm: ModelManager) -> Result<()> {
    let (control_tx, control_rx) = mpsc::unbounded_channel();
    let cancel_token = CancellationToken::new();
    let child_token = cancel_token.child_token();
    let admin_ctx = Ctx::admin_root();

    let state = web::app_state(&mm, "key", &admin_ctx, control_tx.clone()).await?;
    let app = web::app(Arc::clone(&state));
    let listener = TcpListener::bind("127.0.0.1:5000").await?;

    // TODO & FIXME: Configs
    info!("Server started at 127.0.0.1:5000");

    let axum_handle = axum::serve(listener, app)
        .with_graceful_shutdown(web::shutdown_signal(cancel_token.clone(), control_tx));

    let servers_handle =
        channel::setup_monitoring_future(mm, control_rx, state.notify_manager.clone(), child_token);

    tokio::join!(axum_handle, servers_handle); // wait for both to finish

    info!("Goodbye!");

    Ok(())
}
