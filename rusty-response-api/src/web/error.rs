use axum::{Json, http::StatusCode, response::IntoResponse};
use serde_json::json;

use crate::crypt::CryptError;

use thiserror::Error;

#[derive(Debug, Error)]
pub enum WebError {
    #[error("Cookie not found")]
    CookieNotFound,

    #[error("Invalid SID token provided: {0}")]
    InvalidToken(#[from] CryptError),

    #[error("User not found for ID: {0}")]
    UserNotFound(i64),

    #[error("Invalid credentials")]
    InvalidCredentials,

    #[error("User with username already exists")]
    UserAlreadyExists,

    #[error("Server with this name already exists")]
    ServerAlreadyExists,

    #[error("Server not found")]
    ServerNotFound,

    #[error("Not your server")]
    ServerNotAllowed,

    #[error(transparent)]
    NotifierError(#[from] crate::notify::Error),

    #[error("Internal server error")]
    DatabaseError(#[from] crate::model::ModelError),

    #[error("Internal server error")]
    InternalServerError(#[from] eyre::Error),
}

impl IntoResponse for WebError {
    fn into_response(self) -> axum::response::Response {
        let (status, message, details) = match &self {
            WebError::CookieNotFound => (
                StatusCode::UNAUTHORIZED,
                "Missing authentication cookie",
                None,
            ),
            WebError::InvalidToken(err) => (
                StatusCode::UNAUTHORIZED,
                "Invalid authentication token",
                Some(format!("Token error: {}", err)),
            ),
            WebError::UserNotFound(_) => (StatusCode::UNAUTHORIZED, "User not found", None),
            WebError::InvalidCredentials => (StatusCode::UNAUTHORIZED, "Invalid credentials", None),
            WebError::UserAlreadyExists => (StatusCode::CONFLICT, "User already exists", None),
            WebError::ServerAlreadyExists => (
                StatusCode::CONFLICT,
                "Server with such name already exists",
                None,
            ),
            WebError::ServerNotFound => (
                StatusCode::NOT_FOUND,
                "Server with such ID is not found",
                None,
            ),
            WebError::ServerNotAllowed => (
                StatusCode::FORBIDDEN,
                "You don't own that server to interact with it",
                None,
            ),
            WebError::NotifierError(e) => (
                StatusCode::BAD_REQUEST,
                "Notifier error occured.",
                Some(e.to_string()),
            ),
            WebError::DatabaseError(err) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Database error occurred. Try again later.",
                Some(format!("Error: {}", err)),
            ),
            WebError::InternalServerError(err) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "An unexpected error occurred",
                Some(format!("Internal error: {}", err)),
            ),
        };

        tracing::error!("Error occurred: {:?}", self);

        let body = Json(json!({
            "error": message,
            "code": status.as_u16(),
            "details": if cfg!(debug_assertions) { details } else { None }
        }));

        (status, body).into_response()
    }
}
