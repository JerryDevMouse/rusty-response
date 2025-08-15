use crate::ModelManager;
use crate::crypt::BcryptController;
use crate::model::ModelError;
use eyre::Result;
use serde::{Deserialize, Serialize};
use sqlx::{Row, Sqlite};
use utoipa::ToSchema;
use std::fmt::Display;
use std::str::FromStr;
use time::PrimitiveDateTime;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, Default, ToSchema)]
pub enum UserRole {
    Admin,
    #[default]
    User,
}

impl Display for UserRole {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let str = match self {
            UserRole::Admin => "admin".to_string(),
            UserRole::User => "user".to_string(),
        };
        write!(f, "{}", str)
    }
}

impl FromStr for UserRole {
    type Err = super::ModelError;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "admin" => Ok(UserRole::Admin),
            "user" => Ok(UserRole::User),
            _ => Err(ModelError::InvalidUserRole {
                given: s.to_string(),
            }),
        }
    }
}

#[derive(Serialize, Debug, Clone, sqlx::FromRow, ToSchema)]
#[cfg_attr(feature = "test-utils", derive(Deserialize))]
pub struct User {
    pub id: i64,
    pub username: String,
    #[serde(skip_serializing)]
    pub password_hash: String,
    pub role: String,
    pub created_at: time::PrimitiveDateTime,
    pub updated_at: time::PrimitiveDateTime,
}

#[derive(Deserialize, Debug, ToSchema)]
#[cfg_attr(feature = "test-utils", derive(Serialize))]
pub struct UserCreate {
    pub username: String,
    pub password_raw: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    role: Option<UserRole>,
}

impl UserCreate {
    pub fn new(username: String, password_raw: String, role: Option<UserRole>) -> Self {
        Self {
            username,
            password_raw,
            role,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserClaims {
    pub sub: String,
    pub exp: i64,
}

impl UserClaims {
    pub fn new<S: Into<String>>(sub: S, exp: i64) -> Self {
        Self {
            sub: sub.into(),
            exp,
        }
    }
}

pub struct UserBmc;

impl UserBmc {
    pub async fn insert(mm: &ModelManager, uc: UserCreate) -> Result<User> {
        let role = uc.role.unwrap_or_default();
        let password_hash = BcryptController::encrypt(uc.password_raw)?;
        let username = uc.username;

        let result = sqlx::query(
            "INSERT INTO user (username, password_hash, role) VALUES (?, ?, ?) RETURNING id, created_at, updated_at",
        )
        .bind(username.to_owned())
        .bind(password_hash)
        .bind(role.to_string())
        .fetch_one(&mm.pool)
        .await?;

        let id: i64 = result.try_get("id")?;
        let created_at: PrimitiveDateTime = result.try_get("created_at")?;
        let updated_at: PrimitiveDateTime = result.try_get("updated_at")?;
        let user = User {
            id,
            username,
            password_hash: "OMITTED".to_string(),
            role: role.to_string(),
            created_at,
            updated_at,
        };

        Ok(user)
    }

    pub async fn find_by_username(mm: &ModelManager, username: &str) -> Result<Option<User>> {
        let user = sqlx::query_as::<Sqlite, User>("SELECT * FROM user WHERE username = ?")
            .bind(username)
            .fetch_one(&mm.pool)
            .await;

        if let Err(sqlx::Error::RowNotFound) = user {
            return Ok(None);
        }

        Ok(Some(user?))
    }

    pub async fn get_role_by_id(mm: &ModelManager, id: i64) -> Result<Option<UserRole>> {
        let role = sqlx::query("SELECT role FROM user WHERE id = ?")
            .bind(id)
            .fetch_one(&mm.pool)
            .await;

        if let Err(sqlx::Error::RowNotFound) = role {
            return Ok(None);
        }

        let role = role?;
        let role_str: String = role.try_get("role")?;
        let user_role = UserRole::from_str(&role_str).unwrap(); // trust database integrity

        Ok(Some(user_role))
    }
}
