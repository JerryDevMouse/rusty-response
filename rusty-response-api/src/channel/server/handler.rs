use axum::{http, serve};
use tracing::{debug, error, info, trace};

use super::utils;
use std::{borrow::Cow, collections::BTreeMap, pin::Pin, sync::Arc};
use tokio::sync::Mutex;

use crate::{
    ModelManager,
    channel::ServerMessage,
    model::{Ctx, ServerBmc, ServerLogBmc, ServerLogCreate},
};

pub async fn handle_server_response(
    msg: ServerMessage,
    mm: &ModelManager,
    ctx: &Ctx,
    statuses: Arc<Mutex<BTreeMap<i64, (i64, String)>>>,
) {
    let mut statuses = statuses.lock().await;

    match msg {
        ServerMessage::ServerStateChanged { status, server_id } => match status {
            super::ServerStatus::Unreachable {
                reason,
                status_code,
                body,
            } => {
                handle_arm(
                    server_id,
                    status_code,
                    Some(reason),
                    body,
                    &mut statuses,
                    mm,
                    ctx,
                )
                .await;
            }
            super::ServerStatus::Online { status_code, body } => {
                handle_arm(server_id, status_code, None, body, &mut statuses, mm, ctx).await;
            }
        },
        ServerMessage::ChannelError { server_id, .. } => {
            handle_arm(
                server_id,
                http::StatusCode::INTERNAL_SERVER_ERROR,
                Some("Error occurred during fetching".to_string()),
                vec![],
                &mut statuses,
                mm,
                ctx,
            )
            .await;
        }
    }
}

async fn handle_arm(
    server_id: i64,
    status_code: http::StatusCode,
    reason: Option<String>,
    body: Vec<u8>,
    statuses: &mut BTreeMap<i64, (i64, String)>,
    mm: &ModelManager,
    ctx: &Ctx,
) {
    let code = status_code.as_u16() as i64;

    if utils::is_changed(statuses, server_id, code, reason.as_ref()) {
        utils::update_cache(statuses, server_id, code, reason.clone());
        ServerBmc::update_status(mm, ctx, server_id, reason.clone().unwrap_or_default(), code)
            .await;
    }

    trace!(
        "Recieved message: {:?}. From: {}",
        (status_code, &reason),
        server_id
    );
    let lossy_str = String::from_utf8_lossy(&body).into_owned();

    let log_line = ServerLogCreate::new(
        server_id,
        !status_code.is_success(),
        status_code.as_u16() as i64,
        Some(lossy_str),
        reason,
    );

    let result = ServerLogBmc::insert(mm, ctx, log_line.clone()).await;

    if let Err(e) = result {
        error!(
            "Error occured during logging server {} response: {}",
            server_id, e
        );
    }
}
