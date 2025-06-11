use crate::notify::NotifierFormatter;

use super::Result;
use async_trait::async_trait;

#[async_trait]
pub trait Notifier: Send + Sync {
    fn setup(&mut self, credentials_str: &str) -> Result<()>;
    async fn notify(&self, line: String) -> Result<()>;
}
