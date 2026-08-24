import React from "react";
import type { OccupantKind } from "@/types";
import { Terminal, Globe, Code, X, Columns, Rows } from "lucide-react";

export interface CodePaneHeaderProps {
  occupant: OccupantKind;
  focused: boolean;
  onFocus: () => void;
  onClose: () => void;
  onSplitHorizontal: () => void;
  onSplitVertical: () => void;
}

export function CodePaneHeader({
  occupant,
  focused,
  onFocus,
  onClose,
  onSplitHorizontal,
  onSplitVertical
}: CodePaneHeaderProps) {
  const getIcon = () => {
    switch (occupant.kind) {
      case "terminal": return <Terminal size={13} />;
      case "browser": return <Globe size={13} />;
      case "thread": return <Code size={13} />;
    }
  };

  const getLabel = () => {
    switch (occupant.kind) {
      case "terminal": return "Terminal Shell";
      case "browser": return "Browser Preview";
      case "thread": return "Coding Thread";
    }
  };

  return (
    <header
      className={`code-pane-header ${focused ? "code-pane-header--focused" : ""}`}
      onClick={onFocus}
    >
      <div className="code-pane-header__identity">
        {getIcon()}
        <span>{getLabel()}</span>
      </div>

      <div className="code-pane-header__actions">
        <button
          className="chrome-button"
          onClick={(e) => { e.stopPropagation(); onSplitHorizontal(); }}
          title="Split Right"
          type="button"
        >
          <Columns size={12} />
        </button>
        <button
          className="chrome-button"
          onClick={(e) => { e.stopPropagation(); onSplitVertical(); }}
          title="Split Down"
          type="button"
        >
          <Rows size={12} />
        </button>
        <button
          className="chrome-button"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          title="Close Pane"
          type="button"
        >
          <X size={12} />
        </button>
      </div>
    </header>
  );
}
