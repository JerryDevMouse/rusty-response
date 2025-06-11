use tokio::{signal, sync::mpsc};
use tokio_util::sync::CancellationToken;
use tracing::info;

use crate::channel::ControlMessage;

pub async fn shutdown_signal(
    token: CancellationToken,
    shutdown_tx: mpsc::UnboundedSender<ControlMessage>,
) {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    tokio::select! {
        _ = ctrl_c => {
            println!();
            info!("Ctrl+C received. Please wait, this could take a while.");
            token.cancel();
            let _ = shutdown_tx.send(ControlMessage::Shutdown);
        }
    }
}
