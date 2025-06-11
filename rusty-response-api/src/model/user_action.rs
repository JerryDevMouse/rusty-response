use super::Result;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use sqlx::{Row, Sqlite};
use time::PrimitiveDateTime;

use crate::{ModelManager, model::Ctx};

static USER_ACTIONS: [&str; 6] = [
    // Server Actions
    "server_create",
    "server_delete",
    "server_modify",
    // User Actions
    "user_signup",
    "user_signin",
    "user_verifyauth",
];

pub enum UserAction {
    ServerCreate { server_id: i64 },
    ServerDelete { server_id: i64 },
    ServerModify { server_id: i64 },
    UserSignup { user_id: i64 },
    UserSignin { user_id: i64 },
    UserVerifyAuth { user_id: i64 },
}

impl UserAction {
    pub fn disassemble(&self) -> (String, Option<i64>) {
        match &self {
            UserAction::ServerCreate { server_id } => (self.to_string(), Some(*server_id)),
            UserAction::ServerDelete { server_id } => (self.to_string(), Some(*server_id)),
            UserAction::ServerModify { server_id } => (self.to_string(), Some(*server_id)),
            UserAction::UserSignup { user_id } => (self.to_string(), Some(*user_id)),
            UserAction::UserSignin { user_id } => (self.to_string(), Some(*user_id)),
            UserAction::UserVerifyAuth { user_id } => (self.to_string(), Some(*user_id)),
        }
    }

    pub fn user_signup(user_id: i64) -> Self {
        Self::UserSignup { user_id }
    }

    pub fn user_signin(user_id: i64) -> Self {
        Self::UserSignin { user_id }
    }

    pub fn user_verifyauth(user_id: i64) -> Self {
        Self::UserVerifyAuth { user_id }
    }

    pub fn server_create(server_id: i64) -> Self {
        Self::ServerCreate { server_id }
    }

    pub fn server_modify(server_id: i64) -> Self {
        Self::ServerModify { server_id }
    }

    pub fn server_delete(server_id: i64) -> Self {
        Self::ServerDelete { server_id }
    }
}

impl std::fmt::Display for UserAction {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            UserAction::ServerCreate { .. } => write!(f, "server_create"),
            UserAction::ServerDelete { .. } => write!(f, "server_delete"),
            UserAction::ServerModify { .. } => write!(f, "server_modify"),
            UserAction::UserSignup { .. } => write!(f, "user_signup"),
            UserAction::UserSignin { .. } => write!(f, "user_signin"),
            UserAction::UserVerifyAuth { .. } => write!(f, "user_verifyauth"),
        }
    }
}

#[derive(Debug, Clone, FromRow, Serialize)]
pub struct UserActionLog {
    pub id: i64,
    pub user_id: i64,
    pub action: String,
    pub action_entity: Option<i64>,
    pub created_at: PrimitiveDateTime,
}

#[derive(Debug, Clone, Deserialize)]
pub struct UserActionLogCreate {
    pub action: String,
    pub action_entity: Option<i64>,
}

impl UserActionLogCreate {
    pub fn new<S: Into<String>>(action: S, action_entity: Option<i64>) -> Self {
        Self {
            action: action.into(),
            action_entity,
        }
    }
}

pub struct UserActionLogBmc;

/// Validation
impl UserActionLogBmc {
    pub fn validate_log(ualc: &UserActionLogCreate) -> bool {
        USER_ACTIONS.contains(&ualc.action.as_str())
    }
}

/// Database interactions
/// TODO: Advanced filters
impl UserActionLogBmc {
    pub async fn insert(
        mm: &ModelManager,
        ctx: &Ctx,
        ualc: UserActionLogCreate,
    ) -> Result<UserActionLog> {
        let user_id = ctx.user_id;
        let action = ualc.action;
        let action_entity = ualc.action_entity;

        let row = sqlx::query(
            "INSERT INTO user_action_log (user_id, action, action_entity) VALUES (?,?,?) RETURNING id, created_at",
        )
        .bind(user_id)
        .bind(&action)
        .bind(action_entity)
        .fetch_one(&mm.pool)
        .await?;

        let id: i64 = row.try_get("id")?;
        let created_at: PrimitiveDateTime = row.try_get("created_at")?;

        let log_line = UserActionLog {
            id,
            user_id,
            action,
            action_entity,
            created_at,
        };

        Ok(log_line)
    }

    pub async fn all(mm: &ModelManager, _ctx: &Ctx) -> Result<Vec<UserActionLog>> {
        let logs: Vec<UserActionLog> = sqlx::query_as("SELECT * FROM user_action_log")
            .fetch_all(&mm.pool)
            .await?;

        Ok(logs)
    }

    pub async fn get(mm: &ModelManager, _ctx: &Ctx, id: i64) -> Result<Option<UserActionLog>> {
        let result =
            sqlx::query_as::<Sqlite, UserActionLog>("SELECT * FROM user_action_log WHERE id = ?")
                .bind(id)
                .fetch_one(&mm.pool)
                .await;

        if let Err(sqlx::Error::RowNotFound) = result {
            return Ok(None);
        }
        let result = result?;

        Ok(Some(result))
    }

    pub async fn delete(mm: &ModelManager, _ctx: &Ctx, id: i64) -> Result<()> {
        sqlx::query("DELETE FROM user_action_log WHERE id = ?")
            .bind(id)
            .execute(&mm.pool)
            .await?;

        Ok(())
    }
}

/// Shorthands
impl UserActionLogBmc {
    pub async fn log(mm: &ModelManager, ctx: &Ctx, action: UserAction) -> Result<UserActionLog> {
        let (action, entity) = action.disassemble();
        let log = Self::insert(
            mm,
            ctx,
            UserActionLogCreate {
                action,
                action_entity: entity,
            },
        )
        .await?;

        Ok(log)
    }
}
