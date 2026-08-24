import type { IApplicationService } from "./tauri";
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

export class MockApplicationService implements IApplicationService {
  private authState: AuthSnapshot = {
    schemaVersion: 1,
    revision: 1,
    phase: { kind: "signedIn" },
    access: { kind: "entitled" },
    user: { email: "engineer@bridgemind.ai", name: "Lead Engineer" },
    subscriptionTier: "pro",
    canReopenBrowser: false,
    paymentRecovery: false
  };

  private preferences: ShellPreferences = {
    schemaVersion: 1,
    workMode: "agent",
    route: { kind: "agent" },
    selectedWorkspaceId: null,
    selectedAgentId: null,
    sidebarVisible: true,
    appearance: "dark",
    zoomPercent: 100
  };

  private workspaces = new Map<string, WorkspaceProfile>();
  private workspaceLayouts = new Map<string, WorkspaceLayout>();
  private agents = new Map<string, AgentProfile>();
  private agentMinds = new Map<string, AgentMind>();
  private agentSkills = new Map<string, Map<string, AgentSkill>>();
  private routines = new Map<string, Routine>();
  private chatThreads = new Map<string, ChatThread>();
  private codeThreads = new Map<string, CodeThread>();
  private browserSurfaces = new Map<string, BrowserSurface>();
  private notifications: NotificationSnapshot = {
    schemaVersion: 1,
    revision: 1,
    records: [],
    unreadCount: 0,
    openInputRequestCount: 0,
    authorization: "authorized",
    preferences: {
      osNotificationsEnabled: true,
      finishSoundEnabled: true,
      inputRequestsEnabled: true
    }
  };

  // Auth & Sessions
  async restoreAuth() { return structuredClone(this.authState); }
  async readAuthSnapshot() { return structuredClone(this.authState); }
  async beginSignIn() {
    this.authState = {
      ...this.authState,
      revision: this.authState.revision + 1,
      phase: { kind: "signingIn", step: "starting" },
      canReopenBrowser: false
    };

    queueMicrotask(() => {
      if (this.authState.phase.kind === "signingIn" && this.authState.phase.step === "starting") {
        this.authState = {
          ...this.authState,
          revision: this.authState.revision + 1,
          phase: { kind: "signingIn", step: "waitingForBrowser" },
          canReopenBrowser: true
        };
      }
    });

    return structuredClone(this.authState);
  }
  async cancelSignIn() {
    this.authState = {
      ...this.authState,
      revision: this.authState.revision + 1,
      phase: { kind: "signedOut" },
      canReopenBrowser: false
    };
    return structuredClone(this.authState);
  }
  async reopenSignInBrowser() { return structuredClone(this.authState); }
  async signOut() {
    this.authState = {
      schemaVersion: 1,
      revision: this.authState.revision + 1,
      phase: { kind: "signedOut" },
      access: { kind: "unknown" },
      subscriptionTier: "free",
      canReopenBrowser: false,
      paymentRecovery: false
    };
    return structuredClone(this.authState);
  }
  async retryEntitlement() {
    this.authState = {
      ...this.authState,
      revision: this.authState.revision + 1,
      phase: { kind: "signedIn" },
      access: { kind: "entitled" },
      user: { email: "engineer@bridgemind.ai", name: "Lead Engineer" },
      subscriptionTier: "pro"
    };
    return structuredClone(this.authState);
  }
  async openSignUp() { return structuredClone(this.authState); }
  async openUpgrade() { return structuredClone(this.authState); }
  async getCreditsBalance(): Promise<CreditsBalance> {
    return {
      balance: 12500,
      cycleBalance: 10000,
      purchasedBalance: 2500,
      currentCycleGranted: 10000,
      currentCycleSpent: 4200,
      lifetimeGranted: 120000,
      lifetimeSpent: 96000,
      lastGrantedAt: "2026-08-01T00:00:00.000Z"
    };
  }

  // Shell
  async bootstrap() {
    return {
      schemaVersion: 1,
      preferences: structuredClone(this.preferences),
      agents: Array.from(this.agents.values()),
      workspaces: Array.from(this.workspaces.values()),
      recoveryNotices: [],
      persistenceReadOnly: false
    };
  }
  async saveShellState(preferences: ShellPreferences): Promise<void> {
    this.preferences = structuredClone(preferences);
  }

