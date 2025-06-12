//! Notify Manager handles notifier registration, lookup, and deletion.
//!
//! Each notifier is stored by ID, and indexed by `server_id`.
//! Thread-safe access is ensured with `tokio::RwLock`.

mod discord;
mod error;
mod formatter;
mod notifier;
mod telegram;

use std::{
    collections::{BTreeMap, HashMap, HashSet},
    str::FromStr,
    sync::Arc,
};

use eyre::eyre;
use tokio::sync::RwLock;
use tracing::{error, trace};

use crate::{
    ModelManager,
    model::{Ctx, Notifier as NotifierModel, NotifierBmc, ServerLogLine},
    notify::{
        discord::DiscordNotifier, formatter::HJSFormatter, notifier::Notifier,
        telegram::TelegramNotifier,
    },
};

pub use error::{Error, Result};
pub use formatter::NotifierFormatter;

pub type ArcNotifier = Arc<dyn Notifier>;

#[derive(Debug)]
enum NotifierType {
    Telegram,
    Discord,
}

impl FromStr for NotifierType {
    type Err = Error;

    fn from_str(s: &str) -> std::result::Result<Self, Self::Err> {
        match s {
            "telegram" => Ok(Self::Telegram),
            "discord" => Ok(Self::Discord),
            _ => Err(Error::Other(eyre!("Invalid notifier type: {}", s))),
        }
    }
}

fn build_notifier(provider: NotifierType, credentials: &str) -> Result<ArcNotifier> {
    let notifier: Result<ArcNotifier> = match provider {
        NotifierType::Telegram => {
            let notifier = TelegramNotifier::new(credentials)?; // `?` propagates error
            Ok(Arc::new(notifier))
        }
        NotifierType::Discord => {
            let notifier = DiscordNotifier::new(credentials)?; // assuming similar API
            Ok(Arc::new(notifier))
        }
    };

    notifier
}

#[derive(Clone)]
struct NotifierMeta {
    pub server_id: i64,
    pub notifier_key: String,
    pub notifier: ArcNotifier,
}

/// Safe to clone: uses Arc internally
#[derive(Clone)]
pub struct NotifyManager {
    inner: Arc<RwLock<NotifyState>>,
    formatter: HJSFormatter,
}

struct NotifyState {
    by_id: BTreeMap<i64, NotifierMeta>,
    by_server: HashMap<i64, HashSet<i64>>, // server_id → set of notifier_ids
}

impl NotifyManager {
    pub fn new() -> Self {
        Self {
            inner: Arc::new(RwLock::new(NotifyState {
                by_id: BTreeMap::new(),
                by_server: HashMap::new(),
            })),
            formatter: HJSFormatter::new(),
        }
    }

    pub async fn extend_from_db(&self, mm: &ModelManager, ctx: &Ctx) -> Result<()> {
        let db_notifiers = NotifierBmc::all(mm, ctx).await?;
        let mut state = NotifyState {
            by_id: BTreeMap::new(),
            by_server: HashMap::new(),
        };

        for db_notifier in db_notifiers {
            if !db_notifier.active {
                continue;
            }

            let notifier_key = format!(
                "{}.{}.{}.{}",
                db_notifier.id, db_notifier.server_id, db_notifier.user_id, db_notifier.provider
            );

            self.formatter
                .load_format(&notifier_key, &db_notifier.format)
                .await?;

            let provider = match NotifierType::from_str(&db_notifier.provider) {
                Ok(p) => p,
                Err(e) => {
                    error!("Invalid notifier provider for ID {}: {}", db_notifier.id, e);
                    continue;
                }
            };

            let credentials_str = serde_json::to_string(&db_notifier.credentials)?;
            let arc_notifier = build_notifier(provider, &credentials_str);
            if let Err(e) = arc_notifier {
                error!("Unable to build notifier: {}. Error: {}", db_notifier.id, e);
                continue;
            }

            let arc_notifier = arc_notifier.unwrap();

            state.by_id.insert(
                db_notifier.id,
                NotifierMeta {
                    notifier_key,
                    server_id: db_notifier.server_id,
                    notifier: Arc::clone(&arc_notifier),
                },
            );

            state
                .by_server
                .entry(db_notifier.server_id)
                .or_default()
                .insert(db_notifier.id);

            trace!(
                "[NOTIFY] Setup notifier with ID: {}, for server {}",
                db_notifier.id, db_notifier.server_id
            );
        }

        *self.inner.write().await = state;
        Ok(())
    }

