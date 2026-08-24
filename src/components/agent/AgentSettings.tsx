import React, { useState } from "react";
import type { AgentProfile, AgentEngine } from "@/types";
import { getAgentLogoUrl } from "@/utils/logos";
import { Check } from "lucide-react";

export interface AgentSettingsProps {
  agent: AgentProfile;
  loading: boolean;
  onUpdate: (updated: AgentProfile) => Promise<void>;
  onDelete: (id: string) => void;
}

const ENGINE_OPTIONS: Array<{ id: AgentEngine; name: string; tagline: string }> = [
  { id: "claude-code", name: "Claude Code", tagline: "Autonomous coding agent" },
  { id: "codex", name: "Codex CLI", tagline: "Fast command-line edits" },
  { id: "cursor", name: "Cursor Agent", tagline: "Multi-file project refactors" },
  { id: "gemini", name: "Gemini CLI", tagline: "Long-context reasoning" },
  { id: "github-copilot", name: "GitHub Copilot", tagline: "Workspace context integration" },
  { id: "droid", name: "Droid", tagline: "Cross-platform automation" },
  { id: "open-code", name: "OpenCode", tagline: "Open-source local model harness" },
  { id: "deep-seek", name: "DeepSeek", tagline: "Mathematical reasoning" },
  { id: "grok", name: "Grok Build", tagline: "Creative coding assistant" },
  { id: "amp", name: "Amp", tagline: "High-throughput parallel tasks" },
  { id: "antigravity", name: "Antigravity", tagline: "Large system architecture" },
  { id: "aider", name: "Aider", tagline: "Git-paired pair programming" }
];

export function AgentSettings({ agent, loading, onUpdate, onDelete }: AgentSettingsProps) {
  const [name, setName] = useState(agent.name);
  const [engine, setEngine] = useState<AgentEngine>(agent.engine);
  const [purpose, setPurpose] = useState(agent.purpose);
  const [effort, setEffort] = useState<"low" | "medium" | "high">("high");
  const [mode, setMode] = useState<"auto" | "full" | "readonly">("auto");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onUpdate({ ...agent, name, engine, purpose });
    setSaving(false);
  };

  return (
    <div className="agent-face agent-settings agent-settings--profile">
      <div className="agent-settings__scroll">
        <form className="agent-settings__column" onSubmit={handleSave}>
          <section className="agent-setting-group">
            <label className="agent-setting-label" htmlFor="agent-settings-name">
              Name
            </label>
            <input
              id="agent-settings-name"
              maxLength={80}
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </section>

          <section className="agent-setting-group">
            <label className="agent-setting-label">Engine</label>
            <div className="engine-grid">
              {ENGINE_OPTIONS.map((opt) => {
                const isSelected = engine === opt.id;
                const logoUrl = getAgentLogoUrl(opt.id);
                return (
                  <button
                    key={opt.id}
                    aria-pressed={isSelected}
                    className={`engine-chip ${isSelected ? "engine-chip--selected" : ""}`}
                    onClick={() => setEngine(opt.id)}
                    type="button"
                  >
                    <span aria-hidden="true" className="engine-mark">
                      <img
                        src={logoUrl}
                        alt=""
                        style={{ width: 14, height: 14, objectFit: "contain", display: "block" }}
                      />
                    </span>
                    <span className="engine-chip__copy">
                      <strong>{opt.name}</strong>
                      <small>{opt.tagline}</small>
                    </span>
                    {isSelected && (
                      <Check size={12} aria-hidden="true" className="engine-chip__check" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="agent-setting-group">
            <label className="agent-setting-label" htmlFor="agent-settings-brief">
              Brief
            </label>
            <p className="agent-setting-hint">
              The agent reads this on every turn; the agent learns the rest.
            </p>
            <textarea
              id="agent-settings-brief"
              maxLength={4000}
              onChange={(e) => setPurpose(e.target.value)}
              rows={6}
              value={purpose}
            />
          </section>

          <section className="agent-setting-group">
            <label className="agent-setting-label">Reasoning effort</label>
            <div className="setting-pills">
              {(["low", "medium", "high"] as const).map((lvl) => (
                <button
                  key={lvl}
                  className={`setting-pill ${effort === lvl ? "setting-pill--selected" : ""}`}
                  onClick={() => setEffort(lvl)}
                  type="button"
                >
                  {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                </button>
              ))}
            </div>
          </section>

          <section className="agent-setting-group">
            <label className="agent-setting-label">Mode</label>
            <div className="setting-pills">
              <button
                className={`setting-pill ${mode === "auto" ? "setting-pill--selected" : ""}`}
                onClick={() => setMode("auto")}
                type="button"
              >
                Auto-accept edits
              </button>
              <button
                className={`setting-pill ${mode === "full" ? "setting-pill--selected" : ""}`}
                onClick={() => setMode("full")}
                type="button"
              >
                Full access
              </button>
              <button
                className={`setting-pill ${mode === "readonly" ? "setting-pill--selected" : ""}`}
                onClick={() => setMode("readonly")}
                type="button"
              >
                Read-only
              </button>
            </div>
          </section>

          <footer className="agent-settings__footer">
            <button
              className="primary-button"
              disabled={saving || loading}
              type="submit"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              className="secondary-button secondary-button--danger"
              disabled={saving || loading}
              onClick={() => onDelete(agent.id)}
              type="button"
            >
              Delete Agent
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
