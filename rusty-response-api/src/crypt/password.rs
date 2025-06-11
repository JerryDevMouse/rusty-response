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
