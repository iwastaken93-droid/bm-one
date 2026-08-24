pub mod app;
pub mod platform;


pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .setup(|_app| {
            tracing_subscriber::fmt::init();
            tracing::info!("BridgeMind One native runtime initialized.");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Auth & Session
            app::commands::auth_bootstrap,
            app::commands::auth_snapshot,
            app::commands::auth_begin_sign_in,
            app::commands::auth_cancel_sign_in,
            app::commands::auth_reopen_sign_in,
            app::commands::auth_sign_out,
            app::commands::auth_retry_entitlement,
            app::commands::auth_open_signup,
            app::commands::auth_open_upgrade,
            app::commands::credits_balance,

            // Shell & Bootstrap
            app::commands::bootstrap,
            app::commands::save_shell_state,

            // Agents & Mind
            app::commands::list_agent_profiles,
            app::commands::load_agent_profile,
            app::commands::create_agent,
            app::commands::update_agent_profile,
            app::commands::delete_agent_profile,
            app::commands::load_agent_mind,
            app::commands::write_agent_memory,
            app::commands::load_agent_skill,
            app::commands::write_agent_skill,
            app::commands::remove_agent_skill,
            app::commands::list_agent_starters,
            app::commands::install_agent_starter,
            app::commands::get_agent_availability,
            app::commands::probe_agent_availability,

            // Workspaces & Panes
            app::commands::add_workspace,
            app::commands::load_workspace_layout,
            app::commands::save_workspace_layout,

            // Code Threads
            app::commands::create_code_thread,
            app::commands::read_code_thread,
            app::commands::configure_code_thread,
            app::commands::start_code_thread_turn,
            app::commands::read_code_thread_turn_updates,
            app::commands::stop_code_thread_turn,
            app::commands::reset_code_thread,
            app::commands::set_code_thread_visibility,
            app::commands::delete_code_thread,

            // General Chat
            app::commands::create_general_chat,
            app::commands::list_chat_summaries,
            app::commands::load_chat_thread,
            app::commands::rename_chat_thread,
            app::commands::update_chat_configuration,
            app::commands::delete_chat_thread,
            app::commands::start_chat_turn,
            app::commands::read_chat_turn_updates,
            app::commands::cancel_chat_turn,

            // Routines
            app::commands::list_routines,
            app::commands::create_routine,
            app::commands::update_routine,
            app::commands::set_routine_enabled,
            app::commands::delete_routine,

            // Terminal PTY
            app::commands::start_terminal,
            app::commands::write_terminal,
            app::commands::read_terminal_output,
            app::commands::resize_terminal,
            app::commands::terminate_terminal,

            // Browser Surfaces
            app::commands::create_browser_surface,
            app::commands::read_browser_surface,
            app::commands::navigate_browser_surface,
            app::commands::control_browser_surface,
            app::commands::update_browser_surface_presentation,
            app::commands::close_browser_surface,

            // Notifications
            app::commands::notifications_snapshot,
            app::commands::notifications_poll,
            app::commands::notifications_report_attention,
            app::commands::notifications_mark_read,
            app::commands::notifications_mark_reviewed,
            app::commands::notifications_mark_all_read,
            app::commands::notifications_set_preferences,
            app::commands::notifications_request_authorization,
            app::commands::notifications_refresh_authorization,
            app::commands::notifications_open_system_settings,
            app::commands::notifications_play_sample
        ])
        .run(tauri::generate_context!())
        .expect("Error while running BridgeMind One application");
}
