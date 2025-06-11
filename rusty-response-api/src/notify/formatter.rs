use std::sync::Arc;

use super::Result;
use crate::model::{Notifier as NotifierModel, ServerLogLine};
use handlebars::{Handlebars, Template};
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

    pub async fn load_format(&self, key: &str, format: &str) {
        let mut lock = self.inner.write().await;
        lock.register_template_string(key, format.to_string());
    }

    pub async fn format<T: Serialize>(&self, key: &str, data: &T) -> Result<String> {
        let mut lock = self.inner.write().await;
        let formatted = lock.render(key, data)?;
        Ok(formatted)
    }
}
