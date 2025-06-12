use std::sync::Arc;

use rusty_response_api::{Ctx, ModelManager, Settings, channel, web};
use tokio::{net::TcpListener, sync::mpsc};
use tokio_util::sync::CancellationToken;
use tracing::{debug, info};
use tracing_subscriber::EnvFilter;

use eyre::Result;

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
    let config = Settings::global().database();

    debug!("Setting up SQLite database at: {}.", config.path());
    let mm = ModelManager::new(config.path());
    mm.migrate().await?;

    run(mm).await?;

    Ok(())
}

async fn run(mm: ModelManager) -> Result<()> {
    let (control_tx, control_rx) = mpsc::unbounded_channel();
    let cancel_token = CancellationToken::new();
    let child_token = cancel_token.child_token();
    let admin_ctx = Ctx::admin_root();
    let config = Settings::global();

    let state = web::app_state(
        &mm,
        config.app().jwt().jwt_secret(),
        &admin_ctx,
        control_tx.clone(),
    )
    .await?;

    let addr = format!("{}:{}", config.net().host(), config.net().port());
    let app = web::app(Arc::clone(&state));
    let listener = TcpListener::bind(&addr).await?;

    info!("Server started at {}", addr);

    let axum_handle = axum::serve(listener, app)
        .with_graceful_shutdown(web::shutdown_signal(cancel_token.clone(), control_tx));

    let servers_handle =
        channel::setup_monitoring_future(mm, control_rx, state.notify_manager.clone(), child_token);

    let _ = tokio::join!(axum_handle, servers_handle); // wait for both to finish

    info!("Goodbye!");

    Ok(())
}
