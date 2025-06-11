use thiserror::Error;

pub type Result<T> = std::result::Result<T, ModelError>;

#[derive(Debug, Error)]
pub enum ModelError {
    #[error("Invalid user role: {given}")]
    InvalidUserRole { given: String },
    #[error("serde error: {0}")]
    SerdeErr(#[from] serde_json::Error),
    #[error("sqlx error: {0}")]
    SqlxErr(#[from] sqlx::Error),
    #[error("sqlx migration error: {0}")]
    SqlxMigrateErr(#[from] sqlx::migrate::MigrateError),
}
