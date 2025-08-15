use super::Result;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, Row, Sqlite};
use time::PrimitiveDateTime;

use crate::{
    ModelManager,
    model::{Ctx, Page, Server},
};

#[derive(Debug, Clone, Serialize)]
pub struct ServerLogLine {
    pub server: Server,
    pub log: ServerLog,
}

impl ServerLogLine {
    pub fn new(server: Server, log: ServerLog) -> Self {
        Self { server, log }
    }
}

#[derive(Debug, Clone, FromRow, Serialize)]
pub struct ServerLog {
    pub id: i64,
    pub server_id: i64,
    pub failed: bool,
    pub status_code: i64,
    pub body: Option<String>,
    pub reason: Option<String>,
    pub created_at: PrimitiveDateTime,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct ServerLogCreate {
    pub server_id: i64,
    pub failed: bool,
    pub status_code: i64,
    pub body: Option<String>,
    pub reason: Option<String>,
}

impl ServerLogCreate {
    pub fn new(
        server_id: i64,
        failed: bool,
        status_code: i64,
        body: Option<String>,
        reason: Option<String>,
    ) -> Self {
        Self {
            server_id,
            failed,
            status_code,
            body,
            reason,
        }
    }
}

pub struct ServerLogBmc;

impl ServerLogBmc {
    pub async fn insert(mm: &ModelManager, _ctx: &Ctx, slc: ServerLogCreate) -> Result<ServerLog> {
        let server_id = slc.server_id;
        let failed = slc.failed;
        let status_code = slc.status_code;
        let body = slc.body;
        let reason = slc.reason;

        let row = sqlx::query(
            "INSERT INTO server_log (server_id, failed, status_code, body, reason) VALUES (?,?,?,?,?) RETURNING id, created_at",
        )
        .bind(server_id)
        .bind(failed)
        .bind(status_code)
        .bind(body.clone())
        .bind(reason.clone())
        .fetch_one(&mm.pool)
        .await?;

        let id = row.try_get("id")?;
        let created_at = row.try_get("created_at")?;

        let log = ServerLog {
            id,
            server_id,
            failed,
            status_code,
            body,
            reason,
            created_at,
        };

        Ok(log)
    }

    pub async fn delete(mm: &ModelManager, _ctx: &Ctx, id: i64) -> Result<()> {
        sqlx::query("DELETE FROM server_log WHERE id = ?")
            .bind(id)
            .execute(&mm.pool)
            .await?;

        Ok(())
    }
}

// Listing API
impl ServerLogBmc {
    pub async fn count(mm: &ModelManager, _ctx: &Ctx) -> Result<i64> {
        let row = sqlx::query("SELECT COUNT(*) as count FROM server_log")
            .fetch_one(&mm.pool)
            .await?;
        let count = row.try_get("count")?;
        Ok(count)
    }

    pub async fn list(
        mm: &ModelManager,
        _ctx: &Ctx,
        id: i64,
        offset: i64,
        limit: i64,
    ) -> Result<Vec<ServerLog>> {
        let logs = sqlx::query_as::<Sqlite, ServerLog>("SELECT * FROM server_log WHERE server_id = ? LIMIT ? OFFSET ?")
            .bind(id)
            .bind(limit)
            .bind(offset)
            .fetch_all(&mm.pool)
            .await?;

        Ok(logs)
    }

    pub async fn list_failed(
        mm: &ModelManager,
        _ctx: &Ctx,
        id: i64,
        offset: i64,
        limit: i64,
    ) -> Result<Vec<ServerLog>> {
        let logs = sqlx::query_as::<Sqlite, ServerLog>("SELECT * FROM server_log WHERE server_id = ? AND failed = 1 LIMIT ? OFFSET ?")
            .bind(id)
            .bind(limit)
            .bind(offset)
            .fetch_all(&mm.pool)
            .await?;
        Ok(logs)
    }

    pub async fn page(
        mm: &ModelManager,
        _ctx: &Ctx,
        id: i64,
        offset: i64,
        limit: i64,
    ) -> Result<Page<ServerLog>> {
        let items = Self::list(mm, _ctx, id, offset, limit).await?;
        let count = Self::count(mm, _ctx).await?;

        Ok(Page::new(items, count, limit, offset))
    }

    pub async fn page_failed(
        mm: &ModelManager,
        _ctx: &Ctx,
        id: i64,
        offset: i64,
        limit: i64,
    ) -> Result<Page<ServerLog>> {
        let items = Self::list_failed(mm, _ctx, id, offset, limit).await?;
        let count = Self::count(mm, _ctx).await?;

        Ok(Page::new(items, count, limit, offset))
    }
}
