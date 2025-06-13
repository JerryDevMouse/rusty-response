use leptoaster::{Toaster, provide_toaster};
use leptos::prelude::*;
use leptos_meta::{Title, provide_meta_context};
use leptos_router::{
    components::{ParentRoute, Redirect, Route, Router, Routes},
    path,
};

use crate::{
    components::Page,
    contexts::AuthContext,
    pages::{AboutPage, HomePage, SigninPage, SignupPage},
};

#[component]
pub fn Application() -> impl IntoView {
    provide_meta_context();
    provide_toaster();
    AuthContext::provide();

    let formatter = move |text| format!("{text} - Rusty Response");

    view! {
        <Title formatter />
        <Toaster stacked=true />
        <Router>
            <Routes fallback=move || view! { <h1>"Not found!"</h1> }>
                <ParentRoute path=path!("/") view=Page>
                    <Route path=path!("") view=|| view! { <Redirect path="/home" /> } />
                    <Route path=path!("home") view=HomePage />
                    <Route path=path!("servers") view=view!{} />
                    <Route path=path!("logs") view=view!{} />
                    <Route path=path!("signup") view=SignupPage />
                    <Route path=path!("signin") view=SigninPage />
                    <Route path=path!("signout") view=view! {} />
                    <Route path=path!("about") view=AboutPage />
                </ParentRoute>
            </Routes>
        </Router>
    }
}
