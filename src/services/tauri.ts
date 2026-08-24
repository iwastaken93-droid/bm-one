import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { getCurrentWindow } from "@tauri-apps/api/window";
import type {
  AuthSnapshot,
  AgentProfile,
  AgentMind,
  AgentSkill,
  AgentAvailability,
  ShellPreferences,
  WorkspaceProfile,
  WorkspaceLayout,
  Routine,
  ChatThread,
  CodeThread,
  BrowserSurface,
  NotificationSnapshot,
  CreditsBalance
} from "@/types";

export interface IApplicationService {
  // Auth & Session
  restoreAuth(): Promise<AuthSnapshot>;
  readAuthSnapshot(): Promise<AuthSnapshot>;
  beginSignIn(): Promise<AuthSnapshot>;
  cancelSignIn(): Promise<AuthSnapshot>;
  reopenSignInBrowser(): Promise<AuthSnapshot>;
  signOut(): Promise<AuthSnapshot>;
  retryEntitlement(): Promise<AuthSnapshot>;
  openSignUp(): Promise<AuthSnapshot>;
  openUpgrade(): Promise<AuthSnapshot>;
  getCreditsBalance(): Promise<CreditsBalance>;

  // Shell & Bootstrap
  bootstrap(): Promise<{
    schemaVersion: number;
    preferences: ShellPreferences;
    agents: AgentProfile[];
    workspaces: WorkspaceProfile[];
    recoveryNotices: Array<{ code: string; message: string }>;
    persistenceReadOnly: boolean;
  }>;
  saveShellState(preferences: ShellPreferences): Promise<void>;

  // Agents & Mind
  listAgentProfiles(): Promise<AgentProfile[]>;
  loadAgentProfile(agentId: string): Promise<AgentProfile>;
  createAgent(agent: { name: string; engine: string; purpose: string }): Promise<AgentProfile>;
  updateAgentProfile(agent: AgentProfile): Promise<AgentProfile>;
  deleteAgentProfile(agentId: string): Promise<void>;
  loadAgentMind(agentId: string): Promise<AgentMind>;
  writeAgentMemory(payload: { agentId: string; memory: string; user?: string }): Promise<AgentMind>;
  loadAgentSkill(payload: { agentId: string; skillId: string }): Promise<AgentSkill>;
  writeAgentSkill(payload: { agentId: string; skill: AgentSkill }): Promise<AgentSkill>;
  removeAgentSkill(payload: { agentId: string; skillId: string }): Promise<void>;
  listAgentStarters(): Promise<unknown[]>;
  installAgentStarter(starterId: string): Promise<void>;
  getAgentAvailability(): Promise<AgentAvailability>;
  probeAgentAvailability(): Promise<AgentAvailability>;

  // Workspaces
  addWorkspace(): Promise<WorkspaceProfile | null>;
  loadWorkspaceLayout(workspaceId: string): Promise<WorkspaceLayout>;
  saveWorkspaceLayout(layout: WorkspaceLayout): Promise<void>;

  // Code Threads
  createCodeThread(payload: { workspaceId: string; provider: string; mode: string }): Promise<CodeThread>;
  readCodeThread(threadId: string): Promise<CodeThread>;
  configureCodeThread(payload: { threadId: string; provider?: string; mode?: string }): Promise<CodeThread>;
  startCodeThreadTurn(payload: { target: string; prompt: string; expectedRevision: string }): Promise<unknown>;
  readCodeThreadTurnUpdates(target: string): Promise<unknown[]>;
  stopCodeThreadTurn(threadId: string): Promise<void>;
  resetCodeThread(threadId: string): Promise<void>;
  setCodeThreadVisibility(payload: { target: string; visible: boolean }): Promise<void>;
  deleteCodeThread(threadId: string): Promise<void>;

  // General Chat
  createGeneralChat(profileId?: string): Promise<ChatThread>;
  listChatSummaries(): Promise<ChatThread[]>;
  loadChatThread(threadId: string): Promise<ChatThread>;
  renameChatThread(payload: { threadId: string; title: string }): Promise<ChatThread>;
  updateChatConfiguration(payload: { threadId: string; provider?: string; mode?: string }): Promise<ChatThread>;
  deleteChatThread(threadId: string): Promise<void>;
  startChatTurn(payload: { threadId: string; prompt: string; expectedRevision: string }): Promise<unknown>;
  readChatTurnUpdates(threadId: string): Promise<unknown[]>;
  cancelChatTurn(threadId: string): Promise<void>;

