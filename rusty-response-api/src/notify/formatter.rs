use std::sync::Arc;

use super::Result;
use crate::model::ServerLogLine;
use handlebars::Handlebars;
use serde::Serialize;
use tokio::sync::RwLock;

pub trait NotifierFormatter: Send + Sync {
    fn format(&self, line: &ServerLogLine) -> String;
}

#[derive(Clone)]
pub struct HJSFormatter {
    inner: Arc<RwLock<Handlebars<'static>>>,
}

impl HJSFormatter {
    pub fn new() -> Self {
        Self {
            inner: Arc::new(RwLock::new(Handlebars::new())),
        }
    }

    pub async fn load_format(&self, key: &str, format: &str) -> Result<()> {
        let mut lock = self.inner.write().await;
        lock.register_template_string(key, format)?;
        Ok(())
    }

    pub async fn format<T: Serialize>(&self, key: &str, data: &T) -> Result<String> {
        let lock = self.inner.read().await;
        let formatted = lock.render(key, data)?;
        Ok(formatted)
    }
}
