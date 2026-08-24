import React, { useState } from "react";
import type { ChatThread } from "@/types";
import { ArrowUp, Square, Wrench, Shield, Cpu, Sparkles } from "lucide-react";

export interface GeneralChatViewProps {
  thread: ChatThread | null;
  loading: boolean;
  onSend: (prompt: string) => Promise<void>;
  onCancel: () => void;
  onNewChat: () => void;
}

export function GeneralChatView({ thread, loading, onSend, onCancel }: GeneralChatViewProps) {
  const [prompt, setPrompt] = useState("");
  const isRunning = thread?.status === "running";
  const items = thread?.items ?? [];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isRunning) return;
    const text = prompt.trim();
    setPrompt("");
    await onSend(text);
  };

  return (
    <section className="pane chat-surface">
      {items.length === 0 ? (
        <div className="chat-empty-hero">
          <h1>What’s on your mind?</h1>
          <p>Pick a model. Then ask.</p>
        </div>
      ) : (
        <div className="chat-message-list">
          {items.map((item) => (
            <div key={item.id} className={`chat-bubble chat-bubble--${item.kind}`}>
              {item.kind === "user" ? (
                <div className="chat-bubble__user-text">{item.text}</div>
              ) : (
                <div className="chat-bubble__assistant-text">
                  <p>{item.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="chat-composer-container">
        <div className="chat-composer">
          <textarea
            className="chat-composer__textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Ask anything…"
            rows={1}
          />

          <div className="chat-composer__footer">
            <div className="chat-composer__options">
              <button className="chat-option-chip" type="button">
                <Cpu size={12} />
                <span>Claude Code</span>
              </button>
              <button className="chat-option-chip" type="button">
                <span>Automatic · Sonnet…</span>
              </button>
              <button className="chat-option-chip" type="button">
                <span>High</span>
              </button>
              <button className="chat-option-chip" type="button">
                <Shield size={12} />
                <span>Auto-accept edits</span>
              </button>
              <button className="chat-option-chip" type="button">
                <Wrench size={12} />
                <span>Build</span>
              </button>
              {items.length > 0 && <span className="chat-token-count">58 tokens</span>}
            </div>

            <div className="chat-composer__submit">
              {isRunning ? (
                <button
                  className="chat-submit-btn chat-submit-btn--stop"
                  onClick={onCancel}
                  type="button"
                >
                  <Square size={13} />
                </button>
              ) : (
                <button
                  className="chat-submit-btn"
                  disabled={!prompt.trim()}
                  onClick={() => handleSubmit()}
                  type="button"
                >
                  <ArrowUp size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
