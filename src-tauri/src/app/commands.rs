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
pub async fn auth_bootstrap(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
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
pub async fn auth_snapshot(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    auth_bootstrap(request).await
}

#[command]
pub async fn auth_begin_sign_in(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
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
pub async fn auth_cancel_sign_in(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
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
pub async fn auth_reopen_sign_in(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    auth_begin_sign_in(request).await
}

#[command]
pub async fn auth_sign_out(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    auth_cancel_sign_in(request).await
}

#[command]
pub async fn auth_retry_entitlement(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    auth_bootstrap(request).await
}

#[command]
pub async fn auth_open_signup(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    auth_snapshot(request).await
}

#[command]
pub async fn auth_open_upgrade(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    auth_snapshot(request).await
}

#[command]
pub async fn credits_balance(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
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
pub async fn bootstrap(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
    let browser_token = "d0000000-0000-4000-8000-000000000001";
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "preferences": {
            "schemaVersion": 1,
            "workMode": "agent",
            "route": { "kind": "agent" },
            "selectedWorkspaceId": null,
            "selectedAgentId": null,
            "sidebarVisible": true,
            "appearance": "dark",
            "zoomPercent": 100
        },
        "agents": [],
        "workspaces": [],
        "recoveryNotices": [],
        "persistenceReadOnly": false,
        "browserDocumentToken": browser_token
    }))
}

#[command]
pub async fn save_shell_state(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
    Ok(serde_json::Value::Null)
}

#[command]
pub async fn add_workspace(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let path = request
        .as_ref()
        .and_then(|r| r.get("request"))
        .and_then(|r| r.get("path").or_else(|| r.get("selectedPath")))
        .and_then(|p| p.as_str())
        .unwrap_or("Project Workspace");

    Ok(serde_json::json!({
        "id": uuid::Uuid::new_v4().to_string(),
        "displayName": path,
        "createdAtUnixMs": 1724457600000i64,
        "lastOpenedAtUnixMs": 1724457600000i64
    }))
}

#[command]
pub async fn load_workspace_layout(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
    Ok(serde_json::json!({
        "layout": null,
        "recoveryNotices": [],
        "readOnly": false
    }))
}

#[command]
pub async fn save_workspace_layout(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
    Ok(serde_json::Value::Null)
}

// ---------------------------------------------------------------------------
// Agent Hub & Mind Commands
// ---------------------------------------------------------------------------

#[command]
pub async fn list_agent_profiles(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
    Ok(serde_json::json!([]))
}

#[command]
pub async fn load_agent_profile(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let agent_id = request
        .as_ref()
        .and_then(|r| r.get("request"))
        .and_then(|r| r.get("agentId"))
        .and_then(|id| id.as_str())
        .unwrap_or("a0000000-0000-4000-8000-000000000001");

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
pub async fn create_agent(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let req = request.as_ref().and_then(|r| r.get("request"));
    let name = req.and_then(|r| r.get("name")).and_then(|n| n.as_str()).unwrap_or("New Agent");
    let engine = req.and_then(|r| r.get("engine")).and_then(|e| e.as_str()).unwrap_or("claude-code");
    let purpose = req.and_then(|r| r.get("purpose")).and_then(|p| p.as_str()).unwrap_or("");

    Ok(serde_json::json!({
        "id": uuid::Uuid::new_v4().to_string(),
        "name": name,
        "engine": engine,
        "purpose": purpose,
        "createdAtUnixMs": 1724457600000i64
    }))
}

#[command]
pub async fn update_agent_profile(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let req = request.as_ref().and_then(|r| r.get("request"));
    let agent_id = req.and_then(|r| r.get("agentId")).and_then(|id| id.as_str()).unwrap_or("a0000000-0000-4000-8000-000000000001");
    let name = req.and_then(|r| r.get("name")).and_then(|n| n.as_str()).unwrap_or("Claude Code");
    let engine = req.and_then(|r| r.get("engine")).and_then(|e| e.as_str()).unwrap_or("claude-code");
    let brief = req.and_then(|r| r.get("brief")).and_then(|b| b.as_str()).unwrap_or("");
    let default_mode = req.and_then(|r| r.get("defaultMode")).and_then(|m| m.as_str()).unwrap_or("fullAccess");
    let default_plan = req.and_then(|r| r.get("defaultPlan")).and_then(|p| p.as_bool()).unwrap_or(true);

    Ok(serde_json::json!({
        "agentId": agent_id,
        "name": name,
        "engine": engine,
        "brief": brief,
        "defaultMode": default_mode,
        "defaultPlan": default_plan,
        "defaultModel": null,
        "defaultProviderOptions": [],
        "memoryBudget": 4096,
        "reflectionMode": "adaptive",
        "allowAgentScheduling": true,
        "confirmedByBuilder": true
    }))
}

#[command]
pub async fn delete_agent_profile(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let agent_id = request
        .as_ref()
        .and_then(|r| r.get("request"))
        .and_then(|r| r.get("agentId"))
        .and_then(|id| id.as_str())
        .unwrap_or("a0000000-0000-4000-8000-000000000001");

    Ok(serde_json::json!({
        "schemaVersion": 1,
        "agentId": agent_id,
        "deleted": true,
        "cleanupPending": false
    }))
}

#[command]
pub async fn load_agent_mind(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let agent_id = request
        .as_ref()
        .and_then(|r| r.get("request"))
        .and_then(|r| r.get("agentId"))
        .and_then(|id| id.as_str())
        .unwrap_or("a0000000-0000-4000-8000-000000000001");

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
pub async fn write_agent_memory(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    load_agent_mind(request).await
}

#[command]
pub async fn load_agent_skill(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let skill_id = request
        .as_ref()
        .and_then(|r| r.get("request"))
        .and_then(|r| r.get("skillId"))
        .and_then(|id| id.as_str())
        .unwrap_or("skill-001");

    Ok(serde_json::json!({
        "schemaVersion": 1,
        "id": skill_id,
        "name": "Rust Systems Architect",
        "description": "Deep memory and optimization patterns for Rust & Tauri.",
        "source": "# Rust Systems Architect\n\nExpert guidance on Tauri IPC."
    }))
}

#[command]
pub async fn write_agent_skill(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    load_agent_mind(request).await
}

#[command]
pub async fn remove_agent_skill(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let mind = load_agent_mind(request).await?;
    Ok(serde_json::json!({
        "removed": true,
        "mind": mind
    }))
}

#[command]
pub async fn list_agent_starters(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
    Ok(serde_json::json!([
        { "id": "code-review", "title": "Automated Code Reviewer", "summary": "Scans pull requests for security and architecture patterns." },
        { "id": "doc-writer", "title": "Technical Documentation Generator", "summary": "Writes comprehensive markdown docs from source code." }
    ]))
}

#[command]
pub async fn install_agent_starter(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let mind = load_agent_mind(request).await?;
    Ok(serde_json::json!({
        "installed": true,
        "mind": mind
    }))
}

#[command]
pub async fn get_agent_availability(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
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
pub async fn probe_agent_availability(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    get_agent_availability(request).await
}

// ---------------------------------------------------------------------------
// Routines Commands
// ---------------------------------------------------------------------------

#[command]
pub async fn list_routines(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "routines": [],
        "agentRevisions": [],
        "runNowAvailability": { "available": true }
    }))
}

#[command]
pub async fn create_routine(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    list_routines(request).await
}

#[command]
pub async fn update_routine(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    list_routines(request).await
}

#[command]
pub async fn set_routine_enabled(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    list_routines(request).await
}

#[command]
pub async fn delete_routine(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let snapshot = list_routines(request).await?;
    Ok(serde_json::json!({
        "deleted": true,
        "snapshot": snapshot
    }))
}

// ---------------------------------------------------------------------------
// Chat Commands
// ---------------------------------------------------------------------------

#[command]
pub async fn list_chat_summaries(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "summaries": [],
        "lastProvider": "claude",
        "readOnly": false,
        "skippedThreads": 0,
        "recoveryMessage": null
    }))
}

