use axum::http;
use tracing::{error, trace};

use super::utils;
use std::{collections::BTreeMap, sync::Arc};
use tokio::sync::Mutex;

use crate::{
    ModelManager,
    channel::ServerMessage,
    model::{Ctx, Server, ServerBmc, ServerLogBmc, ServerLogCreate, ServerLogLine},
    notify::NotifyManager,
};

pub async fn handle_server_response(
    msg: ServerMessage,
    mm: &ModelManager,
    ctx: &Ctx,
    notify_manager: &NotifyManager,
    statuses: Arc<Mutex<BTreeMap<i64, (i64, String)>>>,
) {
    let mut statuses = statuses.lock().await;

    match msg {
        ServerMessage::ServerStateChanged { status, server } => match status {
            super::ServerStatus::Unreachable {
                reason,
                status_code,
                body,
            } => {
                handle_arm(
                    server,
                    status_code,
                    Some(reason),
                    body,
                    &mut statuses,
                    mm,
                    notify_manager,
                    ctx,
                )
                .await;
            }
            super::ServerStatus::Online { status_code, body } => {
                handle_arm(
                    server,
                    status_code,
                    None,
                    body,
                    &mut statuses,
                    mm,
                    notify_manager,
                    ctx,
                )
                .await;
            }
        },
        ServerMessage::ChannelError { server, .. } => {
            handle_arm(
                server,
                http::StatusCode::INTERNAL_SERVER_ERROR,
                Some("Error occurred during fetching".to_string()),
                vec![],
                &mut statuses,
                mm,
                notify_manager,
                ctx,
            )
            .await;
        }
    }
}

// TODO: Rewrite this
#[allow(clippy::too_many_arguments)]
async fn handle_arm(
    server: Server,
    status_code: http::StatusCode,
    reason: Option<String>,
    body: Vec<u8>,
    statuses: &mut BTreeMap<i64, (i64, String)>,
    mm: &ModelManager,
    notify_manager: &NotifyManager,
    ctx: &Ctx,
) {
    let code = status_code.as_u16() as i64;

    let server_id = server.id;

    if utils::is_changed(statuses, server_id, code, reason.as_ref()) {
        utils::update_cache(statuses, server_id, code, reason.clone());
        let result =
            ServerBmc::update_status(mm, ctx, server_id, reason.clone().unwrap_or_default(), code)
                .await;
        if let Err(e) = result {
            error!("Unable to update server status: {}", e);
        }
    }

    trace!(
        "Recieved message: {:?}. From: {}",
        (status_code, &reason),
        server_id
    );
    let lossy_str = String::from_utf8_lossy(&body).into_owned();

    let lc = ServerLogCreate::new(
        server_id,
        !status_code.is_success(),
        status_code.as_u16() as i64,
        Some(lossy_str),
        reason,
    );

    let result = ServerLogBmc::insert(mm, ctx, lc).await;

    if let Err(e) = &result {
        error!(
            "Error occured during logging server {} response: {}",
            server_id, e
        );
    }

    let log_line = result.unwrap();
    let log_line = ServerLogLine::new(server, log_line);

    let result = notify_manager.notify(server_id, log_line).await;
    if let Err(e) = result {
        error!("Unable to send notification for {server_id}: {e}");
    }
}
