import { useReducer, useEffect, useCallback } from "react";
import type {
  ShellPreferences,
  AgentProfile,
  WorkspaceProfile,
  WorkMode,
  SystemDestination,
  AppearanceTheme,
  AgentFace,
  RouteKind
} from "@/types";
import { getService } from "@/services";

export interface ShellState {
  phase: "loading" | "ready" | "error";
  fatalError: string | null;
  preferences: ShellPreferences;
  agents: AgentProfile[];
  workspaces: WorkspaceProfile[];
  recoveryNotices: Array<{ code: string; message: string }>;
  persistenceReadOnly: boolean;
  persistenceWarning: string | null;
  operationError: string | null;
  pendingOperation: string | null;
  agentEditorOpen: boolean;
  agentFace: AgentFace;
}

export type ShellAction =
  | { type: "bootstrapStarted" }
  | { type: "bootstrapSucceeded"; payload: { preferences: ShellPreferences; agents: AgentProfile[]; workspaces: WorkspaceProfile[]; recoveryNotices: Array<{ code: string; message: string }>; persistenceReadOnly: boolean } }
  | { type: "bootstrapFailed"; message: string }
  | { type: "setMode"; mode: WorkMode }
  | { type: "openDestination"; destination: SystemDestination }
  | { type: "showModeHome" }
  | { type: "toggleSidebar" }
  | { type: "setAppearance"; appearance: AppearanceTheme }
  | { type: "setZoom"; zoomPercent: number }
  | { type: "stepZoom"; direction: "in" | "out" }
  | { type: "dismissRecovery"; code: string }
  | { type: "openAgentEditor" }
  | { type: "closeAgentEditor" }
  | { type: "createAgentStarted" }
  | { type: "createAgentSucceeded"; agent: AgentProfile }
  | { type: "agentProfileUpdated"; agent: AgentProfile }
  | { type: "deleteAgentStarted"; agentId: string }
  | { type: "deleteAgentCancelled" }
  | { type: "deleteAgentSucceeded"; agentId: string }
  | { type: "agentRosterReloaded"; agents: AgentProfile[] }
  | { type: "addWorkspaceStarted" }
  | { type: "addWorkspaceCancelled" }
  | { type: "addWorkspaceSucceeded"; workspace: WorkspaceProfile }
  | { type: "selectWorkspace"; id: string }
  | { type: "selectAgent"; id: string }
  | { type: "setAgentFace"; face: AgentFace }
  | { type: "persistenceFailed"; message: string }
  | { type: "persistenceRecovered" }
  | { type: "operationFailed"; error: string };

function getDefaultRouteForMode(mode: WorkMode): RouteKind {
  switch (mode) {
    case "agent": return { kind: "agent" };
    case "code": return { kind: "workspace" };
    case "chat": return { kind: "chat" };
  }
}

