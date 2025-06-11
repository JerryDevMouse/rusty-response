pub type Result<T> = std::result::Result<T, CryptError>;

#[derive(Debug)]
pub enum CryptError {
    JwtError(jsonwebtoken::errors::Error),
    BcryptError(bcrypt::BcryptError),
}

impl std::fmt::Display for CryptError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl std::error::Error for CryptError {}

impl From<jsonwebtoken::errors::Error> for CryptError {
    fn from(value: jsonwebtoken::errors::Error) -> Self {
        Self::JwtError(value)
    }
}

impl From<bcrypt::BcryptError> for CryptError {
    fn from(value: bcrypt::BcryptError) -> Self {
        Self::BcryptError(value)
    }
}