  // Agents
  async listAgentProfiles() { return Array.from(this.agents.values()); }
  async loadAgentProfile(agentId: string) {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error("agent_not_found");
    return structuredClone(agent);
  }
  async createAgent(agent: { name: string; engine: any; purpose: string }) {
    const id = crypto.randomUUID();
    const newAgent: AgentProfile = { id, name: agent.name, engine: agent.engine, purpose: agent.purpose, createdAtUnixMs: Date.now() };
    this.agents.set(id, newAgent);
    this.agentMinds.set(id, { schemaVersion: 1, agentId: id, memory: "", user: "", skills: [], memoryUpdatedAtUnixMs: Date.now(), userUpdatedAtUnixMs: Date.now(), memoryRevision: null, userRevision: null, readIssues: [] });
    return structuredClone(newAgent);
  }
  async updateAgentProfile(agent: AgentProfile) {
    this.agents.set(agent.id, structuredClone(agent));
    return structuredClone(agent);
  }
  async deleteAgentProfile(agentId: string): Promise<void> {
    this.agents.delete(agentId);
    this.agentMinds.delete(agentId);
  }
  async loadAgentMind(agentId: string) {
    const mind = this.agentMinds.get(agentId);
    if (!mind) throw new Error("agent_mind_not_found");
    return structuredClone(mind);
  }
  async writeAgentMemory(payload: { agentId: string; memory: string; user?: string }) {
    const mind = this.agentMinds.get(payload.agentId);
    if (!mind) throw new Error("agent_mind_not_found");
    mind.memory = payload.memory;
    if (payload.user !== undefined) mind.user = payload.user;
    mind.memoryUpdatedAtUnixMs = Date.now();
    return structuredClone(mind);
  }
  async loadAgentSkill(payload: { agentId: string; skillId: string }) {
    const skills = this.agentSkills.get(payload.agentId);
    const skill = skills?.get(payload.skillId);
    if (!skill) throw new Error("skill_not_found");
    return structuredClone(skill);
  }
  async writeAgentSkill(payload: { agentId: string; skill: AgentSkill }) {
    let skills = this.agentSkills.get(payload.agentId);
    if (!skills) { skills = new Map(); this.agentSkills.set(payload.agentId, skills); }
    skills.set(payload.skill.id, structuredClone(payload.skill));
    return structuredClone(payload.skill);
  }
  async removeAgentSkill(payload: { agentId: string; skillId: string }): Promise<void> {
    this.agentSkills.get(payload.agentId)?.delete(payload.skillId);
  }
  async listAgentStarters(): Promise<unknown[]> { return []; }
  async installAgentStarter(_starterId: string): Promise<void> {}
  async getAgentAvailability(): Promise<AgentAvailability> {
    return {
      scope: "system",
      phase: "ready",
      hasProbed: true,
      teammates: [
        { engine: "claude-code", installed: true, verified: true, version: "0.2.29" },
        { engine: "codex", installed: true, verified: true, version: "1.0.4" },
        { engine: "cursor", installed: true, verified: true, version: "0.42.0" },
        { engine: "aider", installed: true, verified: true, version: "0.50.0" }
      ]
    };
  }
  async probeAgentAvailability(): Promise<AgentAvailability> {
    return this.getAgentAvailability();
  }

  // Workspaces
  async addWorkspace(): Promise<WorkspaceProfile | null> {
    const id = crypto.randomUUID();
    const ws: WorkspaceProfile = { id, displayName: "Project Workspace", createdAtUnixMs: Date.now(), lastOpenedAtUnixMs: Date.now() };
    this.workspaces.set(id, ws);
    return ws;
  }
  async loadWorkspaceLayout(workspaceId: string): Promise<WorkspaceLayout> {
    let layout = this.workspaceLayouts.get(workspaceId);
    if (!layout) {
      const tabId = crypto.randomUUID();
      const leafId = crypto.randomUUID();
      layout = {
        schemaVersion: 1,
        workspaceId,
        activeTabId: tabId,
        tabs: [{
          id: tabId,
          displayName: "Terminal",
          focusedLeafId: leafId,
          root: { type: "leaf", id: leafId, occupant: { kind: "terminal", sessionId: crypto.randomUUID() } }
        }]
      };
      this.workspaceLayouts.set(workspaceId, layout);
    }
    return structuredClone(layout);
  }
  async saveWorkspaceLayout(layout: WorkspaceLayout): Promise<void> {
    this.workspaceLayouts.set(layout.workspaceId, structuredClone(layout));
  }

