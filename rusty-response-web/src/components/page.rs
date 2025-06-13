use leptos::prelude::*;
use leptos_meta::Title;
use leptos_router::components::Outlet;
use web_sys::MouseEvent;

use crate::{
    components::{NavItem, Sidebar},
    contexts::AuthContext,
};

#[component]
pub fn Page() -> impl IntoView {
    let auth_ctx = expect_context::<AuthContext>();

    let signout_cb = {
        let auth_ctx = auth_ctx.clone(); // Only once
        Callback::new(move |_: MouseEvent| {
            auth_ctx.signout();
        })
    };

    let is_authorized = move || {
        let auth_ctx = auth_ctx.clone(); // Or even reference, if you don't need move
        auth_ctx.is_authorized()
    };

    view! {
        <Title text="Home" />
        <Sidebar>
            <NavItem tooltip="Dashboard" icon_src="/images/corvax.png" href="/home"/>
            <NavItem tooltip="Servers" icon_src="/images/corvax.png" href="/servers"/>
            <NavItem tooltip="Logs" icon_src="/images/corvax.png" href="/logs"/>
            <NavItem tooltip="About" icon_src="/images/corvax.png" href="/about"/>
            <Show when=move || !is_authorized()>
                <NavItem tooltip="Sign In" icon_src="/images/corvax.png" to_bottom=true href="/signin"/>
            </Show>
            <Show when=is_authorized>
                <NavItem tooltip="Sign Out" icon_src="/images/corvax.png" to_bottom=true href="/signout" onclick=signout_cb />
            </Show>
        </Sidebar>

        <main class="ml-16 p-4 bg-[#272727] h-full w-full">
            <Outlet />
        </main>
    }
}
