use serde::{Deserialize, Serialize};
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct GenericRequest<T> {
    pub request: T,
}

// ---------------------------------------------------------------------------
// Auth & Credits Commands
// ---------------------------------------------------------------------------

#[command]
pub async fn auth_bootstrap() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "revision": 1,
        "phase": { "kind": "signedIn" },
        "access": { "kind": "entitled" },
        "user": { "email": "engineer@bridgemind.ai", "name": "Lead Engineer" },
        "subscriptionTier": "pro",
        "canReopenBrowser": false,
        "paymentRecovery": false
    }))
}

#[command]
pub async fn auth_snapshot() -> Result<serde_json::Value, String> {
    auth_bootstrap().await
}

#[command]
pub async fn auth_begin_sign_in() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "revision": 2,
        "phase": { "kind": "signingIn", "step": "waitingForBrowser" },
        "access": { "kind": "unknown" },
        "subscriptionTier": "free",
        "canReopenBrowser": true,
        "paymentRecovery": false
    }))
}

#[command]
pub async fn auth_cancel_sign_in() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "revision": 3,
        "phase": { "kind": "signedOut" },
        "access": { "kind": "unknown" },
        "subscriptionTier": "free",
        "canReopenBrowser": false,
        "paymentRecovery": false
    }))
}

#[command]
pub async fn auth_reopen_sign_in() -> Result<serde_json::Value, String> {
    auth_begin_sign_in().await
}

#[command]
pub async fn auth_sign_out() -> Result<serde_json::Value, String> {
    auth_cancel_sign_in().await
}

#[command]
pub async fn auth_retry_entitlement() -> Result<serde_json::Value, String> {
    auth_bootstrap().await
}

#[command]
pub async fn auth_open_signup() -> Result<serde_json::Value, String> {
    auth_snapshot().await
}

#[command]
pub async fn auth_open_upgrade() -> Result<serde_json::Value, String> {
    auth_snapshot().await
}

#[command]
pub async fn credits_balance() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "balance": 12500,
        "cycleBalance": 10000,
        "purchasedBalance": 2500,
        "currentCycleGranted": 10000,
        "currentCycleSpent": 4200,
        "lifetimeGranted": 120000,
        "lifetimeSpent": 96000,
        "lastGrantedAt": "2026-08-01T00:00:00.000Z"
    }))
}

// ---------------------------------------------------------------------------
// Shell & Workspace Commands
// ---------------------------------------------------------------------------

#[command]
pub async fn bootstrap(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    let agent_id = "a0000000-0000-0000-0000-000000000001";
    let browser_token = uuid::Uuid::new_v4().to_string();
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "preferences": {
            "schemaVersion": 1,
            "workMode": "agent",
            "route": { "kind": "agent" },
            "selectedWorkspaceId": null,
            "selectedAgentId": agent_id,
            "sidebarVisible": true,
            "appearance": "dark",
            "zoomPercent": 100
        },
        "agents": [{
            "id": agent_id,
            "name": "Claude Code",
            "engine": "claude-code",
            "purpose": "Full-stack code generation and refactoring assistant.",
            "createdAtUnixMs": 1724457600000i64
        }],
        "workspaces": [],
        "recoveryNotices": [],
        "persistenceReadOnly": false,
        "browserDocumentToken": browser_token
    }))
}

#[command]
pub async fn save_shell_state(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({}))
}

#[command]
pub async fn add_workspace(request: serde_json::Value) -> Result<serde_json::Value, String> {
    let path = request["request"]["path"].as_str().unwrap_or("Project Workspace");
    Ok(serde_json::json!({
        "id": uuid::Uuid::new_v4().to_string(),
        "displayName": path,
        "createdAtUnixMs": 1724457600000i64,
        "lastOpenedAtUnixMs": 1724457600000i64
    }))
}

#[command]
pub async fn load_workspace_layout(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "layout": null,
        "recoveryNotices": [],
        "readOnly": false
    }))
}

