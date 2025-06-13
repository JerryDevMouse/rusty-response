use leptoaster::ToastBuilder;
use serde::Deserialize;
use thiserror::Error;

#[derive(Debug, Deserialize)]
pub struct BackendError {
    code: i64,
    error: String,
    details: Option<String>,
}

impl std::error::Error for BackendError {}

impl std::fmt::Display for BackendError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match &self.details {
            Some(d) => write!(f, "{} - {}. Details: {}", self.code, self.error, d),
            None => write!(f, "{} - {}.", self.code, self.error),
        }
    }
}

#[derive(Debug, Error)]
pub enum ResourceFetchError {
    #[error(transparent)]
    BackendError(#[from] BackendError),

    #[error("req error: {0}")]
    ReqwestError(#[from] reqwasm::Error),

    #[error("serde error: {0}")]
    SerdeError(#[from] serde_json::Error),
}

impl ResourceFetchError {
    pub fn into_toast(&self) -> ToastBuilder {
        let message = match &self {
            ResourceFetchError::BackendError(backend_error) => backend_error.to_string(),
            ResourceFetchError::ReqwestError(error) => {
                log::error!("Error occured during fetching resource: {}", error);
                String::from("Error occured during fetching resource")
            }
            ResourceFetchError::SerdeError(error) => {
                log::error!("Error occured during de/se: {}", error);
                String::from("Error occured during resource fetching")
            }
        };

        ToastBuilder::new(message)
            .with_level(leptoaster::ToastLevel::Error)
            .with_expiry(None)
            .with_position(leptoaster::ToastPosition::BottomRight)
    }
}
