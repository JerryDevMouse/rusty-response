use axum::{
    extract::{FromRequestParts, Request, State},
    http::request::Parts,
    middleware::Next,
    response::Response,
};
use tower_cookies::Cookies;

use crate::{
    crypt::JWTController,
    model::{Ctx, UserBmc},
    web::{AppState, WebError},
};

pub static AUTH_TOKEN: &str = "SID";

pub async fn verify_token_middleware(
    State(state): State<AppState>,
    cookies: Cookies,
    mut req: Request,
    next: Next,
) -> Result<Response, WebError> {
    let token = match cookies.get(AUTH_TOKEN) {
        Some(token) => token,
        None => return Err(WebError::CookieNotFound),
    };

    let claims = JWTController::decode_token(token.value(), &state.secret)?;

    let id: i64 = claims
        .claims
        .sub
        .parse()
        .map_err(|_| WebError::InternalServerError(eyre::Report::msg("Invalid SID")))?;

    let role = UserBmc::get_role_by_id(&state.mm, id).await?;

    match role {
        Some(role) => {
            req.extensions_mut().insert(Ctx::new(id, role));
            Ok(next.run(req).await)
        }
        None => Err(WebError::UserNotFound(id)),
    }
}

impl<S> FromRequestParts<S> for Ctx
where
    S: Send + Sync,
{
    type Rejection = WebError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let ctx = parts.extensions.get::<Ctx>();
        if let Some(ctx) = ctx {
            Ok(ctx.clone())
        } else {
            Err(WebError::InternalServerError(eyre::Report::msg(
                "Context not found!",
            )))
        }
    }
}