export function shellReducer(state: ShellState, action: ShellAction): ShellState {
  switch (action.type) {
    case "bootstrapStarted":
      return { ...state, phase: "loading", fatalError: null };

    case "bootstrapSucceeded":
      return {
        ...state,
        phase: "ready",
        preferences: action.payload.preferences,
        agents: action.payload.agents,
        workspaces: action.payload.workspaces,
        recoveryNotices: action.payload.recoveryNotices,
        persistenceReadOnly: action.payload.persistenceReadOnly,
        fatalError: null
      };

    case "bootstrapFailed":
      return { ...state, phase: "error", fatalError: action.message };

    case "setMode":
      return {
        ...state,
        agentEditorOpen: false,
        preferences: {
          ...state.preferences,
          workMode: action.mode,
          route: getDefaultRouteForMode(action.mode)
        }
      };

    case "openDestination":
      return {
        ...state,
        agentEditorOpen: false,
        preferences: {
          ...state.preferences,
          route: { kind: "destination", destination: action.destination }
        }
      };

    case "showModeHome":
      return {
        ...state,
        agentEditorOpen: false,
        preferences: {
          ...state.preferences,
          route: getDefaultRouteForMode(state.preferences.workMode)
        }
      };

    case "toggleSidebar":
      return {
        ...state,
        preferences: {
          ...state.preferences,
          sidebarVisible: !state.preferences.sidebarVisible
        }
      };

    case "setAppearance":
      return {
        ...state,
        preferences: {
          ...state.preferences,
          appearance: action.appearance
        }
      };

    case "setZoom":
      return {
        ...state,
        preferences: {
          ...state.preferences,
          zoomPercent: Math.min(200, Math.max(60, Math.round(action.zoomPercent)))
        }
      };

    case "stepZoom": {
      const step = action.direction === "in" ? 10 : -10;
      const nextZoom = Math.min(200, Math.max(60, state.preferences.zoomPercent + step));
      return {
        ...state,
        preferences: {
          ...state.preferences,
          zoomPercent: nextZoom
        }
      };
    }

    case "dismissRecovery":
      return {
        ...state,
        recoveryNotices: state.recoveryNotices.filter(n => n.code !== action.code)
      };

    case "openAgentEditor":
      return { ...state, agentEditorOpen: true };

    case "closeAgentEditor":
      return { ...state, agentEditorOpen: false };

    case "createAgentStarted":
      return { ...state, pendingOperation: "createAgent", operationError: null };

    case "createAgentSucceeded":
      return {
        ...state,
        agents: [...state.agents, action.agent],
        pendingOperation: null,
        operationError: null,
        agentEditorOpen: false,
        agentFace: "chats",
        preferences: {
          ...state.preferences,
          workMode: "agent",
          route: { kind: "agent" },
          selectedAgentId: action.agent.id
        }
      };

    case "agentProfileUpdated":
      return {
        ...state,
        agents: state.agents.map(a => (a.id === action.agent.id ? action.agent : a))
      };

    case "deleteAgentStarted":
      return { ...state, pendingOperation: "deleteAgent", operationError: null };

    case "deleteAgentCancelled":
      return { ...state, pendingOperation: null, operationError: null };

    case "deleteAgentSucceeded": {
      const remaining = state.agents.filter(a => a.id !== action.agentId);
      const nextId = remaining[0]?.id ?? null;
      return {
        ...state,
        agents: remaining,
        pendingOperation: null,
        operationError: null,
        preferences: {
          ...state.preferences,
          selectedAgentId: nextId
        }
      };
    }

    case "agentRosterReloaded":
      return { ...state, agents: action.agents };

    case "addWorkspaceStarted":
      return { ...state, pendingOperation: "addWorkspace", operationError: null };

    case "addWorkspaceCancelled":
      return { ...state, pendingOperation: null };

    case "addWorkspaceSucceeded":
      return {
        ...state,
        workspaces: [...state.workspaces, action.workspace],
        pendingOperation: null,
        operationError: null,
        preferences: {
          ...state.preferences,
          workMode: "code",
          route: { kind: "workspace" },
          selectedWorkspaceId: action.workspace.id
        }
      };

    case "selectWorkspace":
      return {
        ...state,
        preferences: {
          ...state.preferences,
          workMode: "code",
          route: { kind: "workspace" },
          selectedWorkspaceId: action.id
        }
      };

    case "selectAgent":
      return {
        ...state,
        agentEditorOpen: false,
        preferences: {
          ...state.preferences,
          workMode: "agent",
          route: { kind: "agent" },
          selectedAgentId: action.id
        }
      };

    case "setAgentFace":
      return { ...state, agentFace: action.face };

    case "persistenceFailed":
      return { ...state, persistenceWarning: action.message };

    case "persistenceRecovered":
      return { ...state, persistenceWarning: null };

    case "operationFailed":
      return { ...state, operationError: action.error, pendingOperation: null };

    default:
      return state;
  }
}

const INITIAL_STATE: ShellState = {
  phase: "loading",
  fatalError: null,
  preferences: {
    schemaVersion: 1,
    workMode: "agent",
    route: { kind: "agent" },
    selectedWorkspaceId: null,
    selectedAgentId: null,
    sidebarVisible: true,
    appearance: "dark",
    zoomPercent: 100
  },
  agents: [],
  workspaces: [],
  recoveryNotices: [],
  persistenceReadOnly: false,
  persistenceWarning: null,
  operationError: null,
  pendingOperation: null,
  agentEditorOpen: false,
  agentFace: "chats"
};

export function usePreferences() {
  const [state, dispatch] = useReducer(shellReducer, INITIAL_STATE);
  const service = getService();

  const bootstrap = useCallback(async () => {
    dispatch({ type: "bootstrapStarted" });
    try {
      const payload = await service.bootstrap();
      dispatch({ type: "bootstrapSucceeded", payload });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Workspace restoration failed.";
      dispatch({ type: "bootstrapFailed", message });
    }
  }, [service]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  // Sync theme attribute on <html> element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.preferences.appearance);
  }, [state.preferences.appearance]);

  return { state, dispatch };
}