  // Routines
  listRoutines(): Promise<Routine[]>;
  createRoutine(routine: Omit<Routine, "id">): Promise<Routine>;
  updateRoutine(routine: Routine): Promise<Routine>;
  setRoutineEnabled(payload: { routineId: string; agentId: string; enabled: boolean }): Promise<Routine>;
  deleteRoutine(payload: { routineId: string; agentId: string }): Promise<void>;

  // Terminal PTY
  startTerminal(payload: { sessionId: string; workspaceId: string; cols: number; rows: number }): Promise<void>;
  writeTerminal(payload: { sessionId: string; data: string }): Promise<void>;
  readTerminalOutput(sessionId: string): Promise<string>;
  resizeTerminal(payload: { sessionId: string; cols: number; rows: number }): Promise<void>;
  terminateTerminal(sessionId: string): Promise<void>;

  // Browser Surfaces
  createBrowserSurface(payload: { workspaceId: string; url?: string }): Promise<BrowserSurface>;
  readBrowserSurface(surfaceId: string): Promise<BrowserSurface>;
  navigateBrowserSurface(payload: { surfaceId: string; url: string }): Promise<BrowserSurface>;
  controlBrowserSurface(payload: { surfaceId: string; action: "back" | "forward" | "reload" | "zoom"; value?: number }): Promise<BrowserSurface>;
  updateBrowserSurfacePresentation(payload: { surfaceId: string; presentation: unknown }): Promise<void>;
  closeBrowserSurface(surfaceId: string): Promise<void>;

  // Notifications
  notificationsSnapshot(): Promise<NotificationSnapshot>;
  notificationsPoll(sinceRevision: number): Promise<NotificationSnapshot>;
  notificationsReportAttention(attention: unknown): Promise<NotificationSnapshot>;
  notificationsMarkRead(recordId: string): Promise<NotificationSnapshot>;
  notificationsMarkReviewed(recordIds: string[]): Promise<NotificationSnapshot>;
  notificationsMarkAllRead(): Promise<NotificationSnapshot>;
  notificationsSetPreferences(prefs: unknown): Promise<NotificationSnapshot>;
  notificationsRequestAuthorization(): Promise<NotificationSnapshot>;
  notificationsRefreshAuthorization(): Promise<NotificationSnapshot>;
  notificationsOpenSystemSettings(): Promise<void>;
  notificationsPlaySample(): Promise<void>;

  // Window Actions
  windowAction(action: "minimize" | "toggleMaximize" | "close" | "startDragging"): Promise<void>;
}

export class TauriNativeService implements IApplicationService {
  async restoreAuth() { return invoke<AuthSnapshot>("auth_bootstrap"); }
  async readAuthSnapshot() { return invoke<AuthSnapshot>("auth_snapshot"); }
  async beginSignIn() { return invoke<AuthSnapshot>("auth_begin_sign_in"); }
  async cancelSignIn() { return invoke<AuthSnapshot>("auth_cancel_sign_in"); }
  async reopenSignInBrowser() { return invoke<AuthSnapshot>("auth_reopen_sign_in"); }
  async signOut() { return invoke<AuthSnapshot>("auth_sign_out"); }
  async retryEntitlement() { return invoke<AuthSnapshot>("auth_retry_entitlement"); }
  async openSignUp() { return invoke<AuthSnapshot>("auth_open_signup"); }
  async openUpgrade() { return invoke<AuthSnapshot>("auth_open_upgrade"); }
  async getCreditsBalance() { return invoke<CreditsBalance>("credits_balance"); }

  async bootstrap() {
    return invoke<{
      schemaVersion: number;
      preferences: ShellPreferences;
      agents: AgentProfile[];
      workspaces: WorkspaceProfile[];
      recoveryNotices: Array<{ code: string; message: string }>;
      persistenceReadOnly: boolean;
    }>("bootstrap", { request: { supportedSchemaVersion: 1 } });
  }
  async saveShellState(preferences: ShellPreferences): Promise<void> {
    await invoke<void>("save_shell_state", { request: { preferences } });
  }

