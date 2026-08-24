import React, { useState } from "react";
import type {
  AgentProfile,
  WorkspaceProfile,
  WorkMode,
  SystemDestination,
  RouteKind,
  AppearanceTheme
} from "@/types";
import { Plus, ChevronRight, ChevronDown, Sun, Moon, Settings, FolderPlus, MessageSquare } from "lucide-react";

export interface SidebarProps {
  mode: WorkMode;
  route: RouteKind;
  agents: AgentProfile[];
  workspaces: WorkspaceProfile[];
  selectedAgentId: string | null;
  selectedWorkspaceId: string | null;
  appearance: AppearanceTheme;
  creditsLabel?: string;
  accountName?: string;
  accountTier?: string;
  onOpenDestination: (destination: SystemDestination) => void;
  onSelectAgent: (id: string) => void;
  onSelectWorkspace: (id: string) => void;
  onShowModeHome: () => void;
  onNewAgent: () => void;
  onAddWorkspace: () => void;
  onNewChat: () => void;
  onToggleAppearance: () => void;
  onOpenSettings: () => void;
}

const GLOBAL_DESTINATIONS: Array<{ id: SystemDestination; label: string }> = [
  { id: "dashboard", label: "Dashboard" },
  { id: "routines", label: "Routines" },
  { id: "plugins", label: "Plugins" },
  { id: "skills", label: "Skills" }
];

const MODE_HEADINGS: Record<WorkMode, string> = {
  agent: "Agents",
  code: "Workspaces",
  chat: "Chats"
};

const ENGINE_LABELS: Record<string, string> = {
  "claude-code": "Claude Code",
  "codex": "Codex",
  "cursor": "Cursor",
  "gemini": "Gemini CLI",
  "github-copilot": "GitHub Copilot",
  "droid": "Droid",
  "open-code": "OpenCode",
  "deep-seek": "DeepSeek",
  "grok": "Grok",
  "amp": "Amp",
  "antigravity": "Antigravity",
  "aider": "Aider"
};

