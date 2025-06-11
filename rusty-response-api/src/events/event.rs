use std::any::Any;

pub trait Event: Any + Send + Sync {
    fn as_any(&self) -> &dyn Any;
}

impl<T: Any + Send + Sync> Event for T {
    fn as_any(&self) -> &dyn Any {
        self
    }
}
