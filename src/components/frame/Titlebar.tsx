import React from "react";
import type { WorkMode } from "@/types";
import { getService } from "@/services";
import { PanelLeft, Minus, Square, X, Bell } from "lucide-react";

export interface TitlebarProps {
  mode: WorkMode;
  sidebarVisible: boolean;
  onModeChange: (mode: WorkMode) => void;
  onToggleSidebar: () => void;
}

export function Titlebar({
  mode,
  sidebarVisible,
  onModeChange,
  onToggleSidebar
}: TitlebarProps) {
  const service = getService();

  return (
    <header className="titlebar" data-tauri-drag-region>
      <div className="titlebar__leading" data-tauri-drag-region>
        <div className="brand-lockup" data-tauri-drag-region>
          <img
            alt=""
            aria-hidden="true"
            className="brand-lockup__mark"
            src="/assets/bridge-mind-symbol.png"
          />
          <span data-tauri-drag-region>BridgeMind</span>
          <span className="brand-lockup__one" data-tauri-drag-region>
            1
          </span>
        </div>

        <button
          aria-label={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
          className={`chrome-button ${sidebarVisible ? "chrome-button--active" : ""}`}
          onClick={onToggleSidebar}
          title={sidebarVisible ? "Hide sidebar (Ctrl+B)" : "Show sidebar (Ctrl+B)"}
          type="button"
        >
          <PanelLeft size={14} aria-hidden="true" />
        </button>

        <nav aria-label="Mode switcher" className="mode-toggle">
          <button
            aria-pressed={mode === "agent"}
            className={`mode-toggle__item ${mode === "agent" ? "mode-toggle__item--selected" : ""}`}
            onClick={() => onModeChange("agent")}
            type="button"
          >
            Agent
          </button>
          <button
            aria-pressed={mode === "code"}
            className={`mode-toggle__item ${mode === "code" ? "mode-toggle__item--selected" : ""}`}
            onClick={() => onModeChange("code")}
            type="button"
          >
            Code
          </button>
          <button
            aria-pressed={mode === "chat"}
            className={`mode-toggle__item ${mode === "chat" ? "mode-toggle__item--selected" : ""}`}
            onClick={() => onModeChange("chat")}
            type="button"
          >
            Chat
          </button>
        </nav>
      </div>

      <div className="titlebar__trailing">
        <button
          aria-label="Notifications"
          className="chrome-button"
          title="Notifications"
          type="button"
        >
          <Bell size={13} aria-hidden="true" />
        </button>

        <div className="titlebar__window-controls">
          <button
            aria-label="Minimize"
            className="chrome-button"
            onClick={() => service.windowAction("minimize")}
            title="Minimize"
            type="button"
          >
            <Minus size={12} aria-hidden="true" />
          </button>
          <button
            aria-label="Maximize"
            className="chrome-button"
            onClick={() => service.windowAction("toggleMaximize")}
            title="Maximize"
            type="button"
          >
            <Square size={10} aria-hidden="true" />
          </button>
          <button
            aria-label="Close"
            className="chrome-button chrome-button--close"
            onClick={() => service.windowAction("close")}
            title="Close"
            type="button"
          >
            <X size={12} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
