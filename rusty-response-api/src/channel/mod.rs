use tokio::sync::mpsc;

mod error;
mod server;

pub use error::Error;
pub use server::{ControlMessage, ServerMessage, setup_monitoring_future};

/// MPSC channel controller to control sending commands back to our main application from "check" threads
pub struct UnboundedMPSCController<T> {
    receiever: mpsc::UnboundedReceiver<T>,
    owned_sender: mpsc::UnboundedSender<T>,
}

impl<T> UnboundedMPSCController<T> {
    pub fn new() -> Self {
        let (tx, rx) = mpsc::unbounded_channel::<T>();

        Self {
            owned_sender: tx,
            receiever: rx,
        }
    }

    pub fn get_sender(&self) -> mpsc::UnboundedSender<T> {
        self.owned_sender.clone()
    }

    pub fn get_recv_ref(&mut self) -> &mut mpsc::UnboundedReceiver<T> {
        &mut self.receiever
    }

    pub fn take_receiver(self) -> mpsc::UnboundedReceiver<T> {
        self.receiever
    }
}

impl<T> Default for UnboundedMPSCController<T> {
    fn default() -> Self {
        Self::new()
    }
}
