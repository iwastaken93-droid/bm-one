import React from "react";
import type { AgentEngine } from "@/types";

const AGENT_LINEUP: Array<{ engine: AgentEngine; label: string }> = [
  { engine: "claude-code", label: "Claude Code" },
  { engine: "codex", label: "Codex" },
  { engine: "cursor", label: "Cursor Agent" },
  { engine: "gemini", label: "Gemini CLI" },
  { engine: "github-copilot", label: "GitHub Copilot" },
  { engine: "droid", label: "Droid" },
  { engine: "open-code", label: "OpenCode" },
  { engine: "deep-seek", label: "DeepSeek Harness" },
  { engine: "grok", label: "Grok Build" },
  { engine: "amp", label: "Amp" },
  { engine: "antigravity", label: "Antigravity" },
  { engine: "aider", label: "Aider" }
];

export function AuthOrbit() {
  const total = AGENT_LINEUP.length;

  return (
    <div className="auth-orbit" role="img" aria-label="BridgeMind One agent lineup">
      <span className="auth-orbit__ring" aria-hidden="true" />
      <span className="auth-orbit__bloom auth-orbit__bloom--amber" aria-hidden="true" />
      <span className="auth-orbit__bloom auth-orbit__bloom--blue" aria-hidden="true" />
      <img
        src="/output/assets/bridge-mind-symbol.png"
        alt=""
        className="auth-orbit__mark"
        aria-hidden="true"
      />
      <div className="auth-orbit__agents" aria-hidden="true">
        {AGENT_LINEUP.map((agent, index) => {
          const angleDeg = (index / total) * 360;
          return (
            <span
              key={agent.engine}
              className="auth-orbit__seat"
              style={{ "--auth-seat": `${angleDeg}deg` } as React.CSSProperties}
              title={agent.label}
            >
              <span className="auth-orbit__chip">
                <img
                  src={`/output/assets/logos/agent-${agent.engine.replace("-code", "").replace("deep-seek", "deepseek")}.png`}
                  alt=""
                  style={{ width: 18, height: 18, objectFit: "contain" }}
                  onError={(e) => {
                    // Fallback to onDark variant
                    (e.target as HTMLImageElement).src = `/output/assets/logos/agent-${agent.engine}-onDark.png`;
                  }}
                />
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
