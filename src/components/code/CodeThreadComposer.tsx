import React, { useState } from "react";
import type { CodeProvider, CodeExecutionMode } from "@/types";
import { Send, Square, Sparkles } from "lucide-react";

export interface CodeThreadComposerProps {
  status: "idle" | "running" | "waiting" | "error";
  provider: CodeProvider;
  mode: CodeExecutionMode;
  onProviderChange: (provider: CodeProvider) => void;
  onModeChange: (mode: CodeExecutionMode) => void;
  onSubmit: (prompt: string) => Promise<void>;
  onStop: () => void;
}

export function CodeThreadComposer({
  status,
  provider,
  mode,
  onProviderChange,
  onModeChange,
  onSubmit,
  onStop
}: CodeThreadComposerProps) {
  const [prompt, setPrompt] = useState("");
  const isRunning = status === "running" || status === "waiting";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isRunning) return;
    const text = prompt.trim();
    setPrompt("");
    await onSubmit(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="code-thread-composer" onSubmit={handleSubmit}>
      <textarea
        className="code-thread-composer__input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask the coding agent to refactor, debug, or implement features…"
        rows={3}
        disabled={isRunning}
      />

      <footer className="code-thread-composer__footer">
        <div className="code-thread-composer__controls">
          <select
            value={provider}
            onChange={(e) => onProviderChange(e.target.value as CodeProvider)}
            disabled={isRunning}
          >
            <option value="claude">Claude Code Engine</option>
            <option value="codex">Codex Driver</option>
          </select>

          <select
            value={mode}
            onChange={(e) => onModeChange(e.target.value as CodeExecutionMode)}
            disabled={isRunning}
          >
            <option value="fullAccess">Full Access</option>
            <option value="acceptEdits">Auto-Accept Edits</option>
            <option value="readOnly">Read-Only</option>
          </select>
        </div>

        <div className="code-thread-composer__actions">
          {isRunning ? (
            <button
              className="secondary-button code-thread-composer__stop"
              onClick={onStop}
              type="button"
            >
              <Square size={13} />
              Stop
            </button>
          ) : (
            <button
              className="primary-button"
              disabled={!prompt.trim()}
              type="submit"
            >
              <Send size={13} />
              Run Task
            </button>
          )}
        </div>
      </footer>
    </form>
  );
}
