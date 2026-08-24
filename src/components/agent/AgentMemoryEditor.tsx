import React, { useState, useEffect } from "react";
import type { AgentMind } from "@/types";

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

  const isDirty = memory !== (mind?.memory ?? "") || user !== (mind?.user ?? "");

  return (
    <div className="agent-face agent-memory">
      <div className="agent-memory__scroll">
        <div className="agent-memory__column">
          <section className="agent-memory__block">
            <header className="agent-memory__block-head">
              <h3 className="agent-memory__title">Notes</h3>
              <p className="agent-memory__hint">
                The agent reads and updates this as it works. You can edit directly.
              </p>
            </header>
            <textarea
              className="agent-memory__textarea"
              value={memory}
              onChange={(e) => setMemory(e.target.value)}
              placeholder="Guidelines, project rules, conventions, and learnings the agent retains…"
              rows={8}
            />
          </section>

          <section className="agent-memory__block">
            <header className="agent-memory__block-head">
              <h3 className="agent-memory__title">Who you are</h3>
              <p className="agent-memory__hint">
                Persistent context about your preferences, background, or conventions.
              </p>
            </header>
            <textarea
              className="agent-memory__textarea"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Information about your role, environment, and preferred tools…"
              rows={4}
            />
          </section>

          <footer className="agent-memory__footer">
            <button
              className="primary-button"
              disabled={saving || loading || !isDirty}
              onClick={handleSave}
              type="button"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
