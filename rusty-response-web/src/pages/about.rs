use leptos::prelude::*;

#[component]
pub fn AboutPage() -> impl IntoView {
    view! {
        <div class="p-8 max-w-3xl mx-auto text-white">
            <h1 class="text-4xl font-bold mb-4 text-blue-400">"Rusty Response"</h1>
            <p class="text-lg leading-relaxed mb-6 text-gray-300">
               "Rusty Response is a simple monitoring service developed for Lookup."<br />
               "It implements robust notification system to adapt for any case."
            </p>
            <h2 class="text-2xl font-semibold mb-2 text-blue-300">"Notify System"</h2>
            <p class="text-lg leading-relaxed mb-6 text-gray-300">
                "RR provides high configurable notfier system, it allows you to specify your own format for messages and send them to the telegram, discord etc."<br/>
                "Support for more notify drivers is in progress"
            </p>
            <h2 class="text-2xl font-semibold mb-2 text-blue-300">"Leptos"</h2>
            <p class="text-lg leading-relaxed mb-6 text-gray-300">
                "Rusty Response's web view is built in Rust with Leptos framework in CSR mode. It's a modern and fast replacement for React or Vue.js"
            </p>
            <h2 class="text-2xl font-semibold mb-2 text-blue-300">"Axum"</h2>
            <p class="text-lg leading-relaxed mb-6 text-gray-300">
                "Rusty Response's backend is also built with Rust on Axum API framework. Axum is very robust when it comes to making APIs."
            </p>
            <h2 class="text-2xl font-semibold mb-2 text-blue-300">"License"</h2>
            <p class="text-base leading-relaxed text-gray-400 mb-4">
                "The whole project is licensed under MIT."<br />
                "Copyright 2025 JerryImMouse"
            </p>
        </div>
    }
}
