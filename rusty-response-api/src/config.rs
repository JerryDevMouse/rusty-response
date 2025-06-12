use std::sync::OnceLock;

use config::{Config, Environment, File};
use serde::Deserialize;
use tracing::{error, trace};

#[derive(Debug, Deserialize)]
pub struct Network {
    #[serde(default = "default_host")]
    host: String,
    #[serde(default = "default_port")]
    port: u16,
}

#[derive(Debug, Deserialize)]
pub struct Database {
    #[serde(default = "default_database_path")]
    path: String,
}

#[derive(Debug, Deserialize)]
pub struct JWTSettings {
    jwt_secret: String,
    #[serde(default = "default_expire_time")]
    expire_time: i64, // secs
}

#[derive(Debug, Deserialize, Default)]
pub struct Application {
    jwt: JWTSettings,
}

#[derive(Debug, Deserialize, Default)]
pub struct Settings {
    #[serde(default = "Network::default")]
    net: Network,
    app: Application,
    #[serde(default = "Database::default")]
    database: Database,
}

impl Settings {
    pub(crate) fn new() -> Result<Self, eyre::Error> {
        let exe_dir = std::env::current_exe()?
            .parent()
            .ok_or(eyre::eyre!("Unable to find executable's parent directory"))?
            .to_path_buf();

        let config_path = exe_dir.join("config.toml");
        trace!("Waiting config at: {}", config_path.display());

        let s = Config::builder()
            .add_source(File::with_name(config_path.to_str().unwrap()))
            .add_source(
                Environment::with_prefix("RP")
                    .convert_case(config::Case::Upper)
                    .separator("_"),
            )
            .build()?;

        let settings: Self = s.try_deserialize()?;
        Ok(settings)
    }

    pub fn global() -> &'static Settings {
        static INSTANCE: OnceLock<Settings> = OnceLock::new();
        INSTANCE.get_or_init(|| {
            let result = Settings::new();
            if let Err(e) = result {
                error!(
                    "Error reading configuration: {}. Falling back to default..",
                    e
                );

                return Settings::default();
            }

            result.unwrap()
        })
    }
}

impl Default for JWTSettings {
    fn default() -> Self {
        Self {
            jwt_secret: Default::default(),
            expire_time: 3600,
        }
    }
}

impl Default for Network {
    fn default() -> Self {
        Self {
            host: "127.0.0.1".to_string(),
            port: 5000,
        }
    }
}

impl Default for Database {
    fn default() -> Self {
        Self {
            path: default_database_path(),
        }
    }
}

impl Settings {
    #[inline]
    pub fn net(&self) -> &Network {
        &self.net
    }

    #[inline]
    pub fn app(&self) -> &Application {
        &self.app
    }

    #[inline]
    pub fn database(&self) -> &Database {
        &self.database
    }
}

impl Database {
    #[inline]
    pub fn path(&self) -> &str {
        &self.path
    }
}

impl Network {
    #[inline]
    pub fn host(&self) -> &str {
        &self.host
    }

    #[inline]
    pub fn port(&self) -> u16 {
        self.port
    }
}

impl JWTSettings {
    #[inline]
    pub fn jwt_secret(&self) -> &str {
        &self.jwt_secret
    }

    #[inline]
    pub fn expire_time(&self) -> i64 {
        self.expire_time
    }
}

impl Application {
    #[inline]
    pub fn jwt(&self) -> &JWTSettings {
        &self.jwt
    }
}

fn default_host() -> String {
    "127.0.0.1".to_string()
}

fn default_port() -> u16 {
    5000
}

fn default_expire_time() -> i64 {
    3600
}

fn default_database_path() -> String {
    "./rusty-response-api/sqlite.db".to_string()
}
