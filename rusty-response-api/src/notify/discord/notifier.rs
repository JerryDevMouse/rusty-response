use super::Result;
use async_trait::async_trait;
use discord_webhook2::{message::Message, webhook::DiscordWebhook};
use eyre::eyre;
use serde::{Deserialize, Serialize};

use crate::notify::{NotifierFormatter, notifier::Notifier};

#[derive(Serialize, Deserialize, Clone)]
pub struct DiscordOptions {
    discord_webhook: String,
    embed_title: Option<String>,
    embed_footer_content: Option<String>,
}

#[derive(Default)]
pub struct DiscordNotifier {
    discord_webhook: Option<String>,
    embed_title: Option<String>,
    embed_footer_content: Option<String>,
    webhook_client: Option<DiscordWebhook>,
}

impl DiscordNotifier {
    pub fn new(credentials: &str) -> Result<Self> {
        let mut ds = Self::default();
        ds.setup(credentials)?;
        Ok(ds)
    }
}

#[async_trait]
impl Notifier for DiscordNotifier {
    fn setup(&mut self, credentials_str: &str) -> Result<()> {
        let opt: DiscordOptions = serde_json::from_str(credentials_str)?;
        let client = DiscordWebhook::new(&opt.discord_webhook)?;
        self.discord_webhook = Some(opt.discord_webhook);
        self.webhook_client = Some(client);
        self.embed_footer_content = opt.embed_footer_content;
        self.embed_title = opt.embed_title;
        Ok(())
    }

    async fn notify(&self, line: String) -> Result<()> {
        if self.discord_webhook.is_none() || self.webhook_client.is_none() {
            return Err(super::Error::Other(eyre!(
                "Notifier hasn't been set up. (Discord)"
            )));
        }

        let client = self.webhook_client.as_ref().unwrap();

        client
            .send(&Message::new(|m| {
                m.embed(|embed| {
                    embed
                        .title(
                            self.embed_title
                                .as_ref()
                                .unwrap_or(&"Rusty Response".to_string()),
                        )
                        .description(line)
                        .footer(|f| {
                            f.text(
                                self.embed_footer_content
                                    .as_ref()
                                    .unwrap_or(&env!("CARGO_PKG_VERSION").to_string()),
                            )
                        })
                })
            }))
            .await?;

        Ok(())
    }
}