#[command]
pub async fn save_workspace_layout(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({}))
}

// ---------------------------------------------------------------------------
// Agent Hub & Mind Commands
// ---------------------------------------------------------------------------

#[command]
pub async fn list_agent_profiles(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    let agent_id = "a0000000-0000-0000-0000-000000000001";
    Ok(serde_json::json!([{
        "agentId": agent_id,
        "name": "Claude Code",
        "engine": "claude-code",
        "brief": "Full-stack code generation and refactoring assistant.",
        "defaultMode": "fullAccess",
        "defaultPlan": true,
        "defaultModel": null,
        "defaultProviderOptions": [],
        "memoryBudget": 4096,
        "reflectionMode": "adaptive",
        "allowAgentScheduling": true,
        "confirmedByBuilder": true
    }]))
}

#[command]
pub async fn load_agent_profile(request: serde_json::Value) -> Result<serde_json::Value, String> {
    let agent_id = request["request"]["agentId"].as_str().unwrap_or("a0000000-0000-0000-0000-000000000001");
    Ok(serde_json::json!({
        "agentId": agent_id,
        "name": "Claude Code",
        "engine": "claude-code",
        "brief": "Full-stack code generation and refactoring assistant.",
        "defaultMode": "fullAccess",
        "defaultPlan": true,
        "defaultModel": null,
        "defaultProviderOptions": [],
        "memoryBudget": 4096,
        "reflectionMode": "adaptive",
        "allowAgentScheduling": true,
        "confirmedByBuilder": true
    }))
}

#[command]
pub async fn create_agent(request: serde_json::Value) -> Result<serde_json::Value, String> {
    let req = &request["request"];
    Ok(serde_json::json!({
        "id": uuid::Uuid::new_v4().to_string(),
        "name": req["name"].as_str().unwrap_or("New Agent"),
        "engine": req["engine"].as_str().unwrap_or("claude-code"),
        "purpose": req["purpose"].as_str().unwrap_or(""),
        "createdAtUnixMs": 1724457600000i64
    }))
}

#[command]
pub async fn update_agent_profile(request: serde_json::Value) -> Result<serde_json::Value, String> {
    let req = &request["request"];
    Ok(serde_json::json!({
        "agentId": req["agentId"].as_str().unwrap_or("a0000000-0000-0000-0000-000000000001"),
        "name": req["name"].as_str().unwrap_or("Claude Code"),
        "engine": req["engine"].as_str().unwrap_or("claude-code"),
        "brief": req["brief"].as_str().unwrap_or(""),
        "defaultMode": req["defaultMode"].as_str().unwrap_or("fullAccess"),
        "defaultPlan": req["defaultPlan"].as_bool().unwrap_or(true),
        "defaultModel": null,
        "defaultProviderOptions": [],
        "memoryBudget": 4096,
        "reflectionMode": "adaptive",
        "allowAgentScheduling": true,
        "confirmedByBuilder": true
    }))
}

#[command]
pub async fn delete_agent_profile(request: serde_json::Value) -> Result<serde_json::Value, String> {
    let agent_id = request["request"]["agentId"].as_str().unwrap_or("a0000000-0000-0000-0000-000000000001");
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "agentId": agent_id,
        "deleted": true,
        "cleanupPending": false
    }))
}

#[command]
pub async fn load_agent_mind(request: serde_json::Value) -> Result<serde_json::Value, String> {
    let agent_id = request["request"]["agentId"].as_str().unwrap_or("a0000000-0000-0000-0000-000000000001");
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "agentId": agent_id,
        "memory": "You are BridgeMind One, an autonomous engineering intelligence.",
        "user": "Lead Engineer\nPreferences: clean Rust, modern React, rigorous testing.",
        "skills": [],
        "memoryUpdatedAtUnixMs": 1724457600000i64,
        "userUpdatedAtUnixMs": 1724457600000i64,
        "memoryRevision": null,
        "userRevision": null,
        "readIssues": []
    }))
}

