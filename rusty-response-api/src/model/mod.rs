mod error;
mod notifier;
mod server;
mod server_log;
mod user;
mod user_action;

pub use notifier::{Notifier, NotifierBmc, NotifierCreate};
use serde::Deserialize;
pub use server::{Server, ServerBmc, ServerCreate};
pub use server_log::{ServerLog, ServerLogBmc, ServerLogCreate, ServerLogLine};
pub use user::{User, UserBmc, UserClaims, UserCreate, UserRole};
pub use user_action::{UserAction, UserActionLog, UserActionLogBmc, UserActionLogCreate};

pub use error::{ModelError, Result};

use sqlx::sqlite::SqliteConnectOptions;
use sqlx::{Pool, Sqlite};
use std::path::Path;

#[derive(Debug, Clone, Deserialize)]
pub struct PaginationArguments {
    pub limit: i64,
    pub offset: i64,
}

impl From<(i64, i64)> for PaginationArguments {
    fn from(value: (i64, i64)) -> Self {
        Self {
            limit: value.0,
            offset: value.1,
        }
    }
}

#[derive(Clone)]
pub struct ModelManager {
    pool: Pool<Sqlite>,
}

impl ModelManager {
    pub fn new<P: AsRef<Path>>(path: P) -> Self {
        let path = path.as_ref();
        let mut final_path = path.to_owned();
        if !path.is_absolute() {
            final_path = std::env::current_exe()
                .expect("unable to get exe")
                .parent()
                .expect("unable to get exe parent directory")
                .join(path)
                .to_path_buf();
        }

        let pool_opt = SqliteConnectOptions::new()
            .create_if_missing(true)
            .thread_name(|x| format!("SqliteDB_{:x}", x))
            .filename(final_path);

        let pool = Pool::<Sqlite>::connect_lazy_with(pool_opt);

        Self { pool }
    }

    pub async fn migrate(&self) -> Result<()> {
        let migrator =
            sqlx::migrate::Migrator::new(Path::new("./rusty-response-api/migrations")).await?;
        migrator.run(&self.pool).await?;
        Ok(())
    }
}

#[derive(Clone, Debug)]
pub struct Ctx {
    pub user_id: i64,
    pub role: UserRole,
}

impl Ctx {
    pub fn admin_root() -> Self {
        Self {
            user_id: 0,
            role: UserRole::Admin,
        }
    }

    pub fn new(user_id: i64, role: UserRole) -> Self {
        Self { user_id, role }
    }
}
