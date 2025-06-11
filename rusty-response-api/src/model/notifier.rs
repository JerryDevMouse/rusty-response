use crate::model::notifier;
use crate::{ModelManager, model::Ctx};

use super::Result;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sqlx::{FromRow, Row, Sqlite};
use time::PrimitiveDateTime;

#[derive(Debug, Clone, FromRow, Serialize)]
pub struct Notifier {
    id: i64,
    user_id: i64,
    server_id: i64,
    provider: String,
    credentials: Value,
    active: bool,
    created_at: PrimitiveDateTime,
    updated_at: PrimitiveDateTime,
}

#[derive(Debug, Clone, Deserialize)]
pub struct NotifierCreate {
    server_id: i64,
    provider: String,
    credentials: Value, // JSON object from request body
    active: Option<bool>,
}

impl NotifierCreate {
    pub fn new<S: Into<String>>(
        server_id: i64,
        provider: S,
        credentials: String,
        active: Option<bool>,
    ) -> Result<Self> {
        Ok(Self {
            server_id,
            provider: provider.into(),
            credentials: serde_json::from_str(&credentials)?,
            active,
        })
    }
}

pub struct NotifierBmc;

impl NotifierBmc {
    pub async fn notifiers_for(
        mm: &ModelManager,
        ctx: &Ctx,
        server_id: i64,
    ) -> Result<Vec<Notifier>> {
        let rows = sqlx::query_as::<Sqlite, Notifier>("SELECT * FROM notifier WHERE server_id = ?")
            .bind(server_id)
            .fetch_all(&mm.pool)
            .await?;

        Ok(rows)
    }

    pub async fn delete_notifier_for(mm: &ModelManager, ctx: &Ctx, server_id: i64) -> Result<()> {
        let result = sqlx::query("DELETE FROM notifier WHERE server_id = ?")
            .bind(server_id)
            .execute(&mm.pool)
            .await?;

        Ok(())
    }
}

/// Database interactions
impl NotifierBmc {
    pub async fn insert(mm: &ModelManager, ctx: &Ctx, nc: NotifierCreate) -> Result<Notifier> {
        let user_id = ctx.user_id;
        let server_id = nc.server_id;
        let provider = nc.provider;
        let credentials = nc.credentials;
        let active = nc.active.unwrap_or(false);

        let row = sqlx::query(
            "INSERT INTO notifier (user_id, server_id, provider, credentials, active) VALUES (?,?,?,?,?) RETURNING id, created_at, updated_at;"
        )
        .bind(user_id)
        .bind(server_id)
        .bind(&provider)
        .bind(&credentials)
        .bind(active)
        .fetch_one(&mm.pool)
        .await?;

        let id = row.try_get("id")?;
        let created_at = row.try_get("created_at")?;
        let updated_at = row.try_get("updated_at")?;

        let notifier = Notifier {
            id,
            user_id,
            server_id,
            provider,
            credentials,
            active,
            created_at,
            updated_at,
        };

        Ok(notifier)
    }

    pub async fn all_ol(
        mm: &ModelManager,
        ctx: &Ctx,
        offset: i64,
        limit: i64,
    ) -> Result<Vec<Notifier>> {
        let rows = sqlx::query_as::<Sqlite, Notifier>("SELECT * FROM notifier OFFSET ? LIMIT ?")
            .bind(offset)
            .bind(limit)
            .fetch_all(&mm.pool)
            .await?;

        Ok(rows)
    }

    pub async fn all(mm: &ModelManager, ctx: &Ctx) -> Result<Vec<Notifier>> {
        let rows = sqlx::query_as::<Sqlite, Notifier>("SELECT * FROM notifier")
            .fetch_all(&mm.pool)
            .await?;

        Ok(rows)
    }

    pub async fn get(mm: &ModelManager, ctx: &Ctx, id: i64) -> Result<Option<Notifier>> {
        let result = sqlx::query_as::<Sqlite, Notifier>("SELECT * FROM notifier WHERE id = ?")
            .bind(id)
            .fetch_one(&mm.pool)
            .await;

        if let Err(sqlx::Error::RowNotFound) = result {
            return Ok(None);
        }

        let result = result.unwrap();
        Ok(Some(result))
    }

    pub async fn delete(mm: &ModelManager, ctx: &Ctx, id: i64) -> Result<()> {
        let result = sqlx::query("DELETE FROM notifier WHERE id = ?")
            .bind(id)
            .execute(&mm.pool)
            .await?;

        Ok(())
    }
}
