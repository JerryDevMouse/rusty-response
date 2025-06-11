#[derive(Debug)]
pub enum ModelError {
    InvalidUserRole { given: String },
}

impl ModelError {
    pub fn invalid_user_role(given: &str) -> Self {
        ModelError::InvalidUserRole {
            given: given.into(),
        }
    }
}

impl std::fmt::Display for ModelError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl std::error::Error for ModelError {}
