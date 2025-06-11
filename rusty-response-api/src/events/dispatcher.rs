use std::{
    any::TypeId,
    collections::BTreeMap,
    sync::{OnceLock, RwLock},
};

use crate::events::event::Event;

type EventHandler = Box<dyn Fn(&dyn Event) + Send + Sync>;

pub struct Dispatcher {
    handlers: RwLock<BTreeMap<TypeId, Vec<EventHandler>>>,
}

impl Dispatcher {
    pub fn global() -> &'static Dispatcher {
        static INSTANCE: OnceLock<Dispatcher> = OnceLock::new();
        INSTANCE.get_or_init(|| Dispatcher {
            handlers: RwLock::new(BTreeMap::new()),
        })
    }

    pub fn subscribe<EV: Event + 'static, F: Fn(&EV) + Send + Sync + 'static>(&self, f: F) {
        let mut handlers = self.handlers.write().unwrap();
        handlers
            .entry(TypeId::of::<EV>())
            .or_default()
            .push(Box::new(move |e| {
                if let Some(e) = e.as_any().downcast_ref::<EV>() {
                    f(e)
                }
            }))
    }

    pub fn dispatch<EV: Event + 'static>(&self, event: EV) {
        if let Some(listeners) = self.handlers.write().unwrap().get(&TypeId::of::<EV>()) {
            for listener in listeners {
                listener(&event);
            }
        }
    }

    /// Only for test purposes. TODO: Mark with #[cfg(test)]
    pub fn clear_handlers() {
        Dispatcher::global().handlers.write().unwrap().clear();
    }
}
