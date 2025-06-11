#![cfg(feature = "events")]
//! This module was intended to handle events from server futures, but i found out that trying to make an async dispatcher is a hard work
//! but I don't want to use library for that, so I decided to look for another workaround

mod dispatcher;
mod event;

pub use dispatcher::Dispatcher;
pub use event::Event;
