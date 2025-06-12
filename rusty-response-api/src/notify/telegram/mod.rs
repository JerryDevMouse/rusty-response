mod notifier;
pub use super::{Error, Result};

pub use notifier::TelegramNotifier;

#[cfg(test)]
pub use notifier::TelegramOptions;
