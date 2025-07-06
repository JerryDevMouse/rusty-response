use eyre::Result;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use sqlx::{Row, Sqlite};
use time::PrimitiveDateTime;

use super::{Ctx, ModelManager};

#[derive(Debug, Clone, FromRow, Serialize)]
pub struct Server {
    pub id: i64,
    pub user_id: i64,

    pub name: String,
    pub url: String,

    pub timeout: i64,
    pub interval: i64,

    pub last_seen_status_code: Option<i64>,
    pub last_seen_reason: Option<String>,

    pub is_turned_on: bool,

    pub created_at: time::PrimitiveDateTime,
    pub updated_at: time::PrimitiveDateTime,
}

#[derive(Deserialize, Debug, Clone)]
pub struct ServerCreate {
    pub name: String,
    pub url: String,
    pub timeout: Option<i64>,
    pub interval: Option<i64>,
    pub is_turned_on: Option<bool>,
}

impl ServerCreate {
    pub fn new<S: Into<String>>(
        name: S,
        url: S,
        timeout: Option<i64>,
        interval: Option<i64>,
        is_turned_on: Option<bool>,
    ) -> Self {
        Self {
            name: name.into(),
            url: url.into(),
            timeout,
            interval,
            is_turned_on,
        }
    }
}

pub struct ServerBmc;

impl ServerBmc {
    pub async fn insert(mm: &ModelManager, ctx: &Ctx, sc: ServerCreate) -> Result<Server> {
        let user_id = ctx.user_id;
        let name = sc.name;
        let url = sc.url;
        let timeout = sc.timeout.unwrap_or(10);
        let interval = sc.interval.unwrap_or(60);
        let is_turned_on = sc.is_turned_on.unwrap_or(false);

        let row = sqlx::query(
            "INSERT INTO server (user_id, name, url, timeout, interval, is_turned_on) \
            VALUES (?, ?, ?, ?, ?, ?) RETURNING id, created_at, updated_at",
        )
        .bind(user_id)
        .bind(&name)
        .bind(&url)
        .bind(timeout)
        .bind(interval)
        .bind(is_turned_on)
        .fetch_one(&mm.pool)
        .await?;

        let id: i64 = row.try_get("id")?;
        let created_at: PrimitiveDateTime = row.try_get("created_at")?;
        let updated_at: PrimitiveDateTime = row.try_get("updated_at")?;

        Ok(Server {
            id,
            user_id,
            name,
            url,
            timeout,
            interval,
            last_seen_reason: None,
            last_seen_status_code: None,
            is_turned_on,
            created_at,
            updated_at,
        })
    }

    pub async fn update_status<S: Into<String>>(
        mm: &ModelManager,
        _ctx: &Ctx,
        id: i64,
        reason: S,
        code: i64,
    ) -> Result<()> {
        sqlx::query(
            "UPDATE server SET last_seen_reason = ?, last_seen_status_code = ? WHERE id = ?",
        )
        .bind(reason.into())
        .bind(code)
        .bind(id)
        .execute(&mm.pool)
        .await?;

        Ok(())
    }

    pub async fn update_server(
        mm: &ModelManager,
        _ctx: &Ctx,
        id: i64,
        sc: ServerCreate,
    ) -> Result<PrimitiveDateTime> {
        let name = sc.name;
        let url = sc.url;
        let timeout = sc.timeout.unwrap_or(10);
        let interval = sc.interval.unwrap_or(60);
        let is_turned_on = sc.is_turned_on.unwrap_or(false);
        let now = time::UtcDateTime::now();
        let updated_at = PrimitiveDateTime::new(now.date(), now.time());

        sqlx::query(
            "UPDATE server SET name = ?, url = ?, timeout = ?, interval = ?, is_turned_on = ?, updated_at = ? WHERE id = ?"
        )
        .bind(&name)
        .bind(&url)
        .bind(timeout)
        .bind(interval)
        .bind(is_turned_on)
        .bind(updated_at)
        .bind(id)
        .execute(&mm.pool)
        .await?;

        Ok(updated_at)
    }

    pub async fn all(mm: &ModelManager, _ctx: &Ctx) -> Result<Vec<Server>> {
        let result = sqlx::query_as::<Sqlite, Server>("SELECT * FROM server;")
            .fetch_all(&mm.pool)
            .await?;

        Ok(result)
    }

    pub async fn all_for_user(mm: &ModelManager, ctx: &Ctx) -> Result<Vec<Server>> {
        let result = sqlx::query_as::<Sqlite, Server>("SELECT * FROM server WHERE user_id = ?;")
            .bind(&ctx.user_id)
            .fetch_all(&mm.pool)
            .await?;

        Ok(result)
    }

    pub async fn get_by_name(mm: &ModelManager, _ctx: &Ctx, name: &str) -> Result<Option<Server>> {
        let result = sqlx::query_as::<Sqlite, Server>("SELECT * FROM server WHERE name = ?")
            .bind(name)
            .fetch_one(&mm.pool)
            .await;

        if let Err(sqlx::Error::RowNotFound) = result {
            return Ok(None);
        }

        let result = result?;

        Ok(Some(result))
    }

    pub async fn get_by_id(mm: &ModelManager, _ctx: &Ctx, id: i64) -> Result<Option<Server>> {
        let result = sqlx::query_as::<Sqlite, Server>("SELECT * FROM server WHERE id = ?")
            .bind(id)
            .fetch_one(&mm.pool)
            .await;

        if let Err(sqlx::Error::RowNotFound) = result {
            return Ok(None);
        }

        let result = result?;
        Ok(Some(result))
    }

    pub async fn remove_by_id(mm: &ModelManager, _ctx: &Ctx, id: i64) -> Result<()> {
        sqlx::query("DELETE FROM server WHERE id = ?")
            .bind(id)
            .execute(&mm.pool)
            .await?;

        Ok(())
    }
}