    pub async fn add(&self, notifier: &NotifierModel) -> Result<()> {
        let provider = NotifierType::from_str(&notifier.provider)?;
        let credentials_str = serde_json::to_string(&notifier.credentials)?;
        let arc_notifier = build_notifier(provider, &credentials_str)?;

        let notifier_key = format!(
            "{}.{}.{}.{}",
            notifier.id, notifier.server_id, notifier.user_id, notifier.provider
        );

        trace!("Generated notifier key: {}", notifier_key);

        self.formatter
            .load_format(&notifier_key, &notifier.format)
            .await?;

        let mut lock = self.inner.write().await;
        lock.by_id.insert(
            notifier.id,
            NotifierMeta {
                notifier_key,
                server_id: notifier.server_id,
                notifier: Arc::clone(&arc_notifier),
            },
        );
        lock.by_server
            .entry(notifier.server_id)
            .or_default()
            .insert(notifier.id);

        trace!("Notifier Manager: {:#?}", lock.by_server);
        Ok(())
    }

    pub async fn remove_by_nid(&self, notifier_id: i64) -> Result<()> {
        let mut lock = self.inner.write().await;
        if let Some(meta) = lock.by_id.remove(&notifier_id) {
            if let Some(set) = lock.by_server.get_mut(&meta.server_id) {
                set.remove(&notifier_id);
                if set.is_empty() {
                    lock.by_server.remove(&meta.server_id);
                }
            }
        }
        Ok(())
    }

    pub async fn remove_by_sid(&self, server_id: i64) -> Result<()> {
        let mut lock = self.inner.write().await;
        if let Some(ids) = lock.by_server.remove(&server_id) {
            for id in ids {
                lock.by_id.remove(&id);
            }
        }
        Ok(())
    }

    async fn get_by_sid(&self, server_id: i64) -> Vec<NotifierMeta> {
        let lock = self.inner.read().await;
        match lock.by_server.get(&server_id) {
            Some(id_set) => id_set
                .iter()
                .filter_map(|id| lock.by_id.get(id))
                .cloned()
                .collect(),
            None => vec![],
        }
    }
}

impl NotifyManager {
    pub async fn notify(&self, server_id: i64, line: ServerLogLine) -> Result<()> {
        let notifiers = self.get_by_sid(server_id).await;

        for notifier in notifiers {
            let formatted = self.formatter.format(&notifier.notifier_key, &line).await?;
            notifier.notifier.notify(formatted).await?;
        }

        Ok(())
    }
}

impl Default for NotifyManager {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod test {
    use time::{PrimitiveDateTime, UtcDateTime};

    use crate::notify::telegram::TelegramOptions;

    use super::*;

    fn get_mock(id: i64, user_id: i64, server_id: i64) -> NotifierModel {
        let utc = UtcDateTime::now();
        NotifierModel {
            id: id,
            user_id: user_id,
            server_id: server_id,
            provider: "telegram".to_string(),
            credentials: serde_json::to_value(TelegramOptions::new(-4444444, "tokenhere")).unwrap(),
            format: "{{server.id}}".to_string(),
            active: true,
            created_at: PrimitiveDateTime::new(utc.date(), utc.time()),
            updated_at: PrimitiveDateTime::new(utc.date(), utc.time()),
        }
    }

    #[tokio::test]
    async fn test_notify_manager_add() {
        let manager = NotifyManager::new();
        let notifier = get_mock(1, 1, 1);

        manager.add(&notifier).await.unwrap();

        assert!(!manager.get_by_sid(1).await.is_empty());
        assert!(manager.inner.read().await.by_id.contains_key(&1));
    }

    #[tokio::test]
    async fn test_notify_manager_remove() {
        let manager = NotifyManager::new();
        let notifier1 = get_mock(2, 0, 2);
        let notifier2 = get_mock(3, 0, 3);

        manager.add(&notifier1).await.unwrap();
        manager.add(&notifier2).await.unwrap();

        assert!(!manager.get_by_sid(2).await.is_empty());
        assert!(!manager.get_by_sid(3).await.is_empty());
        assert!(manager.inner.read().await.by_id.contains_key(&2));
        assert!(manager.inner.read().await.by_id.contains_key(&3));

        manager.remove_by_sid(2).await.unwrap();

        assert!(manager.get_by_sid(2).await.is_empty());
        assert!(!manager.get_by_sid(3).await.is_empty());
        assert!(!manager.inner.read().await.by_id.contains_key(&2));
        assert!(manager.inner.read().await.by_id.contains_key(&3));

        manager.remove_by_nid(3).await.unwrap();

        assert!(manager.get_by_sid(2).await.is_empty());
        assert!(manager.get_by_sid(3).await.is_empty());
        assert!(!manager.inner.read().await.by_id.contains_key(&2));
        assert!(!manager.inner.read().await.by_id.contains_key(&3));
    }
}
