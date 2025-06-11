//! Notify Manager handles notifier registration, lookup, and deletion.
//!
//! Each notifier is stored by ID, and indexed by `server_id`.
//! Thread-safe access is ensured with `tokio::RwLock`.

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
    model::{Ctx, Notifier as NotifierModel, NotifierBmc},
    notify::{notifier::Notifier, telegram::TelegramNotifier},
};

pub use error::{Error, Result};

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

fn build_notifier(provider: NotifierType, credentials: &str) -> ArcNotifier {
    match provider {
        NotifierType::Telegram => Arc::new(TelegramNotifier::new(credentials)),
        NotifierType::Discord => unimplemented!("Discord notifier not implemented yet"),
    }
}

struct NotifierMeta {
    pub server_id: i64,
    pub notifier: ArcNotifier,
}

/// Safe to clone: uses Arc internally
#[derive(Clone)]
pub struct NotifyManager {
    inner: Arc<RwLock<NotifyState>>,
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
        }
    }

    pub async fn extend_from_db(&self, mm: &ModelManager, ctx: &Ctx) -> Result<()> {
        let db_notifiers = NotifierBmc::all(mm, ctx).await?;
        let mut state = NotifyState {
            by_id: BTreeMap::new(),
            by_server: HashMap::new(),
        };

        for db_notifier in db_notifiers {
            let provider = match NotifierType::from_str(&db_notifier.provider) {
                Ok(p) => p,
                Err(e) => {
                    error!("Invalid notifier provider for ID {}: {}", db_notifier.id, e);
                    continue;
                }
            };

            let credentials_str = serde_json::to_string(&db_notifier.credentials)?;
            let arc_notifier = build_notifier(provider, &credentials_str);

            state.by_id.insert(
                db_notifier.id,
                NotifierMeta {
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
        let arc_notifier = build_notifier(provider, &credentials_str);

        let mut lock = self.inner.write().await;
        lock.by_id.insert(
            notifier.id,
            NotifierMeta {
                server_id: notifier.server_id,
                notifier: Arc::clone(&arc_notifier),
            },
        );
        lock.by_server
            .entry(notifier.server_id)
            .or_default()
            .insert(notifier.id);

        Ok(())
    }

    pub async fn modify(&self, notifier: &NotifierModel) -> Result<()> {
        self.remove_by_nid(notifier.id).await?;
        self.add(notifier).await
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

    pub async fn get_by_sid(&self, server_id: i64) -> Vec<ArcNotifier> {
        let lock = self.inner.read().await;
        match lock.by_server.get(&server_id) {
            Some(id_set) => id_set
                .iter()
                .filter_map(|id| lock.by_id.get(id))
                .map(|meta| Arc::clone(&meta.notifier))
                .collect(),
            None => vec![],
        }
    }
}

impl NotifyManager {
    pub async fn notify(&self, server_id: i64, line: String) -> Result<()> {
        let notifiers = self.get_by_sid(server_id).await;

        for notifier in notifiers {
            notifier.notify(line.clone()).await;
        }

        Ok(())
    }
}
