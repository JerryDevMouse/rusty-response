use axum::{
    Json, Router,
    extract::{Path, Query, State},
    middleware,
    response::{IntoResponse, Response},
    routing::{get, post},
};
use eyre::Context;
use reqwest::StatusCode;

use crate::{
    model::{Ctx, Server, ServerBmc, ServerCreate, UserAction, UserActionLogBmc, UserRole},
    web::{WebError, routes::PaginationQuery},
};

use super::{AppState, middlewares::verify_token_middleware};

pub fn routes<S>(state: AppState) -> Router<S> {
    Router::new()
        .route("/", post(create_server).get(list_servers))
        .route(
            "/{id}",
            get(get_server).delete(remove_server).put(update_server),
        )
        .layer(middleware::from_fn_with_state(
            AppState::clone(&state),
            verify_token_middleware,
        ))
        .with_state(state)
}

pub async fn create_server(
    State(state): State<AppState>,
    ctx: Ctx,
    Json(sc): Json<ServerCreate>,
) -> Result<Response, WebError> {
    let found = ServerBmc::get_by_name(&state.mm, &ctx, &sc.name).await?;
    if found.is_some() {
        return Err(WebError::ServerAlreadyExists);
    }

    let srv = ServerBmc::insert(&state.mm, &ctx, sc).await?;

    // Send control message to monitoring backend to create a new monitoring instance dynamically
    state
        .control_tx
        .send(crate::channel::ControlMessage::AddServer(srv.clone()))
        .wrap_err("Failed to send control message")?;

    UserActionLogBmc::log(&state.mm, &ctx, UserAction::server_create(srv.id)).await?;
    Ok((StatusCode::OK, Json(srv)).into_response())
}

pub async fn list_servers(
    State(state): State<AppState>,
    Query(query): Query<PaginationQuery>,
    ctx: Ctx,
) -> Result<Response, WebError> {
    let limit = query.limit.unwrap_or(10);
    let offset = query.offset.unwrap_or(0);

    let servers = ServerBmc::list(&state.mm, &ctx, Some((limit, offset).into())).await?;

    Ok((StatusCode::OK, Json(servers)).into_response())
}

pub async fn update_server(
    State(state): State<AppState>,
    ctx: Ctx,
    Path(id): Path<i64>,
    Json(sc): Json<ServerCreate>,
) -> Result<Response, WebError> {
    let found = ServerBmc::get_by_id(&state.mm, &ctx, id).await?;
    if found.is_none() {
        return Err(WebError::ServerNotFound);
    }

    let found = found.unwrap();
    let sc_clone = sc.clone();

    if found.user_id != ctx.user_id && !matches!(ctx.role, UserRole::Admin) {
        return Err(WebError::ServerNotAllowed);
    }

    let updated_at = ServerBmc::update_server(&state.mm, &ctx, id, sc).await?;

    let modified_server = Server {
        id,
        user_id: found.user_id,
        name: sc_clone.name,
        url: sc_clone.url,
        timeout: sc_clone.timeout.unwrap_or(found.timeout),
        interval: sc_clone.interval.unwrap_or(found.interval),
        last_seen_reason: found.last_seen_reason,
        last_seen_status_code: found.last_seen_status_code,
        is_turned_on: sc_clone.is_turned_on.unwrap_or(found.is_turned_on),
        created_at: found.created_at,
        updated_at,
    };

    state
        .control_tx
        .send(crate::channel::ControlMessage::ModifyServer(
            modified_server.clone(),
        ))
        .wrap_err("Failed to send control message")?;

    UserActionLogBmc::log(
        &state.mm,
        &ctx,
        UserAction::server_modify(modified_server.id),
    )
    .await?;
    Ok((StatusCode::OK, Json(modified_server)).into_response())
}

pub async fn remove_server(
    State(state): State<AppState>,
    ctx: Ctx,
    Path(id): Path<i64>,
) -> Result<Response, WebError> {
    let found = ServerBmc::get_by_id(&state.mm, &ctx, id).await?;
    if found.is_none() {
        return Err(WebError::ServerNotFound);
    }

    let srv = found.unwrap();

    if srv.user_id != ctx.user_id && !matches!(ctx.role, UserRole::Admin) {
        return Err(WebError::ServerNotAllowed);
    }

    ServerBmc::remove_by_id(&state.mm, &ctx, id).await?;

    state
        .control_tx
        .send(crate::channel::ControlMessage::RemoveServer(srv.id))
        .wrap_err("Failed to send control message")?;

    UserActionLogBmc::log(&state.mm, &ctx, UserAction::server_delete(srv.id)).await?;
    Ok((StatusCode::OK, Json(srv)).into_response())
}

pub async fn get_server(
    State(state): State<AppState>,
    ctx: Ctx,
    Path(id): Path<i64>,
) -> Result<Response, WebError> {
    let found = ServerBmc::get_by_id(&state.mm, &ctx, id).await?;
    if found.is_none() {
        return Err(WebError::ServerNotFound);
    }

    let srv = found.unwrap();

    if srv.user_id != ctx.user_id && !matches!(ctx.role, UserRole::Admin) {
        return Err(WebError::ServerNotAllowed);
    }

    // won't be logged because this is an API, user will get em whenever he opens his "Servers" page
    Ok((StatusCode::OK, Json(srv)).into_response())
}
