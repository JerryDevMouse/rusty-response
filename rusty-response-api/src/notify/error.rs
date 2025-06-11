use thiserror::Error;

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, Error)]
pub enum Error {
    #[error(transparent)]
    IoError(#[from] std::io::Error),

    #[error("serde error: {0}")]
    SerdeErr(#[from] serde_json::Error),

    #[error("telegram error: {0}")]
    TelegramErr(#[from] frankenstein::Error),

    #[error("discord error: {0}")]
    DiscordErr(#[from] discord_webhook2::error::DiscordWebhookError),

    #[error("database error: {0}")]
    ModelErr(#[from] crate::model::ModelError),

    #[error("format error: {0}")]
    FormatterErr(#[from] handlebars::RenderError),

    #[error("error: {0}")]
    Other(#[from] eyre::Report),
}
