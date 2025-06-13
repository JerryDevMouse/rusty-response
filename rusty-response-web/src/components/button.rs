use leptos::*;
use leptos::{ev::MouseEvent, prelude::*};
use leptos_maybe_callback::MaybeCallback;

#[component]
pub fn Button(
    #[prop(into, optional)] onclick: MaybeCallback<MouseEvent>,
    children: Children,
) -> impl IntoView {
    view! {
        <button
            on:click=onclick.into_handler()
            class="bg-[#3179FF] hover:bg-[#1f5fd1] text-white font-medium py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#3179FF] focus:ring-offset-2 transition duration-150"
        >
            {children()}
        </button>
    }
}
