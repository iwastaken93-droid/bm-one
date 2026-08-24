import React from "react";
import type { AgentProfile, AgentFace, AgentMind, AgentSkill } from "@/types";
import { getAgentLogoUrl } from "@/utils/logos";
import { AgentMemoryEditor } from "./AgentMemoryEditor";
import { AgentSkillsCatalog } from "./AgentSkillsCatalog";
import { AgentSettings } from "./AgentSettings";
import { Bot, Plus, MessageSquare, Brain, Wrench, Settings } from "lucide-react";

export interface AgentHubProps {
  agent: AgentProfile | null;
  face: AgentFace;
  mind: AgentMind | null;
  mindLoading: boolean;
  onFaceChange: (face: AgentFace) => void;
  onNewAgent: () => void;
  onSaveMemory: (memory: string, user?: string) => Promise<void>;
  onInstallSkill: (skill: AgentSkill) => Promise<void>;
  onRemoveSkill: (skillId: string) => Promise<void>;
  onUpdateAgent: (agent: AgentProfile) => Promise<void>;
  onDeleteAgent: (id: string) => void;
}

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

export function AgentHub({
  agent,
  face,
  mind,
  mindLoading,
  onFaceChange,
  onNewAgent,
  onSaveMemory,
  onInstallSkill,
  onRemoveSkill,
  onUpdateAgent,
  onDeleteAgent
}: AgentHubProps) {
  if (!agent) {
    return (
      <section className="pane empty-surface">
        <div aria-hidden="true" className="empty-surface__icon">
          <Bot size={26} strokeWidth={1.4} />
        </div>
        <h1>No agents yet</h1>
        <p>Create a named teammate, choose what powers it, then hand it real work.</p>
        <button className="primary-button" onClick={onNewAgent} type="button">
          <Plus size={14} aria-hidden="true" />
          <span>New Agent</span>
        </button>
      </section>
    );
  }

  const logoUrl = getAgentLogoUrl(agent.engine);
  const engineName = ENGINE_LABELS[agent.engine] ?? agent.engine;

  return (
    <section className="pane agent-pane">
      <header className="pane-titlebar pane-titlebar--large">
        <span aria-hidden="true" className="pane-titlebar__icon">
          <img
            src={logoUrl}
            alt=""
            style={{ width: 16, height: 16, objectFit: "contain", display: "block" }}
          />
        </span>
        <span className="pane-titlebar__copy">
          <strong>{agent.name}</strong>
          <small>Powered by {engineName}</small>
        </span>

        <nav aria-label="Agent section switcher" className="agent-face-toggle">
          <button
            aria-pressed={face === "chats"}
            className={`agent-face-toggle__item ${face === "chats" ? "agent-face-toggle__item--selected" : ""}`}
            onClick={() => onFaceChange("chats")}
            type="button"
          >
            <MessageSquare size={13} aria-hidden="true" />
            <span>Threads</span>
          </button>
          <button
            aria-pressed={face === "memory"}
            className={`agent-face-toggle__item ${face === "memory" ? "agent-face-toggle__item--selected" : ""}`}
            onClick={() => onFaceChange("memory")}
            type="button"
          >
            <Brain size={13} aria-hidden="true" />
            <span>Memory</span>
          </button>
          <button
            aria-pressed={face === "skills"}
            className={`agent-face-toggle__item ${face === "skills" ? "agent-face-toggle__item--selected" : ""}`}
            onClick={() => onFaceChange("skills")}
            type="button"
          >
            <Wrench size={13} aria-hidden="true" />
            <span>Skills</span>
          </button>
          <button
            aria-pressed={face === "settings"}
            className={`agent-face-toggle__item ${face === "settings" ? "agent-face-toggle__item--selected" : ""}`}
            onClick={() => onFaceChange("settings")}
            type="button"
          >
            <Settings size={13} aria-hidden="true" />
            <span>Settings</span>
          </button>
        </nav>
      </header>

      <div className="agent-pane__rule" />

      <main className="agent-pane__body">
        {face === "memory" && (
          <AgentMemoryEditor mind={mind} loading={mindLoading} onSave={onSaveMemory} />
        )}
        {face === "skills" && (
          <AgentSkillsCatalog
            skills={mind?.skills ?? []}
            loading={mindLoading}
            onInstallSkill={onInstallSkill}
            onRemoveSkill={onRemoveSkill}
          />
        )}
        {face === "settings" && (
          <AgentSettings
            agent={agent}
            loading={mindLoading}
            onUpdate={onUpdateAgent}
            onDelete={onDeleteAgent}
          />
        )}
        {face === "chats" && (
          <div className="empty-surface empty-surface--embedded">
            <h3 className="empty-surface__title">No Active Agent Threads</h3>
            <p className="empty-surface__detail">
              Start a conversation in Chat mode or Code Workspace to engage this agent.
            </p>
          </div>
        )}
      </main>
    </section>
  );
}
