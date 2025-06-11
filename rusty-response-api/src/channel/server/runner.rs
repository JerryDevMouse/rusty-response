use std::{collections::BTreeMap, sync::Arc, time::Duration};

use axum::http;
use tokio::{
    sync::{Mutex, mpsc},
    task::JoinHandle,
};
use tokio_util::sync::CancellationToken;
use tracing::{debug, error, trace, warn};

use crate::{
    ModelManager,
    channel::{
        UnboundedMPSCController,
        server::{
            ServerStatus,
            types::{ControlMessage, ServerMessage},
        },
    },
    model::{Ctx, Server, ServerBmc},
    notify::NotifyManager,
};

async fn payload(
    server: Server,
    client: Arc<reqwest::Client>,
    sender: mpsc::UnboundedSender<ServerMessage>,
    cancellation_token: tokio_util::sync::CancellationToken,
    last_seen_status: bool,
) {
    let interval = Duration::from_secs(server.interval as u64);
    let timeout = Duration::from_secs(server.timeout as u64);

    let mut local_status = last_seen_status;

    loop {
        let result = async {
            let response = client.get(&server.url).timeout(timeout).send().await;

            let response = match response {
                Ok(resp) => resp,
                Err(e) => {
                    if local_status {
                        let message = ServerMessage::error(e.into(), server.clone());
                        sender.send(message).ok();
                        local_status = false;
                    }
                    return;
                }
            };

            let status = response.status();
            let mut body = Vec::new();
            match response.bytes().await {
                Ok(bytes) => body.extend_from_slice(&bytes),
                Err(e) => {
                    error!(
                        "Error during reading response body from server: {}. Error: {:#?}",
                        server.id, e
                    );
                    body.extend_from_slice(b"Unable to read body");
                }
            }

            if !status.is_success() {
                if local_status {
                    let message = ServerMessage::unreachable(
                        ServerStatus::Unreachable {
                            reason: "TODO".to_string(),
                            body,
                            status_code: status,
                        },
                        server.clone(),
                    );
                    sender.send(message).ok();
                    local_status = false;
                }
                return;
            }

            if !local_status {
                let message = ServerMessage::ServerStateChanged {
                    status: ServerStatus::Online {
                        status_code: status,
                        body,
                    },
                    server: server.clone(),
                };
                sender.send(message).ok();
                local_status = true;
            }

            // DEBUG: REMOVE THIS BLOCK IN PROD
            sender
                .send(ServerMessage::ServerStateChanged {
                    status: ServerStatus::Unreachable {
                        reason: format!("Sending from: {}", server.id),
                        status_code: http::StatusCode::OK,
                        body: b"TEST".to_vec(),
                    },
                    server: server.clone(),
                })
                .ok();
        };

        result.await;

        tokio::select! {
            _ = tokio::time::sleep(interval) => {},
            _ = cancellation_token.cancelled() => {
                trace!("Payload for server {} shut down successfully", server.id);
                break;
            }
        }
    }
}