#[command]
pub async fn write_agent_memory(request: serde_json::Value) -> Result<serde_json::Value, String> {
    load_agent_mind(request).await
}

#[command]
pub async fn load_agent_skill(request: serde_json::Value) -> Result<serde_json::Value, String> {
    let skill_id = request["request"]["skillId"].as_str().unwrap_or("skill-001");
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "id": skill_id,
        "name": "Rust Systems Architect",
        "description": "Deep memory and optimization patterns for Rust & Tauri.",
        "source": "# Rust Systems Architect\n\nExpert guidance on Tauri IPC."
    }))
}

#[command]
pub async fn write_agent_skill(request: serde_json::Value) -> Result<serde_json::Value, String> {
    load_agent_mind(request).await
}

#[command]
pub async fn remove_agent_skill(request: serde_json::Value) -> Result<serde_json::Value, String> {
    let mind = load_agent_mind(request).await?;
    Ok(serde_json::json!({
        "removed": true,
        "mind": mind
    }))
}

#[command]
pub async fn list_agent_starters(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    Ok(serde_json::json!([
        { "id": "code-review", "title": "Automated Code Reviewer", "summary": "Scans pull requests for security and architecture patterns." },
        { "id": "doc-writer", "title": "Technical Documentation Generator", "summary": "Writes comprehensive markdown docs from source code." }
    ]))
}

#[command]
pub async fn install_agent_starter(request: serde_json::Value) -> Result<serde_json::Value, String> {
    let mind = load_agent_mind(request).await?;
    Ok(serde_json::json!({
        "installed": true,
        "mind": mind
    }))
}

#[command]
pub async fn get_agent_availability(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    let engines = [
        "claude-code", "codex", "gemini", "open-code", "github-copilot",
        "cursor", "droid", "grok", "aider", "amp", "antigravity", "deep-seek"
    ];
    let teammates: Vec<serde_json::Value> = engines.iter().map(|e| {
        serde_json::json!({
            "engine": e,
            "installed": true,
            "verified": true
        })
    }).collect();

    Ok(serde_json::json!({
        "schemaVersion": 1,
        "scope": "native",
        "phase": "ready",
        "hasProbed": true,
        "isLoading": false,
        "teammates": teammates,
        "issue": null
    }))
}

#[command]
pub async fn probe_agent_availability(request: serde_json::Value) -> Result<serde_json::Value, String> {
    get_agent_availability(request).await
}

// ---------------------------------------------------------------------------
// Routines Commands
// ---------------------------------------------------------------------------

#[command]
pub async fn list_routines(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "revision": 0,
        "routines": [],
        "readOnly": false,
        "recoveryMessage": null
    }))
}

#[command]
pub async fn create_routine(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    list_routines(_request).await
}

#[command]
pub async fn update_routine(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    list_routines(_request).await
}

#[command]
pub async fn set_routine_enabled(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    list_routines(_request).await
}

#[command]
pub async fn delete_routine(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    let snapshot = list_routines(_request).await?;
    Ok(serde_json::json!({
        "deleted": true,
        "snapshot": snapshot
    }))
}

// ---------------------------------------------------------------------------
// Chat Commands
// ---------------------------------------------------------------------------

#[command]
pub async fn list_chat_summaries(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "summaries": [],
        "lastProvider": "claude-code",
        "readOnly": false,
        "skippedThreads": 0,
        "recoveryMessage": null
    }))
}

#[command]
pub async fn create_general_chat(request: serde_json::Value) -> Result<serde_json::Value, String> {
    let req = &request["request"];
    let thread_id = uuid::Uuid::new_v4().to_string();
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "revision": 1,
        "id": thread_id,
        "profileId": null,
        "provider": req["provider"].as_str().unwrap_or("claude-code"),
        "title": "New Chat",
        "items": [],
        "mode": "fullAccess",
        "plan": true,
        "model": null,
        "providerOptions": [],
        "status": "idle",
        "usage": { "inputTokens": 0, "outputTokens": 0 },
        "createdAtUnixMs": 1724457600000i64,
        "updatedAtUnixMs": 1724457600000i64
    }))
}

