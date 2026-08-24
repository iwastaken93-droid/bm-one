import React, { useState } from "react";
import type { AgentMind } from "@/types";
import { Edit3 } from "lucide-react";

export interface AgentMemoryEditorProps {
  mind: AgentMind | null;
  loading: boolean;
  onSave: (memory: string, user?: string) => Promise<void>;
}

export function AgentMemoryEditor({ mind, loading, onSave }: AgentMemoryEditorProps) {
  const [room, setRoom] = useState<"memory" | "user">("memory");
  const [rawMode, setRawMode] = useState(false);
  const [entryText, setEntryText] = useState("");
  const [rawText, setRawText] = useState(mind?.memory ?? "");

  const activeContent = room === "memory" ? (mind?.memory ?? "") : (mind?.user ?? "");

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryText.trim()) return;
    const newline = entryText.trim();
    const updated = activeContent ? `${activeContent}\n- ${newline}` : `- ${newline}`;
    setEntryText("");
    if (room === "memory") {
      await onSave(updated, mind?.user);
    } else {
      await onSave(mind?.memory ?? "", updated);
    }
  };

  const handleSaveRaw = async () => {
    if (room === "memory") {
      await onSave(rawText, mind?.user);
    } else {
      await onSave(mind?.memory ?? "", rawText);
    }
    setRawMode(false);
  };

  if (rawMode) {
    return (
      <div className="agent-face agent-memory agent-memory--raw">
        <header className="agent-memory__raw-toolbar">
          <strong>{room === "memory" ? "Editing notes" : "Editing who you are"}</strong>
          <span>Raw builder edit bypasses the character cap, but remains revision-checked.</span>
          <button className="secondary-button" onClick={() => setRawMode(false)} type="button">
            Cancel
          </button>
          <button className="primary-button" onClick={handleSaveRaw} type="button">
            Save raw file
          </button>
        </header>

        <textarea
          className="agent-memory__raw-textarea"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={14}
        />
      </div>
    );
  }

  const lines = activeContent
    ? activeContent.split("\n").filter(l => l.trim().length > 0)
    : [];

  return (
    <div className="agent-face agent-memory agent-memory--ledger">
      <header className="agent-memory__ledger-header">
        <div>
          <div aria-label="Memory room" className="agent-memory__rooms" role="tablist">
            <button
              aria-selected={room === "memory"}
              onClick={() => { setRoom("memory"); setRawText(mind?.memory ?? ""); }}
              role="tab"
              type="button"
            >
              Notes
            </button>
            <button
              aria-selected={room === "user"}
              onClick={() => { setRoom("user"); setRawText(mind?.user ?? ""); }}
              role="tab"
              type="button"
            >
              Who you are
            </button>
          </div>
          <p className="agent-memory__ledger-hint">
            {room === "memory"
              ? "What this agent carries between chats."
              : "What this agent should already know about you."}
          </p>
        </div>

        <div className="agent-memory__ledger-actions">
          <button
            className="secondary-button"
            onClick={() => { setRawText(activeContent); setRawMode(true); }}
            type="button"
          >
            <Edit3 size={12} style={{ display: "inline", marginRight: 4 }} />
            Edit raw notes
          </button>
        </div>
      </header>

      <div className="agent-memory__body">
        {lines.length === 0 ? (
          <div className="memory-empty">
            <p>
              {room === "memory"
                ? "This agent hasn’t saved anything yet. Add a convention, a decision and why."
                : "This agent doesn’t know anything about you yet. Preferences, names, how you like work."}
            </p>
          </div>
        ) : (
          <div className="memory-table">
            {lines.map((line, idx) => (
              <div key={idx} className="memory-row">
                <div className="memory-row__copy">
                  <span>{line.replace(/^-\s*/, "")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form className="memory-composer" onSubmit={handleAddEntry}>
        <input
          type="text"
          value={entryText}
          onChange={(e) => setEntryText(e.target.value)}
          placeholder="Add a memory entry…"
        />
        <button className="primary-button" disabled={loading || !entryText.trim()} type="submit">
          Add
        </button>
      </form>
    </div>
  );
}