export function Sidebar({
  mode,
  route,
  agents,
  workspaces,
  selectedAgentId,
  selectedWorkspaceId,
  appearance,
  creditsLabel = "12,500",
  accountName = "Builder",
  accountTier = "ULTRA",
  onOpenDestination,
  onSelectAgent,
  onSelectWorkspace,
  onShowModeHome,
  onNewAgent,
  onAddWorkspace,
  onNewChat,
  onToggleAppearance,
  onOpenSettings
}: SidebarProps) {
  const isDestSelected = (d: SystemDestination) =>
    route.kind === "destination" && route.destination === d;

  return (
    <aside className="sidebar" data-testid="sidebar">
      {/* 1. Global System Destinations */}
      <nav aria-label="Global navigation" className="sidebar__global">
        {GLOBAL_DESTINATIONS.map((dest) => (
          <button
            key={dest.id}
            aria-current={isDestSelected(dest.id) ? "page" : undefined}
            className={`sidebar-row sidebar-row--global ${isDestSelected(dest.id) ? "sidebar-row--selected" : ""}`}
            onClick={() => onOpenDestination(dest.id)}
            type="button"
          >
            {dest.label}
          </button>
        ))}
      </nav>

      <div className="sidebar__rule" />

      {/* 2. Primary Mode Section */}
      <section aria-labelledby="rail-heading" className="sidebar__primary">
        <div className="sidebar__section-heading">
          <button
            className="sidebar__heading-button"
            onClick={onShowModeHome}
            type="button"
          >
            <span id="rail-heading">{MODE_HEADINGS[mode]}</span>
          </button>

          {mode === "agent" && (
            <button
              aria-label="New agent"
              className="sidebar__add"
              onClick={onNewAgent}
              title="New agent"
              type="button"
            >
              <Plus size={17} aria-hidden="true" />
            </button>
          )}

          {mode === "code" && (
            <button
              aria-label="Add workspace"
              className="sidebar__add"
              onClick={onAddWorkspace}
              title="Add workspace"
              type="button"
            >
              <Plus size={17} aria-hidden="true" />
            </button>
          )}

          {mode === "chat" && (
            <button
              aria-label="New chat"
              className="sidebar__add"
              onClick={onNewChat}
              title="New chat"
              type="button"
            >
              <Plus size={17} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="sidebar__list">
          {/* Agent Mode List */}
          {mode === "agent" && (
            agents.length > 0 ? (
              agents.map((agent) => {
                const isSelected = route.kind === "agent" && selectedAgentId === agent.id;
                return (
                  <button
                    key={agent.id}
                    aria-current={isSelected ? "page" : undefined}
                    className={`entity-row ${isSelected ? "entity-row--selected" : ""}`}
                    onClick={() => onSelectAgent(agent.id)}
                    type="button"
                  >
                    <span className="entity-row__copy">
                      <strong>{agent.name}</strong>
                      <small>{ENGINE_LABELS[agent.engine] ?? agent.engine}</small>
                    </span>
                    <ChevronRight className="entity-row__chevron" size={13} aria-hidden="true" />
                  </button>
                );
              })
            ) : (
              <div className="sidebar-empty">
                <p>No agents yet.</p>
                <button onClick={onNewAgent} type="button">
                  <Plus size={13} aria-hidden="true" />
                  <span>New Agent</span>
                </button>
              </div>
            )
          )}

          {/* Code Mode List */}
          {mode === "code" && (
            workspaces.length > 0 ? (
              workspaces.map((ws) => {
                const isSelected = route.kind === "workspace" && selectedWorkspaceId === ws.id;
                return (
                  <div key={ws.id} className="workspace-branch">
                    <div className={`workspace-row ${isSelected ? "workspace-row--selected" : ""}`}>
                      <span aria-hidden="true" className="workspace-row__disclosure-spacer" />
                      <button
                        aria-current={isSelected ? "page" : undefined}
                        className="workspace-row__select"
                        onClick={() => onSelectWorkspace(ws.id)}
                        type="button"
                      >
                        <strong>{ws.displayName}</strong>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="sidebar-empty">
                <p>Add a folder or drop one here.</p>
                <button onClick={onAddWorkspace} type="button">
                  <FolderPlus size={13} aria-hidden="true" />
                  <span>Add folder</span>
                </button>
              </div>
            )
          )}

          {/* Chat Mode List */}
          {mode === "chat" && (
            <div className="sidebar-empty">
              <p>No chats yet. Start one and it lands here.</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Footer */}
      <footer className="sidebar__footer">
        <div className="sidebar__rule" />

        <div className="sidebar-footer-row">
          <span>Notch</span>
          <span className="sidebar-chip">Windows</span>
        </div>

        <div className="sidebar-footer-row">
          <span>Credits</span>
          <span className="sidebar-chip sidebar-chip--digits">{creditsLabel}</span>
        </div>

        <div className="account-row">
          <span aria-hidden="true" className="account-row__avatar">
            {accountName.charAt(0).toUpperCase()}
          </span>
          <span className="account-row__copy">
            <strong>{accountName}</strong>
            <small>{accountTier}</small>
          </span>

          <button
            aria-label={`Use ${appearance === "dark" ? "light" : "dark"} theme`}
            className="chrome-button"
            onClick={onToggleAppearance}
            title={`Use ${appearance === "dark" ? "light" : "dark"} theme`}
            type="button"
          >
            {appearance === "dark" ? <Moon size={15} aria-hidden="true" /> : <Sun size={15} aria-hidden="true" />}
          </button>

          <button
            aria-label="Settings"
            className="chrome-button"
            onClick={onOpenSettings}
            title="Settings"
            type="button"
          >
            <Settings size={15} aria-hidden="true" />
          </button>
        </div>
      </footer>
    </aside>
  );
}
