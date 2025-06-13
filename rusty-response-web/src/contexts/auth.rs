use leptos::{prelude::*, server::codee::string::FromToStringCodec};
use leptos_use::use_cookie;

static USER_STORAGE: &str = "SID";

#[derive(Debug, Clone, Copy)]
pub struct AuthContext {
    cookie: Signal<Option<String>>,
    write_cookie: WriteSignal<Option<String>>,
}

impl AuthContext {
    pub fn new() -> Self {
        let (cookie, write_cookie) = use_cookie::<String, FromToStringCodec>(USER_STORAGE);

        Self {
            cookie,
            write_cookie,
        }
    }

    pub fn provide() {
        provide_context(Self::new());
    }

    /// Workaround to detect changes from document.cookie
    pub fn notify(&self) {
        let (cookie, _) = use_cookie::<String, FromToStringCodec>(USER_STORAGE);
        self.write_cookie.set(cookie.get_untracked())
    }

    pub fn is_authorized(&self) -> bool {
        self.cookie.get().is_some()
    }

    pub fn signout(&self) {
        self.write_cookie.set(None)
    }
}
