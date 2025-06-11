use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),

    #[error("http error: {0}")]
    ReqwestError(#[from] reqwest::Error),
}
