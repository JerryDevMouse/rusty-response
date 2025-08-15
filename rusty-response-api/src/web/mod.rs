mod error;
mod routes;
mod utils;

pub use error::WebError;
pub use routes::{AppState, RawState, server_routes, user_routes};
use tokio::sync::mpsc::UnboundedSender;
use tower_http::cors::CorsLayer;
pub use utils::shutdown_signal;
use utoipa::{openapi::security::{ApiKeyValue, SecurityScheme}, Modify, OpenApi};
use utoipa_swagger_ui::SwaggerUi;

use axum::Router;

use crate::{ModelManager, channel::ControlMessage, model::Ctx, notify::NotifyManager};

#[derive(OpenApi)]
#[openapi(
    modifiers(&SecurityAddon),
    tags(
        (name = "account", description = "Account management API")
    ),
    paths(
        routes::user::user_signin, 
        routes::user::user_verify,
        routes::user::user_signup,

        routes::server::create_server,
    ),
)]
struct ApiDoc;

struct SecurityAddon;
impl Modify for SecurityAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        if let Some(components) = openapi.components.as_mut() {
            components.add_security_scheme("jwt_key", SecurityScheme::ApiKey(utoipa::openapi::security::ApiKey::Cookie(ApiKeyValue::new("jwt_token"))));
        }
    }
}

pub async fn app_state(
    mm: &ModelManager,
    jwt: &str,
    ctx: &Ctx,
    control_tx: UnboundedSender<ControlMessage>,
) -> Result<AppState, eyre::Report> {
    let notify_manager = NotifyManager::new();
    notify_manager.extend_from_db(mm, ctx).await?;

    Ok(RawState::new(
        mm.clone(),
        jwt.to_string(),
        control_tx.clone(),
        notify_manager,
    ))
}

pub fn app<S>(state: AppState) -> Router<S> {
    Router::new()
        .nest(
            "/api/v1/account/",
            routes::user_routes(AppState::clone(&state)),
        )
        .nest(
            "/api/v1/server/",
            routes::server_routes(AppState::clone(&state)),
        )
        .nest(
            "/api/v1/notify/",
            routes::notify_routes(AppState::clone(&state)),
        )
        .nest(
            "/api/v1/logs/server/",
            routes::server_log_routes(AppState::clone(&state)),
        )
        .merge(SwaggerUi::new("/api/v1/docs").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .layer(tower_cookies::CookieManagerLayer::new())
        .layer(CorsLayer::very_permissive())
        .with_state(AppState::clone(&state))
}
