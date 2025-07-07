use crate::{
    ModelManager,
    model::{Ctx, PaginationArguments},
};

use super::Result;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sqlx::{FromRow, Row, Sqlite};
use time::PrimitiveDateTime;

#[derive(Debug, Clone, FromRow, Serialize)]
pub struct Notifier {
    pub id: i64,
    pub user_id: i64,
    pub server_id: i64,
    pub provider: String,
    pub credentials: Value,
    pub format: String,
    pub active: bool,
    pub created_at: PrimitiveDateTime,
    pub updated_at: PrimitiveDateTime,
}

#[derive(Debug, Clone, Deserialize)]
pub struct NotifierCreate {
    pub server_id: i64,
    pub provider: String,
    pub credentials: Value, // JSON object from request body
    pub format: String,
    pub active: Option<bool>,
}

impl NotifierCreate {
    pub fn new<S: Into<String>>(
        server_id: i64,
        provider: S,
        credentials: String,
        format: String,
        active: Option<bool>,
    ) -> Result<Self> {
        Ok(Self {
            server_id,
            provider: provider.into(),
            credentials: serde_json::from_str(&credentials)?,
            format,
            active,
        })
    }
}

pub struct NotifierBmc;

impl NotifierBmc {
    pub async fn notifiers_for(
        mm: &ModelManager,
        _ctx: &Ctx,
        server_id: i64,
    ) -> Result<Vec<Notifier>> {
        let rows = sqlx::query_as::<Sqlite, Notifier>("SELECT * FROM notifier WHERE server_id = ?")
            .bind(server_id)
            .fetch_all(&mm.pool)
            .await?;

        Ok(rows)
    }

    pub async fn find_by_id(
        mm: &ModelManager,
        _ctx: &Ctx,
        notifier_id: i64,
    ) -> Result<Option<Notifier>> {
        let row = sqlx::query_as::<Sqlite, Notifier>("SELECT * FROM notifier WHERE id = ?")
            .bind(notifier_id)
            .fetch_one(&mm.pool)
            .await;

        if let Err(sqlx::Error::RowNotFound) = row {
            return Ok(None);
        }

        Ok(Some(row.unwrap()))
    }

    pub async fn update_notifier(
        mm: &ModelManager,
        _ctx: &Ctx,
        notifier_id: i64,
        nfc: &NotifierCreate,
    ) -> Result<PrimitiveDateTime> {
        let now = time::UtcDateTime::now();
        let updated_at = PrimitiveDateTime::new(now.date(), now.time());
        let row = sqlx::query("UPDATE notifier SET server_id = ?, provider = ?, credentials = ?, format = ?, active = ?, updated_at = ? WHERE id = ? RETURNING updated_at")
            .bind(nfc.server_id)
            .bind(&nfc.provider)
            .bind(&nfc.credentials)
            .bind(&nfc.format)
            .bind(nfc.active)
            .bind(updated_at)
            .bind(notifier_id)
            .fetch_one(&mm.pool)
            .await?;
        let updated_at: PrimitiveDateTime = row.try_get("updated_at")?;
        Ok(updated_at)
    }

    pub async fn list(
        mm: &ModelManager,
        _ctx: &Ctx,
        server_id: i64,
        args: Option<PaginationArguments>,
    ) -> Result<Vec<Notifier>> {
        let result = if let Some(args) = args {
            sqlx::query_as::<Sqlite, Notifier>(
                "SELECT * FROM notifier WHERE server_id = ? LIMIT ? OFFSET ?",
            )
            .bind(server_id)
            .bind(args.limit)
            .bind(args.offset)
            .fetch_all(&mm.pool)
            .await?
        } else {
            sqlx::query_as::<Sqlite, Notifier>("SELECT * FROM notifier WHERE server_id = ?")
                .bind(server_id)
                .fetch_all(&mm.pool)
                .await?
        };

        Ok(result)
    }

    pub async fn delete_notifier_for(mm: &ModelManager, _ctx: &Ctx, server_id: i64) -> Result<()> {
        sqlx::query("DELETE FROM notifier WHERE server_id = ?")
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
        let format = nc.format;
        let active = nc.active.unwrap_or(false);

        let row = sqlx::query(
            "INSERT INTO notifier (user_id, server_id, provider, credentials, format, active) VALUES (?,?,?,?,?,?) RETURNING id, created_at, updated_at;"
        )
        .bind(user_id)
        .bind(server_id)
        .bind(&provider)
        .bind(&credentials)
        .bind(&format)
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
            format,
            created_at,
            updated_at,
        };

        Ok(notifier)
    }

    pub async fn all_ol(
        mm: &ModelManager,
        _ctx: &Ctx,
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

    pub async fn all(mm: &ModelManager, _ctx: &Ctx) -> Result<Vec<Notifier>> {
        let rows = sqlx::query_as::<Sqlite, Notifier>("SELECT * FROM notifier")
            .fetch_all(&mm.pool)
            .await?;

        Ok(rows)
    }

    pub async fn get(mm: &ModelManager, _ctx: &Ctx, id: i64) -> Result<Option<Notifier>> {
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

    pub async fn delete(mm: &ModelManager, _ctx: &Ctx, id: i64) -> Result<()> {
        sqlx::query("DELETE FROM notifier WHERE id = ?")
            .bind(id)
            .execute(&mm.pool)
            .await?;

        Ok(())
    }
}