#[command]
pub async fn load_chat_thread(request: serde_json::Value) -> Result<serde_json::Value, String> {
    let thread_id = request["request"]["threadId"].as_str().unwrap_or("c0000000-0000-0000-0000-000000000001");
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "revision": 1,
        "id": thread_id,
        "profileId": null,
        "provider": "claude-code",
        "title": "Assistant Thread",
        "items": [],
        "mode": "fullAccess",
        "plan": true,
        "model": null,
        "providerOptions": [],
        "status": "idle",
        "usage": { "inputTokens": 0, "outputTokens": 0 },
        "createdAtUnixMs": 1724457600000i64,
        "updatedAtUnixMs": 1724457600000i64
    }))
}

#[command]
pub async fn rename_chat_thread(request: serde_json::Value) -> Result<serde_json::Value, String> {
    load_chat_thread(request).await
}

#[command]
pub async fn update_chat_configuration(request: serde_json::Value) -> Result<serde_json::Value, String> {
    load_chat_thread(request).await
}

#[command]
pub async fn delete_chat_thread(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({ "deleted": true }))
}

#[command]
pub async fn start_chat_turn(request: serde_json::Value) -> Result<serde_json::Value, String> {
    let thread = load_chat_thread(request).await?;
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "runId": uuid::Uuid::new_v4().to_string(),
        "thread": thread
    }))
}

#[command]
pub async fn read_chat_turn_updates(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "resyncRequired": false,
        "events": [],
        "revision": 1,
        "afterSequence": 0,
        "nextSequence": 0
    }))
}

#[command]
pub async fn cancel_chat_turn(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({}))
}

// ---------------------------------------------------------------------------
// Notifications Commands
// ---------------------------------------------------------------------------

#[command]
pub async fn notifications_snapshot(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "revision": 0,
        "records": [],
        "unreadCount": 0,
        "openInputRequestCount": 0,
        "authorization": { "status": "authorized" },
        "preferences": { "sounds": true, "badges": true },
        "persistenceError": null,
        "archiveReadOnly": false,
        "openRecordId": null
    }))
}

#[command]
pub async fn notifications_poll(request: serde_json::Value) -> Result<serde_json::Value, String> {
    notifications_snapshot(request).await
}

#[command]
pub async fn notifications_report_attention(request: serde_json::Value) -> Result<serde_json::Value, String> {
    notifications_snapshot(request).await
}

#[command]
pub async fn notifications_mark_read(request: serde_json::Value) -> Result<serde_json::Value, String> {
    notifications_snapshot(request).await
}

#[command]
pub async fn notifications_mark_reviewed(request: serde_json::Value) -> Result<serde_json::Value, String> {
    notifications_snapshot(request).await
}

#[command]
pub async fn notifications_mark_all_read(request: serde_json::Value) -> Result<serde_json::Value, String> {
    notifications_snapshot(request).await
}

#[command]
pub async fn notifications_set_preferences(request: serde_json::Value) -> Result<serde_json::Value, String> {
    notifications_snapshot(request).await
}

#[command]
pub async fn notifications_request_authorization(request: serde_json::Value) -> Result<serde_json::Value, String> {
    notifications_snapshot(request).await
}

#[command]
pub async fn notifications_refresh_authorization(request: serde_json::Value) -> Result<serde_json::Value, String> {
    notifications_snapshot(request).await
}

#[command]
pub async fn notifications_open_system_settings(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({}))
}

#[command]
pub async fn notifications_play_sample(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({}))
}

// ---------------------------------------------------------------------------
// Terminal PTY Commands
// ---------------------------------------------------------------------------

#[command]
pub async fn start_terminal(request: serde_json::Value) -> Result<serde_json::Value, String> {
    let session_id = request["request"]["sessionId"].as_str().unwrap_or("t0000000-0000-0000-0000-000000000001");
    Ok(serde_json::json!({
        "sessionId": session_id,
        "cols": 80,
        "rows": 24
    }))
}