  // Code Threads
  async createCodeThread(payload: { workspaceId: string; provider: any; mode: any }) {
    const id = crypto.randomUUID();
    const thread: CodeThread = {
      schemaVersion: 1,
      id,
      workspaceId: payload.workspaceId,
      title: "New Coding Task",
      provider: payload.provider,
      mode: payload.mode,
      plan: true,
      model: "claude-3-5-sonnet",
      providerOptions: {},
      items: [],
      status: "idle",
      isDraft: true,
      createdAtUnixMs: Date.now(),
      updatedAtUnixMs: Date.now()
    };
    this.codeThreads.set(id, thread);
    return structuredClone(thread);
  }
  async readCodeThread(threadId: string) {
    const thread = this.codeThreads.get(threadId);
    if (!thread) throw new Error("thread_not_found");
    return structuredClone(thread);
  }
  async configureCodeThread(payload: { threadId: string; provider?: any; mode?: any }) {
    const thread = this.codeThreads.get(payload.threadId);
    if (!thread) throw new Error("thread_not_found");
    if (payload.provider) thread.provider = payload.provider;
    if (payload.mode) thread.mode = payload.mode;
    return structuredClone(thread);
  }
  async startCodeThreadTurn(payload: { target: string; prompt: string; expectedRevision: string }): Promise<unknown> {
    const thread = this.codeThreads.get(payload.target);
    if (!thread) throw new Error("thread_not_found");
    thread.status = "running";
    thread.items.push({
      id: `user-${Date.now()}`,
      kind: "user",
      text: payload.prompt,
      title: null,
      detail: null,
      status: null,
      streaming: false,
      exitCode: null,
      createdAtUnixMs: Date.now(),
      attachments: []
    });
    return { ok: true };
  }
  async readCodeThreadTurnUpdates(_target: string): Promise<unknown[]> { return []; }
  async stopCodeThreadTurn(threadId: string): Promise<void> {
    const thread = this.codeThreads.get(threadId);
    if (thread) thread.status = "idle";
  }
  async resetCodeThread(threadId: string): Promise<void> {
    const thread = this.codeThreads.get(threadId);
    if (thread) thread.items = [];
  }
  async setCodeThreadVisibility(_payload: { target: string; visible: boolean }): Promise<void> {}
  async deleteCodeThread(threadId: string): Promise<void> { this.codeThreads.delete(threadId); }

  // General Chat
  async createGeneralChat(profileId?: string) {
    const id = crypto.randomUUID();
    const chat: ChatThread = {
      schemaVersion: 1,
      revision: "rev-1",
      id,
      profileId: profileId ?? null,
      provider: "claude-code",
      title: "New Conversation",
      items: [],
      mode: "fullAccess",
      plan: false,
      model: "claude-3-5-sonnet",
      status: "idle",
      createdAtUnixMs: Date.now(),
      updatedAtUnixMs: Date.now()
    };
    this.chatThreads.set(id, chat);
    return structuredClone(chat);
  }
  async listChatSummaries() { return Array.from(this.chatThreads.values()); }
  async loadChatThread(threadId: string) {
    const chat = this.chatThreads.get(threadId);
    if (!chat) throw new Error("chat_not_found");
    return structuredClone(chat);
  }
  async renameChatThread(payload: { threadId: string; title: string }) {
    const chat = this.chatThreads.get(payload.threadId);
    if (!chat) throw new Error("chat_not_found");
    chat.title = payload.title;
    return structuredClone(chat);
  }
  async updateChatConfiguration(payload: { threadId: string; provider?: string; mode?: string }) {
    const chat = this.chatThreads.get(payload.threadId);
    if (!chat) throw new Error("chat_not_found");
    if (payload.provider) chat.provider = payload.provider;
    return structuredClone(chat);
  }
  async deleteChatThread(threadId: string): Promise<void> { this.chatThreads.delete(threadId); }
  async startChatTurn(payload: { threadId: string; prompt: string; expectedRevision: string }): Promise<unknown> {
    const chat = this.chatThreads.get(payload.threadId);
    if (!chat) throw new Error("chat_not_found");
    chat.status = "running";
    chat.items.push({
      id: `user-${Date.now()}`,
      kind: "user",
      text: payload.prompt,
      title: null,
      detail: null,
      status: null,
      streaming: false,
      exitCode: null,
      createdAtUnixMs: Date.now(),
      attachments: []
    });
    return { ok: true };
  }
  async readChatTurnUpdates(_threadId: string): Promise<unknown[]> { return []; }
  async cancelChatTurn(threadId: string): Promise<void> {
    const chat = this.chatThreads.get(threadId);
    if (chat) chat.status = "idle";
  }

