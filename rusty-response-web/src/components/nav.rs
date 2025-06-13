use leptos::prelude::*;
use leptos_maybe_callback::MaybeCallback;
use web_sys::MouseEvent;

#[component]
pub fn Sidebar(children: Children) -> impl IntoView {
    view! {
        <aside class="fixed top-0 left-0 h-screen w-16 bg-[#3F3F3F] flex flex-col items-center py-4 space-y-2 shadow-lg z-50">
            <ul class="flex flex-col space-y-2 w-full h-full">
                {children()}
            </ul>
        </aside>
    }
}

#[component]
pub fn NavItem(
    #[prop(optional)] tooltip: Option<&'static str>,
    #[prop(optional)] to_bottom: bool,
    #[prop(into, optional)] onclick: MaybeCallback<MouseEvent>,
    href: &'static str,
    icon_src: &'static str,
) -> impl IntoView {
    let bottom_class = if to_bottom { "mt-auto" } else { "" };

    view! {
        <li class={format!("relative group flex items-center justify-center w-full h-16 hover:bg-[#585858] transition-colors duration-200 {}", bottom_class)}>
            <a href=href class="relative group flex items-center justify-center w-full h-16" on:click=move |ev| {
                if let Some(cb) = onclick.as_ref() {
                    ev.prevent_default();
                    cb.run(ev);
                }
            }>
                <img src={icon_src} alt="icon" class="w-9 h-9" />

                {tooltip.map(|tip| view! {
                    <span class="pointer-events-none absolute left-full ml-2 bg-[#3F3F3F] text-[#9b9b9b] text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200 z-10">
                        {tip}
                    </span>
                })}
            </a>
        </li>
    }
}
