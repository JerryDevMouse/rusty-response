use axum::http;

use crate::model::Server;

#[derive(Debug)]
pub enum ServerStatus {
    Unreachable {
        reason: String,
        body: Vec<u8>,
        status_code: http::StatusCode,
    },
    Online {
        status_code: http::StatusCode,
        body: Vec<u8>,
    },
}

impl ServerStatus {
    pub fn unreachable<S: Into<String>>(
        reason: S,
        body: Vec<u8>,
        status_code: http::StatusCode,
    ) -> Self {
        Self::Unreachable {
            reason: reason.into(),
            body,
            status_code,
        }
    }
}

#[derive(Debug)]
pub enum ServerMessage {
    ServerStateChanged {
        status: ServerStatus,
        server: Server,
    },
    ChannelError {
        error: super::Error,
        server: Server,
    },
}

#[derive(Debug)]
pub enum ControlMessage {
    AddServer(Server),
    RemoveServer(i64),
    ModifyServer(Server),
    Shutdown,
}

impl ServerMessage {
    pub fn unreachable(status: ServerStatus, server: Server) -> Self {
        Self::ServerStateChanged { status, server }
    }

    pub fn error(error: super::Error, server: Server) -> Self {
        Self::ChannelError { error, server }
    }
}