#[command]
pub async fn write_terminal(_request: serde_json::Value) -> Result<(), String> {
    Ok(())
}

#[command]
pub async fn resize_terminal(_request: serde_json::Value) -> Result<(), String> {
    Ok(())
}

#[command]
pub async fn terminate_terminal(_request: serde_json::Value) -> Result<(), String> {
    Ok(())
}

#[command]
pub async fn read_terminal_output(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "data": ""
    }))
}

// ---------------------------------------------------------------------------
// Code Threads & Browser Surfaces
// ---------------------------------------------------------------------------

#[command]
pub async fn create_code_thread(request: serde_json::Value) -> Result<serde_json::Value, String> {
    let thread_id = uuid::Uuid::new_v4().to_string();
    let ws_id = request["request"]["workspaceId"].as_str().unwrap_or("w0000000-0000-0000-0000-000000000001");
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "revision": 1,
        "owner": { "kind": "workspace", "workspaceId": ws_id },
        "threadId": thread_id,
        "provider": "claude-code",
        "title": "Code Session",
        "items": [],
        "mode": "fullAccess",
        "plan": true,
        "model": null,
        "providerOptions": [],
        "status": "idle",
        "usage": { "inputTokens": 0, "outputTokens": 0 },
        "isDraft": false,
        "visible": true,
        "createdAtUnixMs": 1724457600000i64,
        "updatedAtUnixMs": 1724457600000i64
    }))
}

#[command]
pub async fn read_code_thread(request: serde_json::Value) -> Result<serde_json::Value, String> {
    create_code_thread(request).await
}

#[command]
pub async fn configure_code_thread(request: serde_json::Value) -> Result<serde_json::Value, String> {
    create_code_thread(request).await
}

#[command]
pub async fn reset_code_thread(request: serde_json::Value) -> Result<serde_json::Value, String> {
    create_code_thread(request).await
}

#[command]
pub async fn set_code_thread_visibility(request: serde_json::Value) -> Result<serde_json::Value, String> {
    create_code_thread(request).await
}

#[command]
pub async fn delete_code_thread(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({ "deleted": true }))
}

#[command]
pub async fn start_code_thread_turn(request: serde_json::Value) -> Result<serde_json::Value, String> {
    let thread = create_code_thread(request).await?;
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "runId": uuid::Uuid::new_v4().to_string(),
        "thread": thread
    }))
}

#[command]
pub async fn read_code_thread_turn_updates(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "resyncRequired": false,
        "events": [],
        "revision": 1,
        "afterSequence": 0,
        "nextSequence": 0
    }))
}

#[command]
pub async fn stop_code_thread_turn(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({ "stopping": true }))
}

#[command]
pub async fn create_browser_surface(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    let surface_id = uuid::Uuid::new_v4().to_string();
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "surfaceId": surface_id,
        "descriptorId": surface_id,
        "revision": 1,
        "displayUrl": "https://bridgemind.ai",
        "transportSecurity": "secure",
        "title": "BridgeMind Browser",
        "loading": false,
        "canGoBack": false,
        "canGoForward": false,
        "visible": true
    }))
}

#[command]
pub async fn read_browser_surface(request: serde_json::Value) -> Result<serde_json::Value, String> {
    create_browser_surface(request).await
}

#[command]
pub async fn navigate_browser_surface(request: serde_json::Value) -> Result<serde_json::Value, String> {
    create_browser_surface(request).await
}

#[command]
pub async fn control_browser_surface(request: serde_json::Value) -> Result<serde_json::Value, String> {
    create_browser_surface(request).await
}

#[command]
pub async fn update_browser_surface_presentation(request: serde_json::Value) -> Result<serde_json::Value, String> {
    create_browser_surface(request).await
}

#[command]
pub async fn close_browser_surface(_request: serde_json::Value) -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({ "closed": true }))
}
