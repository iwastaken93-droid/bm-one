import React from "react";
import type { ChatItem } from "@/types";
import { Check, X, FileCode, Play, AlertTriangle } from "lucide-react";

export interface CodeDiffViewerProps {
  items: ChatItem[];
}

export function CodeDiffViewer({ items }: CodeDiffViewerProps) {
  return (
    <div className="code-diff-viewer">
      {items.map((item) => (
        <div key={item.id} className={`code-diff-entry code-diff-entry--${item.kind}`}>
          <div className="code-diff-entry__header">
            {item.kind === "user" && <span className="diff-badge diff-badge--user">User Prompt</span>}
            {item.kind === "tool" && (
              <span className="diff-badge diff-badge--tool">
                <Play size={11} /> {item.title ?? "Tool Invocation"}
              </span>
            )}
            {item.kind === "assistant" && <span className="diff-badge diff-badge--ai">Agent Action</span>}
            {item.kind === "error" && (
              <span className="diff-badge diff-badge--error">
                <AlertTriangle size={11} /> Error
              </span>
            )}
            <span className="code-diff-entry__time">
              {new Date(item.createdAtUnixMs).toLocaleTimeString()}
            </span>
          </div>

          <div className="code-diff-entry__body">
            <pre>{item.text}</pre>
          </div>
        </div>
      ))}
    </div>
  );
}
