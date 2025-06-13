use leptos::prelude::*;

use crate::components::SigninForm;

#[component]
pub fn SigninPage() -> impl IntoView {
    view! {
        <div class="flex items-center justify-center min-h-screen">
            <SigninForm />
        </div>
    }
}
