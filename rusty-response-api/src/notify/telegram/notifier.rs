use super::Result;
use async_trait::async_trait;
use eyre::eyre;
use frankenstein::{AsyncTelegramApi, client_reqwest::Bot, methods::SendMessageParams};
use serde::{Deserialize, Serialize};

use crate::notify::notifier::Notifier;

#[derive(Serialize, Deserialize, Clone)]
pub struct TelegramOptions {
    chat_id: i64,
    token: String,
}

#[cfg(test)]
impl TelegramOptions {
    pub fn new(chat_id: i64, token: &str) -> Self {
        Self {
            chat_id,
            token: token.to_string(),
        }
    }
}

#[derive(Default, Debug)]
pub struct TelegramNotifier {
    token: Option<String>,
    chat_id: Option<i64>,
    bot: Option<Bot>,
}

impl TelegramNotifier {
    pub fn new(creds: &str) -> Result<Self> {
        let mut tg = Self::default();
        tg.setup(creds)?;
        Ok(tg)
    }
}

#[async_trait]
impl Notifier for TelegramNotifier {
    fn setup(&mut self, credentials_str: &str) -> Result<()> {
        let opt: TelegramOptions = serde_json::from_str(credentials_str)?;
        let bot = Bot::new(&opt.token);
        self.bot = Some(bot);
        self.token = Some(opt.token);
        self.chat_id = Some(opt.chat_id);
        Ok(())
    }

    async fn notify(&self, line: String) -> Result<()> {
        if self.bot.is_none() || self.token.is_none() || self.chat_id.is_none() {
            return Err(super::Error::Other(eyre!(
                "Notifier hasn't been set up. (Telegram)"
            )));
        }
        let chat_id = self.chat_id.unwrap();
        let bot = self.bot.as_ref().unwrap();

        let params = SendMessageParams::builder()
            .chat_id(chat_id)
            .text(line)
            .build();

        bot.send_message(&params).await?;

        Ok(())
    }
}