pub async fn setup_monitoring_future(
    mm: ModelManager,
    control_rx: mpsc::UnboundedReceiver<ControlMessage>,
    notify_manager: NotifyManager,
    cancellation_token: CancellationToken,
) {
    let mut mpsc = UnboundedMPSCController::<ServerMessage>::new();
    let admin_ctx = Ctx::admin_root();

    let reqwest_client = Arc::new(
        reqwest::ClientBuilder::new()
            .user_agent(format!(
                "{} - {}",
                env!("CARGO_PKG_NAME"),
                env!("CARGO_PKG_VERSION")
            ))
            .build()
            .expect("unable to create reqwest client"),
    );

    let servers = ServerBmc::all(&mm, &admin_ctx)
        .await
        .expect("unable to fetch servers from database");

    let statuses = Arc::new(Mutex::new(BTreeMap::<i64, (i64, String)>::new()));
    let handles = Arc::new(Mutex::new(BTreeMap::<i64, JoinHandle<()>>::new()));

    {
        let mut status_lock = statuses.lock().await;
        for server in &servers {
            status_lock.insert(
                server.id,
                (
                    server.last_seen_status_code.unwrap_or(0),
                    server.last_seen_reason.clone().unwrap_or_default(),
                ),
            );
        }
    }
    {
        let mut handles_lock = handles.lock().await;
        for server in servers {
            trace!("Setting up: {:#?}", server);
            let reqwest_arc = Arc::clone(&reqwest_client);
            let tx = mpsc.get_sender();
            let child_token = cancellation_token.child_token();
            let server_id = server.id;
            let last_seen_status =
                http::StatusCode::from_u16(server.last_seen_status_code.unwrap_or(200) as u16)
                    .unwrap()
                    .is_success();

            let handle = tokio::spawn(async move {
                payload(server, reqwest_arc, tx, child_token, last_seen_status).await
            });
            handles_lock.insert(server_id, handle);
        }
    }
    let server_tx = mpsc.get_sender();

    // FUTURE 1: Handle ServerMessage
    let statuses_clone = Arc::clone(&statuses);
    let mm_clone = mm.clone();
    let admin_ctx_clone = admin_ctx.clone();
    let mut server_rx = mpsc.take_receiver();
    let updates = tokio::spawn(async move {
        while let Some(msg) = server_rx.recv().await {
            super::handle_server_response(
                msg,
                &mm_clone,
                &admin_ctx_clone,
                &notify_manager,
                Arc::clone(&statuses_clone),
            )
            .await;
        }
    });

    // FUTURE 2: Handle ControlMessage
    let mm_clone = mm.clone();
    let admin_ctx_clone = admin_ctx.clone();
    let statuses_clone = Arc::clone(&statuses);
    let handles_clone = Arc::clone(&handles);
    let reqwest_client_clone = Arc::clone(&reqwest_client);
    let control = tokio::spawn(async move {
        let mut control_rx = control_rx;
        while let Some(ctrl_msg) = control_rx.recv().await {
            debug!("Received control message: {:?}", ctrl_msg);
            match ctrl_msg {
                ControlMessage::AddServer(server) => {
                    let reqwest_arc = Arc::clone(&reqwest_client_clone);
                    let tx = server_tx.clone();
                    let child_token = cancellation_token.child_token();

                    {
                        let server_id = server.id;
                        {
                            let mut status_lock = statuses_clone.lock().await;
                            status_lock.insert(
                                server.id,
                                (
                                    server.last_seen_status_code.unwrap_or(0),
                                    server.last_seen_reason.clone().unwrap_or_default(),
                                ),
                            );
                        }

                        let handle = tokio::spawn(async move {
                            payload(server, reqwest_arc, tx, child_token, true).await;
                        });

                        {
                            let mut handles_lock = handles_clone.lock().await;
                            handles_lock.insert(server_id, handle);
                        }
                    }
                }
                ControlMessage::RemoveServer(server_id) => {
                    {
                        let mut status_lock = statuses_clone.lock().await;
                        if status_lock.remove_entry(&server_id).is_none() {
                            warn!(
                                "Tried to remove non-existing entry from statuses tree: {}",
                                server_id
                            );
                        }
                    }

                    {
                        let mut handles_lock = handles_clone.lock().await;
                        let handle = handles_lock.remove_entry(&server_id);
                        if let Some((id, handle)) = handle {
                            handle.abort();
                        } else {
                            warn!(
                                "Tried to remove non-existing entry from handles tree: {server_id}"
                            );
                        }
                    }
                }
                ControlMessage::ModifyServer(server) => {
                    let reqwest_arc = Arc::clone(&reqwest_client_clone);
                    let tx = server_tx.clone();
                    let child_token = cancellation_token.child_token();
                    let server_id = server.id;

                    let removed_status = {
                        let mut status_lock = statuses_clone.lock().await;
                        status_lock.remove_entry(&server_id)
                    };

                    if removed_status.is_none() {
                        warn!(
                            "Tried to remove non-existing entry from statuses tree: {}",
                            server_id
                        );
                    }

                    let removed_handle = {
                        let mut handles_lock = handles_clone.lock().await;
                        handles_lock.remove_entry(&server_id)
                    };

                    if let Some((_id, handle)) = removed_handle {
                        handle.abort();
                    } else {
                        warn!(
                            "Tried to modify non-existing server entry from handles tree: {}",
                            server_id
                        );
                    }

                    {
                        let mut status_lock = statuses_clone.lock().await;
                        status_lock.insert(
                            server.id,
                            (
                                server.last_seen_status_code.unwrap_or(0),
                                server.last_seen_reason.clone().unwrap_or_default(),
                            ),
                        );
                    }

                    let handle = tokio::spawn(async move {
                        payload(server, reqwest_arc, tx, child_token, true).await;
                    });

                    {
                        let mut handles_lock = handles_clone.lock().await;
                        handles_lock.insert(server_id, handle);
                    }
                }
                ControlMessage::Shutdown => {
                    debug!("Shutdown requested. Shutting down...");

                    {
                        let mut handles_lock = handles.lock().await;

                        for (server_id, handle) in handles_lock.iter_mut() {
                            handle.abort();
                        }

                        handles_lock.clear();
                    }

                    break;
                }
            }
        }
    });
    let _ = tokio::join!(updates, control);

    debug!("Monitoring backend has been shut down.");
}