#[command]
pub async fn create_general_chat(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let req = request.as_ref().and_then(|r| r.get("request"));
    let provider = req.and_then(|r| r.get("provider")).and_then(|p| p.as_str()).unwrap_or("claude");
    let thread_id = uuid::Uuid::new_v4().to_string();

    Ok(serde_json::json!({
        "schemaVersion": 1,
        "revision": 1,
        "id": thread_id,
        "profileId": null,
        "provider": provider,
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
pub async fn load_chat_thread(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let thread_id = request
        .as_ref()
        .and_then(|r| r.get("request"))
        .and_then(|r| r.get("threadId"))
        .and_then(|id| id.as_str())
        .unwrap_or("c0000000-0000-4000-8000-000000000001");

    Ok(serde_json::json!({
        "schemaVersion": 1,
        "revision": 1,
        "id": thread_id,
        "profileId": null,
        "provider": "claude",
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
pub async fn rename_chat_thread(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    load_chat_thread(request).await
}

#[command]
pub async fn update_chat_configuration(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    load_chat_thread(request).await
}

#[command]
pub async fn delete_chat_thread(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
    Ok(serde_json::json!({ "deleted": true }))
}

#[command]
pub async fn start_chat_turn(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let thread = load_chat_thread(request).await?;
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "runId": uuid::Uuid::new_v4().to_string(),
        "thread": thread
    }))
}

#[command]
pub async fn read_chat_turn_updates(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
    Ok(serde_json::json!({
        "resyncRequired": false,
        "events": [],
        "revision": 1,
        "afterSequence": 0,
        "nextSequence": 0
    }))
}

#[command]
pub async fn cancel_chat_turn(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
    Ok(serde_json::Value::Null)
}

// ---------------------------------------------------------------------------
// Notifications Commands
// ---------------------------------------------------------------------------

#[command]
pub async fn notifications_snapshot(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "revision": 0,
        "records": [],
        "unreadCount": 0,
        "openInputRequestCount": 0,
        "authorization": "authorized",
        "preferences": {
            "schemaVersion": 1,
            "osNotificationsEnabled": true,
            "finishSoundEnabled": true,
            "inputRequestsEnabled": true
        },
        "persistenceError": null,
        "archiveReadOnly": false,
        "openRecordId": null
    }))
}

#[command]
pub async fn notifications_poll(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    notifications_snapshot(request).await
}

#[command]
pub async fn notifications_report_attention(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    notifications_snapshot(request).await
}

#[command]
pub async fn notifications_mark_read(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    notifications_snapshot(request).await
}

#[command]
pub async fn notifications_mark_reviewed(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    notifications_snapshot(request).await
}

#[command]
pub async fn notifications_mark_all_read(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    notifications_snapshot(request).await
}

#[command]
pub async fn notifications_set_preferences(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    notifications_snapshot(request).await
}

#[command]
pub async fn notifications_request_authorization(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    notifications_snapshot(request).await
}

#[command]
pub async fn notifications_refresh_authorization(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    notifications_snapshot(request).await
}

#[command]
pub async fn notifications_open_system_settings(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
    Ok(serde_json::Value::Null)
}

#[command]
pub async fn notifications_play_sample(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
    Ok(serde_json::Value::Null)
}

// ---------------------------------------------------------------------------
// Terminal PTY Commands
// ---------------------------------------------------------------------------

#[command]
pub async fn start_terminal(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let session_id = request
        .as_ref()
        .and_then(|r| r.get("request"))
        .and_then(|r| r.get("sessionId"))
        .and_then(|id| id.as_str())
        .unwrap_or("t0000000-0000-4000-8000-000000000001");

    Ok(serde_json::json!({
        "sessionId": session_id,
        "cols": 80,
        "rows": 24
    }))
}

#[command]
pub async fn write_terminal(request: Option<serde_json::Value>) -> Result<(), String> {
    let _ = request;
    Ok(())
}

#[command]
pub async fn resize_terminal(request: Option<serde_json::Value>) -> Result<(), String> {
    let _ = request;
    Ok(())
}

#[command]
pub async fn terminate_terminal(request: Option<serde_json::Value>) -> Result<(), String> {
    let _ = request;
    Ok(())
}

#[command]
pub async fn read_terminal_output(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
    Ok(serde_json::json!({
        "data": ""
    }))
}

// ---------------------------------------------------------------------------
// Code Threads & Browser Surfaces
// ---------------------------------------------------------------------------

#[command]
pub async fn create_code_thread(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let thread_id = uuid::Uuid::new_v4().to_string();
    let ws_id = request
        .as_ref()
        .and_then(|r| r.get("request"))
        .and_then(|r| r.get("workspaceId"))
        .and_then(|w| w.as_str())
        .unwrap_or("w0000000-0000-4000-8000-000000000001");

    Ok(serde_json::json!({
        "schemaVersion": 1,
        "revision": 1,
        "owner": { "kind": "workspace", "workspaceId": ws_id },
        "threadId": thread_id,
        "provider": "claude",
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
pub async fn read_code_thread(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    create_code_thread(request).await
}

#[command]
pub async fn configure_code_thread(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    create_code_thread(request).await
}

#[command]
pub async fn reset_code_thread(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    create_code_thread(request).await
}

#[command]
pub async fn set_code_thread_visibility(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    create_code_thread(request).await
}

#[command]
pub async fn delete_code_thread(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
    Ok(serde_json::json!({ "deleted": true }))
}

#[command]
pub async fn start_code_thread_turn(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let thread = create_code_thread(request).await?;
    Ok(serde_json::json!({
        "schemaVersion": 1,
        "runId": uuid::Uuid::new_v4().to_string(),
        "thread": thread
    }))
}

#[command]
pub async fn read_code_thread_turn_updates(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
    Ok(serde_json::json!({
        "resyncRequired": false,
        "events": [],
        "revision": 1,
        "afterSequence": 0,
        "nextSequence": 0
    }))
}

#[command]
pub async fn stop_code_thread_turn(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({ "stopping": true }))
}

#[command]
pub async fn create_browser_surface(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
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
pub async fn read_browser_surface(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    create_browser_surface(request).await
}

#[command]
pub async fn navigate_browser_surface(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    create_browser_surface(request).await
}

#[command]
pub async fn control_browser_surface(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    create_browser_surface(request).await
}

#[command]
pub async fn update_browser_surface_presentation(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    create_browser_surface(request).await
}

#[command]
pub async fn close_browser_surface(request: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
    let _ = request;
    Ok(serde_json::json!({ "closed": true }))
}
