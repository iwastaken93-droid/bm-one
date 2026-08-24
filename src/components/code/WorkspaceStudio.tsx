import React from "react";
import type { WorkspaceProfile } from "@/types";
import { Folder, Plus } from "lucide-react";

export interface WorkspaceStudioProps {
  workspace: WorkspaceProfile | null;
  addingWorkspace?: boolean;
  onAddWorkspace: () => Promise<void>;
  renderTerminal: (sessionId: string) => React.ReactNode;
  renderBrowser: (surfaceId: string) => React.ReactNode;
}

export function WorkspaceStudio({
  workspace,
  addingWorkspace = false,
  onAddWorkspace
}: WorkspaceStudioProps) {
  if (workspace === null) {
    return (
      <section className="pane empty-surface">
        <div aria-hidden="true" className="empty-surface__icon">
          <Folder size={26} strokeWidth={1.4} />
        </div>
        <h1>No workspace open</h1>
        <p>Pick a folder on your computer to open terminals, browsers, and coding threads together.</p>
        <button
          className="primary-button"
          disabled={addingWorkspace}
          onClick={onAddWorkspace}
          type="button"
        >
          <Plus size={14} aria-hidden="true" />
          <span>{addingWorkspace ? "Opening…" : "Add folder"}</span>
        </button>
      </section>
    );
  }

  return (
    <section className="pane workspace-studio">
      <div className="empty-surface empty-surface--embedded">
        <h2>{workspace.displayName}</h2>
        <p>Workspace is initialized. Open terminal or browser panes from the tab bar.</p>
      </div>
    </section>
  );
}
