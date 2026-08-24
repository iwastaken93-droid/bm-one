import React, { useState } from "react";
import type { AgentEngine } from "@/types";
import { getAgentLogoUrl } from "@/utils/logos";
import { X, Bot, Check } from "lucide-react";

export interface AgentEditorModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (agent: { name: string; engine: AgentEngine; purpose: string }) => Promise<void>;
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

export function AgentEditorModal({ open, onClose, onCreate }: AgentEditorModalProps) {
  const [selectedEngine, setSelectedEngine] = useState<AgentEngine>("claude-code");
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    await onCreate({
      name: name.trim(),
      engine: selectedEngine,
      purpose: purpose.trim()
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <section aria-labelledby="agent-editor-title" className="pane agent-editor">
      <header className="pane-titlebar pane-titlebar--large">
        <span aria-hidden="true" className="pane-titlebar__icon">
          <Bot size={14} />
        </span>
        <span className="pane-titlebar__copy">
          <strong id="agent-editor-title">New Agent</strong>
          <small>A teammate you hand real work to. Name it, say what it’s for, pick the engine.</small>
        </span>
        <button
          aria-label="Cancel agent creation"
          className="chrome-button"
          onClick={onClose}
          title="Cancel (Esc)"
          type="button"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </header>

      <form className="agent-editor__form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="agent-name">Name</label>
          <input
            id="agent-name"
            maxLength={80}
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="X content expert"
            value={name}
            required
            autoFocus
          />
        </div>

        <fieldset className="form-field">
          <legend>Powered by</legend>
          <p className="form-field__hint">
            The engine that does the work. It decides how tasks execute, not what this agent is for.
          </p>

          <div className="engine-grid">
            {ENGINE_OPTIONS.map((engine) => {
              const isSelected = selectedEngine === engine.id;
              const logoUrl = getAgentLogoUrl(engine.id);
              return (
                <button
                  key={engine.id}
                  aria-pressed={isSelected}
                  className={`engine-chip ${isSelected ? "engine-chip--selected" : ""}`}
                  onClick={() => {
                    setSelectedEngine(engine.id);
                    if (!name) setName(engine.name);
                  }}
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
                    <strong>{engine.name}</strong>
                    <small>{engine.tagline}</small>
                  </span>
                  {isSelected && (
                    <Check size={12} aria-hidden="true" className="engine-chip__check" />
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="form-field">
          <label htmlFor="agent-purpose">Brief</label>
          <p className="form-field__hint">
            Optional, and worth writing. It leads the briefing on every turn; the agent learns the rest.
          </p>
          <textarea
            id="agent-purpose"
            maxLength={4000}
            onChange={(e) => setPurpose(e.currentTarget.value)}
            placeholder="You write and schedule posts for our X account. Keep the brand voice: builders, ship, vibe coding…"
            rows={6}
            value={purpose}
          />
        </div>

        <footer className="agent-editor__footer">
          <p>Only chat-capable engines carry memory and skills. You can change the engine later.</p>
          <button className="secondary-button" onClick={onClose} type="button">
            Cancel
          </button>
          <button
            className="primary-button"
            disabled={submitting || !name.trim()}
            type="submit"
          >
            {submitting ? "Creating…" : "Create Agent"}
          </button>
        </footer>
      </form>
    </section>
  );
}
