use std::str::FromStr;

use axum::{
    Json, Router,
    extract::State,
    middleware,
    response::{IntoResponse, Response},
    routing::{get, post},
};
use reqwest::StatusCode;
use serde_json::json;
use tower_cookies::{Cookie, Cookies};
use tracing::debug;

use crate::{
    crypt::{BcryptController, JWTController}, model::{Ctx, User, UserAction, UserActionLogBmc, UserBmc, UserClaims, UserCreate}, web::WebError, Settings
};

use super::{
    AppState,
    middlewares::{AUTH_TOKEN, verify_token_middleware},
};

pub fn routes<S>(state: AppState) -> Router<S> {
    let protected = Router::new()
        .route("/verify", get(user_verify))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            verify_token_middleware,
        ));

    Router::new()
        .route("/signup", post(user_signup))
        .route("/signin", post(user_signin))
        .merge(protected)
        .with_state(state)
}

#[utoipa::path(
    post,
    tag = "account",
    path = "/api/v1/account/verify",
    responses(
        (status = 200, description = "User is authenticated"),
        (status = 401, description = "User is not authenticated"),
    ),
    security(
        ("jwt_key" = [])
    )
)]
pub async fn user_verify(ctx: Ctx, State(state): State<AppState>) -> Result<Response, WebError> {
    debug!("{:?}", ctx);
    let body = json!({
        "message": "Account successfully verified!"
    });

    UserActionLogBmc::log(&state.mm, &ctx, UserAction::user_verifyauth(ctx.user_id)).await?;
    Ok((StatusCode::OK, Json(body)).into_response())
}

#[utoipa::path(
    post,
    tag = "account",
    path = "/api/v1/account/signin",
    responses(
        (status = 200, description = "User signed in successfully", body = User),
        (status = 401, description = "Error during authentication"),
    ),
    request_body = UserCreate,
)]
pub async fn user_signin(
    State(state): State<AppState>,
    cookies: Cookies,
    Json(body): Json<UserCreate>,
) -> Result<Response, WebError> {
    let found = UserBmc::find_by_username(&state.mm, &body.username).await?;

    if found.is_none() {
        return Err(WebError::InvalidCredentials);
    }

    let user = found.unwrap();
    let valid = BcryptController::verify(body.password_raw, &user.password_hash)?;

    if !valid {
        return Err(WebError::InvalidCredentials);
    }

    let claims = UserClaims::new(
        user.id.to_string(),
        (time::UtcDateTime::now() + time::Duration::hours(1)).unix_timestamp(),
    );

    let token = JWTController::generate_token(claims, &state.secret)?;

    let mut cookie = Cookie::new(AUTH_TOKEN, token);
    let expire_time = Settings::global().app().jwt().expire_time();
    cookie.set_path("/");
    cookie.set_expires(time::OffsetDateTime::now_utc() + time::Duration::seconds(expire_time));
    cookies.add(cookie);

    UserActionLogBmc::log(
        &state.mm,
        &Ctx::new(
            user.id,
            crate::model::UserRole::from_str(&user.role).expect("unable to parse role"),
        ),
        UserAction::user_signin(user.id),
    )
    .await?;

    Ok((StatusCode::OK, Json(user)).into_response())
}

#[utoipa::path(
    post,
    tag = "account",
    path = "/api/v1/account/signup",
    responses(
        (status = 200, description = "User signed up successfully", body = User),
        (status = 401, description = "Error during sign up"),
    ),
    request_body = UserCreate,
)]
pub async fn user_signup(
    State(state): State<AppState>,
    cookies: Cookies,
    Json(body): Json<UserCreate>,
) -> Result<Response, WebError> {
    let found = UserBmc::find_by_username(&state.mm, &body.username).await?;

    if found.is_some() {
        return Err(WebError::UserAlreadyExists);
    }

    let user = UserBmc::insert(&state.mm, body).await?;

    let claims = UserClaims::new(
        user.id.to_string(),
        (time::UtcDateTime::now() + time::Duration::hours(1)).unix_timestamp(),
    );

    let token = JWTController::generate_token(claims, &state.secret)?;

    let mut cookie = Cookie::new(AUTH_TOKEN, token);
    let expire_time = Settings::global().app().jwt().expire_time();
    cookie.set_path("/");
    cookie.set_expires(time::OffsetDateTime::now_utc() + time::Duration::seconds(expire_time));
    cookies.add(cookie);

    UserActionLogBmc::log(
        &state.mm,
        &Ctx::new(
            user.id,
            crate::model::UserRole::from_str(&user.role).expect("unable to parse role"),
        ),
        UserAction::user_signup(user.id),
    )
    .await?;

    Ok((StatusCode::OK, Json(user)).into_response())
}
