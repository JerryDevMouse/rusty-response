mod error;
mod notifier;
mod server;
mod server_log;
mod user;
mod user_action;

pub use notifier::{Notifier, NotifierBmc, NotifierCreate};
pub use server::{Server, ServerBmc, ServerCreate};
pub use server_log::{ServerLog, ServerLogBmc, ServerLogCreate};
pub use user::{User, UserBmc, UserClaims, UserCreate, UserRole};
pub use user_action::{UserAction, UserActionLog, UserActionLogBmc, UserActionLogCreate};

pub use error::{ModelError, Result};

use sqlx::migrate::Migrator;
use sqlx::sqlite::SqliteConnectOptions;
use sqlx::{Pool, Sqlite};
use std::path::Path;

#[derive(Clone)]
pub struct ModelManager {
    pool: Pool<Sqlite>,
}

impl ModelManager {
    pub fn new<P: AsRef<Path>>(path: P) -> Self {
        let pool_opt = SqliteConnectOptions::new()
            .create_if_missing(true)
            .thread_name(|x| format!("SqliteDB_{:x}", x))
            .filename(path);

        let pool = Pool::<Sqlite>::connect_lazy_with(pool_opt);

        Self { pool }
    }

    pub async fn migrate<P: AsRef<Path>>(&self, migrations: P) -> Result<()> {
        let migrator = Migrator::new(migrations.as_ref()).await?;
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
