import React, { useState, useEffect } from "react";
import type { AgentMind } from "@/types";
import { Save, User, Brain } from "lucide-react";

export interface AgentMemoryEditorProps {
  mind: AgentMind | null;
  loading: boolean;
  onSave: (memory: string, user?: string) => Promise<void>;
}

export function AgentMemoryEditor({ mind, loading, onSave }: AgentMemoryEditorProps) {
  const [memory, setMemory] = useState(mind?.memory ?? "");
  const [user, setUser] = useState(mind?.user ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mind) {
      setMemory(mind.memory);
      setUser(mind.user);
    }
  }, [mind]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(memory, user);
    setSaving(false);
  };

  if (loading && !mind) {
    return <div className="agent-pane__loading">Loading agent mind…</div>;
  }

  return (
    <div className="agent-memory">
      <div className="agent-memory__section">
        <div className="agent-memory__header">
          <Brain size={16} />
          <h3>Agent Working Memory</h3>
        </div>
        <p className="agent-memory__hint">
          Persistent context, rules, coding guidelines, and knowledge retained across all threads.
        </p>
        <textarea
          className="agent-memory__textarea"
          value={memory}
          onChange={(e) => setMemory(e.target.value)}
          placeholder="E.g. Prefers functional programming, React hooks, strict TypeScript interfaces…"
          rows={10}
        />
      </div>

      <div className="agent-memory__section">
        <div className="agent-memory__header">
          <User size={16} />
          <h3>User Profile & Project Role</h3>
        </div>
        <p className="agent-memory__hint">
          Information about your role, environment, and preferences.
        </p>
        <textarea
          className="agent-memory__textarea"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="E.g. Senior Full-Stack Engineer working on Windows 11 and Rust/React."
          rows={4}
        />
      </div>

      <div className="agent-memory__footer">
        <button
          className="primary-button"
          disabled={saving || loading}
          onClick={handleSave}
          type="button"
        >
          <Save size={14} />
          {saving ? "Saving…" : "Save Memory"}
        </button>
      </div>
    </div>
  );
}