  // Routines
  async listRoutines() { return Array.from(this.routines.values()); }
  async createRoutine(routine: Omit<Routine, "id">) {
    const id = crypto.randomUUID();
    const newRoutine: Routine = { ...routine, id, lastRunAtUnixMs: null, nextRunAtUnixMs: Date.now() + 3600000 };
    this.routines.set(id, newRoutine);
    return structuredClone(newRoutine);
  }
  async updateRoutine(routine: Routine) {
    this.routines.set(routine.id, structuredClone(routine));
    return structuredClone(routine);
  }
  async setRoutineEnabled(payload: { routineId: string; agentId: string; enabled: boolean }) {
    const r = this.routines.get(payload.routineId);
    if (!r) throw new Error("routine_not_found");
    r.enabled = payload.enabled;
    return structuredClone(r);
  }
  async deleteRoutine(payload: { routineId: string; agentId: string }): Promise<void> { this.routines.delete(payload.routineId); }

  // Terminal PTY
  async startTerminal(_payload: any): Promise<void> {}
  async writeTerminal(_payload: any): Promise<void> {}
  async readTerminalOutput(_sessionId: string) { return ""; }
  async resizeTerminal(_payload: any): Promise<void> {}
  async terminateTerminal(_sessionId: string): Promise<void> {}

  // Browser Surfaces
  async createBrowserSurface(payload: { workspaceId: string; url?: string }) {
    const surfaceId = crypto.randomUUID();
    const surf: BrowserSurface = { surfaceId, workspaceId: payload.workspaceId, url: payload.url ?? "https://google.com", title: "Web Browser", canGoBack: false, canGoForward: false, isLoading: false, zoomFactor: 1.0 };
    this.browserSurfaces.set(surfaceId, surf);
    return structuredClone(surf);
  }
  async readBrowserSurface(surfaceId: string) {
    const surf = this.browserSurfaces.get(surfaceId);
    if (!surf) throw new Error("browser_not_found");
    return structuredClone(surf);
  }
  async navigateBrowserSurface(payload: { surfaceId: string; url: string }) {
    const surf = this.browserSurfaces.get(payload.surfaceId);
    if (!surf) throw new Error("browser_not_found");
    surf.url = payload.url;
    return structuredClone(surf);
  }
  async controlBrowserSurface(payload: { surfaceId: string; action: any; value?: number }) {
    const surf = this.browserSurfaces.get(payload.surfaceId);
    if (!surf) throw new Error("browser_not_found");
    if (payload.action === "zoom" && payload.value) surf.zoomFactor = payload.value;
    return structuredClone(surf);
  }
  async updateBrowserSurfacePresentation(_payload: { surfaceId: string; presentation: unknown }): Promise<void> {}
  async closeBrowserSurface(surfaceId: string): Promise<void> { this.browserSurfaces.delete(surfaceId); }

  // Notifications
  async notificationsSnapshot() { return structuredClone(this.notifications); }
  async notificationsPoll(_sinceRevision: number) { return structuredClone(this.notifications); }
  async notificationsReportAttention(_attention: unknown): Promise<NotificationSnapshot> { return structuredClone(this.notifications); }
  async notificationsMarkRead(recordId: string) {
    const rec = this.notifications.records.find(r => r.id === recordId);
    if (rec) rec.isRead = true;
    this.notifications.unreadCount = this.notifications.records.filter(r => !r.isRead).length;
    return structuredClone(this.notifications);
  }
  async notificationsMarkReviewed(_recordIds: string[]): Promise<NotificationSnapshot> { return structuredClone(this.notifications); }
  async notificationsMarkAllRead() {
    this.notifications.records.forEach(r => r.isRead = true);
    this.notifications.unreadCount = 0;
    return structuredClone(this.notifications);
  }
  async notificationsSetPreferences(_prefs: unknown): Promise<NotificationSnapshot> { return structuredClone(this.notifications); }
  async notificationsRequestAuthorization(): Promise<NotificationSnapshot> { return structuredClone(this.notifications); }
  async notificationsRefreshAuthorization(): Promise<NotificationSnapshot> { return structuredClone(this.notifications); }
  async notificationsOpenSystemSettings(): Promise<void> {}
  async notificationsPlaySample(): Promise<void> {}

  async windowAction(_action: any): Promise<void> {}
}
