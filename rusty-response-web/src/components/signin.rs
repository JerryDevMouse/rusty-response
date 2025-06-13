use leptoaster::{ToastBuilder, ToasterContext};
use leptos::{prelude::*, reactive::spawn_local};
use leptos_router::hooks::use_navigate;

use crate::{
    contexts::AuthContext,
    resources::{self, UserResourceArgs},
};

#[component]
pub fn SigninForm() -> impl IntoView {
    let username_ref = NodeRef::new();
    let password_raw_ref = NodeRef::new();
    let btn_disabled = RwSignal::new(false);
    let toaster_ctx = expect_context::<ToasterContext>();
    let navigate = use_navigate();
    let auth_ctx = expect_context::<AuthContext>();

    view! {
        <form
            id="signin-form"
            class="bg-[#3a3a3a] p-6 rounded-lg shadow-md w-full max-w-sm mx-auto space-y-4"
            on:submit=move |ev| {
                ev.prevent_default();
                let toaster_ctx = toaster_ctx.clone();
                let navigate = navigate.clone();
                let auth_ctx = auth_ctx.clone();
                spawn_local(async move {
                    btn_disabled.set(true);
                    let result = resources::UserResource::signin(
                        UserResourceArgs::new(
                            username_ref.get().unwrap().value(),
                            password_raw_ref.get().unwrap().value()
                        )
                    ).await;

                    if let Err(e) = result {
                        let toast = e.into_toast();
                        toaster_ctx.toast(toast);

                        btn_disabled.set(false);
                        return;
                    }
                    btn_disabled.set(false);
                    toaster_ctx.toast(
                        ToastBuilder::new("Successfully signed in!")
                        .with_position(leptoaster::ToastPosition::BottomRight)
                        .with_level(leptoaster::ToastLevel::Success)
                    );
                    auth_ctx.notify();
                    navigate("/home", Default::default());
                });
            }
        >
            <h2 class="text-xl font-semibold text-white mb-2">"Sign In"</h2>

            <div class="flex flex-col space-y-1">
                <label for="username" class="text-sm text-[#737373] font-medium">Username</label>
                <input
                    id="username"
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    class="px-3 py-2 bg-[#3F3F3F] text-white border border-[#585858] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3179FF] focus:border-transparent transition-colors duration-150"
                    node_ref=username_ref
                    required
                />
            </div>

            <div class="flex flex-col space-y-1">
                <label for="password" class="text-sm text-[#737373] font-medium">Password</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    class="px-3 py-2 bg-[#3F3F3F] text-white border border-[#585858] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3179FF] focus:border-transparent transition-colors duration-150"
                    node_ref=password_raw_ref
                    required
                />
            </div>

            <div class="flex flex-col space-y-1">
                <h2 class="text-sm text-[#737373] font-medium">
                    "Don't have an account? "
                    <a href="/signup" class="text-blue-500 hover:underline">"Sign Up!"</a>
                </h2>
            </div>

            <button
                type="submit"
                disabled=btn_disabled
                class="w-full bg-[#3179FF] hover:bg-[#2461d6] text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
                "Sign In"
            </button>
        </form>
    }
}