  async listAgentProfiles() { return invoke<AgentProfile[]>("list_agent_profiles", { request: { supportedSchemaVersion: 1 } }); }
  async loadAgentProfile(agentId: string) { return invoke<AgentProfile>("load_agent_profile", { request: { supportedSchemaVersion: 1, agentId } }); }
  async createAgent(agent: { name: string; engine: string; purpose: string }) { return invoke<AgentProfile>("create_agent", { request: { supportedSchemaVersion: 1, ...agent, confirmedByBuilder: true } }); }
  async updateAgentProfile(agent: AgentProfile) { return invoke<AgentProfile>("update_agent_profile", { request: { supportedSchemaVersion: 1, ...agent } }); }
  async deleteAgentProfile(agentId: string): Promise<void> { await invoke<void>("delete_agent_profile", { request: { supportedSchemaVersion: 1, agentId } }); }
  async loadAgentMind(agentId: string) { return invoke<AgentMind>("load_agent_mind", { request: { supportedSchemaVersion: 1, agentId } }); }
  async writeAgentMemory(payload: { agentId: string; memory: string; user?: string }) { return invoke<AgentMind>("write_agent_memory", { request: { supportedSchemaVersion: 1, ...payload } }); }
  async loadAgentSkill(payload: { agentId: string; skillId: string }) { return invoke<AgentSkill>("load_agent_skill", { request: { supportedSchemaVersion: 1, ...payload } }); }
  async writeAgentSkill(payload: { agentId: string; skill: AgentSkill }) { return invoke<AgentSkill>("write_agent_skill", { request: { supportedSchemaVersion: 1, ...payload } }); }
  async removeAgentSkill(payload: { agentId: string; skillId: string }): Promise<void> { await invoke<void>("remove_agent_skill", { request: { supportedSchemaVersion: 1, ...payload } }); }
  async listAgentStarters() { return invoke<unknown[]>("list_agent_starters", { request: { supportedSchemaVersion: 1 } }); }
  async installAgentStarter(starterId: string): Promise<void> { await invoke<void>("install_agent_starter", { request: { supportedSchemaVersion: 1, starterId } }); }
  async getAgentAvailability() { return invoke<AgentAvailability>("get_agent_availability", { request: { supportedSchemaVersion: 1 } }); }
  async probeAgentAvailability() { return invoke<AgentAvailability>("probe_agent_availability", { request: { supportedSchemaVersion: 1 } }); }

  async addWorkspace() {
    const selected = await open({ directory: true, multiple: false, title: "Add Workspace" });
    if (!selected || typeof selected !== "string") return null;
    return invoke<WorkspaceProfile>("add_workspace", { request: { path: selected } });
  }
  async loadWorkspaceLayout(workspaceId: string) { return invoke<WorkspaceLayout>("load_workspace_layout", { request: { workspaceId } }); }
  async saveWorkspaceLayout(layout: WorkspaceLayout): Promise<void> { await invoke<void>("save_workspace_layout", { request: { layout } }); }

  async createCodeThread(payload: { workspaceId: string; provider: string; mode: string }) { return invoke<CodeThread>("create_code_thread", { request: payload }); }
  async readCodeThread(threadId: string) { return invoke<CodeThread>("read_code_thread", { request: { threadId } }); }
  async configureCodeThread(payload: { threadId: string; provider?: string; mode?: string }) { return invoke<CodeThread>("configure_code_thread", { request: payload }); }
  async startCodeThreadTurn(payload: { target: string; prompt: string; expectedRevision: string }) { return invoke("start_code_thread_turn", { request: { ...payload, confirmedByBuilder: true } }); }
  async readCodeThreadTurnUpdates(target: string) { return invoke<unknown[]>("read_code_thread_turn_updates", { request: { target } }); }
  async stopCodeThreadTurn(threadId: string): Promise<void> { await invoke<void>("stop_code_thread_turn", { request: { threadId } }); }
  async resetCodeThread(threadId: string): Promise<void> { await invoke<void>("reset_code_thread", { request: { threadId } }); }
  async setCodeThreadVisibility(payload: { target: string; visible: boolean }): Promise<void> { await invoke<void>("set_code_thread_visibility", { request: payload }); }
  async deleteCodeThread(threadId: string): Promise<void> { await invoke<void>("delete_code_thread", { request: { threadId } }); }

  async createGeneralChat(profileId?: string) { return invoke<ChatThread>("create_general_chat", { request: { profileId } }); }
  async listChatSummaries() { return invoke<ChatThread[]>("list_chat_summaries", { request: { supportedSchemaVersion: 1 } }); }
  async loadChatThread(threadId: string) { return invoke<ChatThread>("load_chat_thread", { request: { threadId } }); }
  async renameChatThread(payload: { threadId: string; title: string }) { return invoke<ChatThread>("rename_chat_thread", { request: payload }); }
  async updateChatConfiguration(payload: { threadId: string; provider?: string; mode?: string }) { return invoke<ChatThread>("update_chat_configuration", { request: payload }); }
  async deleteChatThread(threadId: string): Promise<void> { await invoke<void>("delete_chat_thread", { request: { threadId } }); }
  async startChatTurn(payload: { threadId: string; prompt: string; expectedRevision: string }) { return invoke("start_chat_turn", { request: { ...payload, confirmedByBuilder: true } }); }
  async readChatTurnUpdates(threadId: string) { return invoke<unknown[]>("read_chat_turn_updates", { request: { threadId } }); }
  async cancelChatTurn(threadId: string): Promise<void> { await invoke<void>("cancel_chat_turn", { request: { threadId } }); }

