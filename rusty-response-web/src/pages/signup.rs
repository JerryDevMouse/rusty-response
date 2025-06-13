use leptos::prelude::*;

use crate::components::SignupForm;

#[component]
pub fn SignupPage() -> impl IntoView {
    view! {
        <div class="flex items-center justify-center min-h-screen">
            <SignupForm />
        </div>
    }
}
