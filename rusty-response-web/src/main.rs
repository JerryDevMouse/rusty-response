use crate::app::Application;

mod app;
mod components;
mod contexts;
mod pages;
mod resources;

fn main() {
    _ = console_log::init_with_level(log::Level::Debug);
    console_error_panic_hook::set_once();
    leptos::mount::mount_to_body(Application);
}