  async listRoutines() { return invoke<Routine[]>("list_routines", { request: { supportedSchemaVersion: 1 } }); }
  async createRoutine(routine: Omit<Routine, "id">) { return invoke<Routine>("create_routine", { request: routine }); }
  async updateRoutine(routine: Routine) { return invoke<Routine>("update_routine", { request: routine }); }
  async setRoutineEnabled(payload: { routineId: string; agentId: string; enabled: boolean }) { return invoke<Routine>("set_routine_enabled", { request: payload }); }
  async deleteRoutine(payload: { routineId: string; agentId: string }): Promise<void> { await invoke<void>("delete_routine", { request: payload }); }

  async startTerminal(payload: { sessionId: string; workspaceId: string; cols: number; rows: number }): Promise<void> { await invoke<void>("start_terminal", { request: payload }); }
  async writeTerminal(payload: { sessionId: string; data: string }): Promise<void> { await invoke<void>("write_terminal", { request: payload }); }
  async readTerminalOutput(sessionId: string) { return invoke<string>("read_terminal_output", { request: { sessionId } }); }
  async resizeTerminal(payload: { sessionId: string; cols: number; rows: number }): Promise<void> { await invoke<void>("resize_terminal", { request: payload }); }
  async terminateTerminal(sessionId: string): Promise<void> { await invoke<void>("terminate_terminal", { request: { sessionId } }); }

  async createBrowserSurface(payload: { workspaceId: string; url?: string }) { return invoke<BrowserSurface>("create_browser_surface", { request: payload }); }
  async readBrowserSurface(surfaceId: string) { return invoke<BrowserSurface>("read_browser_surface", { request: { surfaceId } }); }
  async navigateBrowserSurface(payload: { surfaceId: string; url: string }) { return invoke<BrowserSurface>("navigate_browser_surface", { request: payload }); }
  async controlBrowserSurface(payload: { surfaceId: string; action: "back" | "forward" | "reload" | "zoom"; value?: number }) { return invoke<BrowserSurface>("control_browser_surface", { request: payload }); }
  async updateBrowserSurfacePresentation(payload: { surfaceId: string; presentation: unknown }): Promise<void> { await invoke<void>("update_browser_surface_presentation", { request: payload }); }
  async closeBrowserSurface(surfaceId: string): Promise<void> { await invoke<void>("close_browser_surface", { request: { surfaceId } }); }

  async notificationsSnapshot() { return invoke<NotificationSnapshot>("notifications_snapshot", { request: { supportedSchemaVersion: 1 } }); }
  async notificationsPoll(sinceRevision: number) { return invoke<NotificationSnapshot>("notifications_poll", { request: { supportedSchemaVersion: 1, sinceRevision } }); }
  async notificationsReportAttention(attention: unknown) { return invoke<NotificationSnapshot>("notifications_report_attention", { request: { attention } }); }
  async notificationsMarkRead(recordId: string) { return invoke<NotificationSnapshot>("notifications_mark_read", { request: { recordId } }); }
  async notificationsMarkReviewed(recordIds: string[]) { return invoke<NotificationSnapshot>("notifications_mark_reviewed", { request: { recordIds } }); }
  async notificationsMarkAllRead() { return invoke<NotificationSnapshot>("notifications_mark_all_read", { request: { supportedSchemaVersion: 1 } }); }
  async notificationsSetPreferences(prefs: unknown) { return invoke<NotificationSnapshot>("notifications_set_preferences", { request: prefs }); }
  async notificationsRequestAuthorization() { return invoke<NotificationSnapshot>("notifications_request_authorization"); }
  async notificationsRefreshAuthorization() { return invoke<NotificationSnapshot>("notifications_refresh_authorization"); }
  async notificationsOpenSystemSettings(): Promise<void> { await invoke<void>("notifications_open_system_settings"); }
  async notificationsPlaySample(): Promise<void> { await invoke<void>("notifications_play_sample"); }

  async windowAction(action: "minimize" | "toggleMaximize" | "close" | "startDragging") {
    const win = getCurrentWindow();
    switch (action) {
      case "minimize": return win.minimize();
      case "toggleMaximize": return win.toggleMaximize();
      case "close": return win.close();
      case "startDragging": return win.startDragging();
    }
  }
}
