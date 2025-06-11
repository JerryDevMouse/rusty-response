use tokio_util::sync::CancellationToken;
use tracing::info;

pub async fn shutdown_signal(token: CancellationToken) {
    tokio::signal::ctrl_c()
        .await
        .expect("failed to listen for Ctrl+C");
    println!(); // print an empty line to escape ^C in tty 
    info!("Ctrl+C received. Please wait, this could take a while.");
    token.cancel();
}
