export interface LogoSpec {
  file?: string;
  onDark?: string;
  onLight?: string;
}

export const AGENT_LOGOS: Record<string, LogoSpec> = {
  "claude-code": { file: "agent-claude" },
  "codex": { onDark: "agent-codex-onDark", onLight: "agent-codex-onLight" },
  "cursor": { onDark: "agent-cursor-onDark", onLight: "agent-cursor-onLight" },
  "gemini": { onDark: "agent-gemini-onDark", onLight: "agent-gemini-onLight" },
  "github-copilot": { onDark: "agent-copilot-onDark", onLight: "agent-copilot-onLight" },
  "droid": { onDark: "agent-droid-onDark", onLight: "agent-droid-onLight" },
  "open-code": { onDark: "agent-opencode-onDark", onLight: "agent-opencode-onLight" },
  "deep-seek": { file: "agent-deepseek" },
  "grok": { onDark: "agent-grok-onDark", onLight: "agent-grok-onLight" },
  "amp": { file: "agent-amp" },
  "antigravity": { file: "agent-antigravity" },
  "aider": { onDark: "agent-aider-onDark", onLight: "agent-aider-onLight" }
};

export function getAgentLogoUrl(engine: string, appearance: "dark" | "light" = "dark"): string {
  const spec = AGENT_LOGOS[engine];
  if (!spec) return "/assets/bridge-mind-symbol.png";
  const name = spec.file ?? (appearance === "light" ? spec.onLight : spec.onDark);
  return `/assets/logos/${name}.png`;
}
