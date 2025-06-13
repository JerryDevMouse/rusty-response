use crate::resources::error::BackendError;

use super::ResourceFetchError;
use reqwasm::http::Request;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize, Default, PartialEq)]
pub struct User {
    pub id: i64,
    pub username: String,
}

#[derive(Serialize, Debug)]
pub struct UserResourceArgs {
    username: String,
    password_raw: String,
}

impl UserResourceArgs {
    pub fn new(username: String, password_raw: String) -> Self {
        Self {
            username,
            password_raw,
        }
    }
}

pub struct UserResource;

impl UserResource {
    pub async fn signup(args: UserResourceArgs) -> Result<User, ResourceFetchError> {
        let response = Request::new("http://localhost:5000/api/v1/account/signup")
            .credentials(web_sys::RequestCredentials::Include)
            .method(reqwasm::http::Method::POST)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&args)?)
            .send()
            .await?;

        if !response.ok() {
            let error: BackendError = response.json().await?;
            return Err(ResourceFetchError::BackendError(error));
        }

        let user: User = response.json().await?;
        Ok(user)
    }

    pub async fn signin(args: UserResourceArgs) -> Result<User, ResourceFetchError> {
        let response = Request::new("http://localhost:5000/api/v1/account/signin")
            .credentials(web_sys::RequestCredentials::Include)
            .method(reqwasm::http::Method::POST)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&args)?)
            .send()
            .await?;

        if !response.ok() {
            let error: BackendError = response.json().await?;
            return Err(ResourceFetchError::BackendError(error));
        }

        let user: User = response.json().await?;
        Ok(user)
    }

    pub async fn verify_auth() -> Result<bool, ResourceFetchError> {
        let response = Request::get("http://localhost:5000/api/v1/account/verify")
            .credentials(web_sys::RequestCredentials::Include)
            .send()
            .await?;

        return Ok(response.ok());
    }
}
