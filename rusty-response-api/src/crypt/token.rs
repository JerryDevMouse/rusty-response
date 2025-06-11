use super::Result;
use crate::model::UserClaims;
use jsonwebtoken::{DecodingKey, EncodingKey, Header, TokenData, Validation};

pub struct JWTController;

impl JWTController {
    pub fn generate_token<K: AsRef<[u8]>>(claims: UserClaims, key: K) -> Result<String> {
        let header = Header::default();
        let key = EncodingKey::from_secret(key.as_ref());

        let token = jsonwebtoken::encode(&header, &claims, &key)?;

        Ok(token)
    }

    pub fn decode_token<K: AsRef<[u8]>>(token: &str, key: K) -> Result<TokenData<UserClaims>> {
        let validation = Validation::default();
        let key = DecodingKey::from_secret(key.as_ref());

        let claims = jsonwebtoken::decode::<UserClaims>(token, &key, &validation)?;

        Ok(claims)
    }
}

#[cfg(test)]
pub mod test {
    use super::*;

    fn generate_token() -> String {
        let claims = UserClaims::new("TEST", time::UtcDateTime::now().unix_timestamp());
        let token = JWTController::generate_token(claims, "foo").expect("Unable to generate token");
        token
    }

    #[test]
    fn test_jwt_generate_token() {
        let token = generate_token();
        println!("->> JWT TOKEN {}\n", token);
    }

    #[test]
    fn test_jwt_decode_token() {
        let token = generate_token();

        let claims =
            JWTController::decode_token(&token, "foo").expect("Unable to decode JWT token");

        println!("->> JWT PAYLOAD {:?}\n", claims);
    }

    #[test]
    fn test_jwt_invalid_exp_token() {
        let claims = UserClaims::new("TEST", time::UtcDateTime::MIN.unix_timestamp());
        let token = JWTController::generate_token(claims, "foo").expect("Unable to generate token");

        let claims = JWTController::decode_token(&token, "foo");
        assert!(claims.is_err())
    }
}
