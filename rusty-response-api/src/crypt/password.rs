use super::Result;

static DEFAULT_COST: u32 = 12;

pub struct BcryptController;

impl BcryptController {
    pub fn encrypt<P: AsRef<[u8]>>(s: P) -> Result<String> {
        let hash = bcrypt::hash(s, DEFAULT_COST)?;
        Ok(hash)
    }

    pub fn verify<P: AsRef<[u8]>>(s: P, hash: &str) -> Result<bool> {
        let verified = bcrypt::verify(s, hash)?;
        Ok(verified)
    }
}

#[cfg(test)]
mod test {
    use super::*;

    static RAW: &str = "foobar";
    static HASHED: &str = "$2a$12$aS6X5VGi7zebM9c86vPWE.7ZwePAsSi2AqU8fCm.ZMSoWcmXReYGq";

    #[test]
    fn test_encrypt() {
        let hashed = BcryptController::encrypt(RAW).unwrap();
        assert!(BcryptController::verify(RAW, &hashed).unwrap());
    }

    #[test]
    fn test_verify() {
        assert!(BcryptController::verify(RAW, HASHED).unwrap());
    }
}
