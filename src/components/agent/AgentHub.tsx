import React from "react";
import type { AgentProfile, AgentFace, AgentMind, AgentSkill } from "@/types";
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

  return (
    <section className="pane agent-pane">
      <header className="pane-titlebar pane-titlebar--large">
        <div className="agent-pane__identity">
          <img
            src={`/output/assets/logos/agent-${agent.engine}-onDark.png`}
            alt=""
            className="agent-pane__logo"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `/output/assets/logos/agent-${agent.engine}.png`;
            }}
          />
          <div className="agent-pane__copy">
            <strong>{agent.name}</strong>
            <small>Powered by {agent.engine}</small>
          </div>
        </div>

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
            <h3>No Active Agent Threads</h3>
            <p>Start a conversation in Chat mode or Code Workspace to engage this agent.</p>
          </div>
        )}
      </main>
    </section>
  );
}
