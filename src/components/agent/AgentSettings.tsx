import React, { useState } from "react";
import type { AgentProfile, AgentEngine } from "@/types";
import { Save, Trash2, Shield, Cpu } from "lucide-react";

export interface AgentSettingsProps {
  agent: AgentProfile;
  loading: boolean;
  onUpdate: (updated: AgentProfile) => Promise<void>;
  onDelete: (id: string) => void;
}

const ENGINES: Array<{ id: AgentEngine; label: string }> = [
  { id: "claude-code", label: "Anthropic Claude Code" },
  { id: "codex", label: "Codex CLI" },
  { id: "cursor", label: "Cursor Agent" },
  { id: "gemini", label: "Google Gemini CLI" },
  { id: "github-copilot", label: "GitHub Copilot" },
  { id: "droid", label: "Droid" },
  { id: "open-code", label: "OpenCode" },
  { id: "deep-seek", label: "DeepSeek Harness" },
  { id: "grok", label: "xAI Grok Build" },
  { id: "amp", label: "Amp" },
  { id: "antigravity", label: "Antigravity" },
  { id: "aider", label: "Aider" },
  { id: "terminal", label: "Standard PTY Terminal" }
];

export function AgentSettings({ agent, loading, onUpdate, onDelete }: AgentSettingsProps) {
  const [name, setName] = useState(agent.name);
  const [engine, setEngine] = useState<AgentEngine>(agent.engine);
  const [purpose, setPurpose] = useState(agent.purpose);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onUpdate({
      ...agent,
      name,
      engine,
      purpose
    });
    setSaving(false);
  };

  return (
    <form className="agent-settings" onSubmit={handleSave}>
      <div className="form-field">
        <label>Agent Display Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={80}
        />
      </div>

      <div className="form-field">
        <label>
          <Cpu size={13} style={{ display: "inline", marginRight: 6 }} />
          Underlying Engine / Driver
        </label>
        <select value={engine} onChange={(e) => setEngine(e.target.value as AgentEngine)}>
          {ENGINES.map((eng) => (
            <option key={eng.id} value={eng.id}>
              {eng.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>System Purpose / Directives</label>
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          rows={5}
          maxLength={4000}
          placeholder="Specific responsibilities, scope boundaries, or architectural directives…"
        />
      </div>

      <div className="form-field">
        <label>
          <Shield size={13} style={{ display: "inline", marginRight: 6 }} />
          Execution Permission Boundary
        </label>
        <div className="agent-settings__permissions">
          <label className="radio-label">
            <input type="radio" name="perm" defaultChecked />
            <span>Full Workspace Access (Read, Write, Terminal PTY Execution)</span>
          </label>
          <label className="radio-label">
            <input type="radio" name="perm" />
            <span>Auto-Accept File Edits (Terminal prompts require approval)</span>
          </label>
          <label className="radio-label">
            <input type="radio" name="perm" />
            <span>Read-Only Research (No file modifications permitted)</span>
          </label>
        </div>
      </div>

      <div className="agent-settings__footer">
        <button className="primary-button" disabled={saving || loading} type="submit">
          <Save size={14} />
          {saving ? "Saving…" : "Save Changes"}
        </button>

        <button
          className="secondary-button secondary-button--danger"
          disabled={saving || loading}
          onClick={() => onDelete(agent.id)}
          type="button"
        >
          <Trash2 size={14} />
          Delete Agent
        </button>
      </div>
    </form>
  );
}
