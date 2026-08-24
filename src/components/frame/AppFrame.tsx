import React from "react";
import { Titlebar } from "./Titlebar";
import { Sidebar } from "./Sidebar";
import { usePreferences } from "@/hooks/usePreferences";
import { AgentHub } from "@/components/agent/AgentHub";
import { WorkspaceStudio } from "@/components/code/WorkspaceStudio";
import { GeneralChatView } from "@/components/chat/GeneralChatView";
import { RoutinesView } from "@/components/routines/RoutinesView";
import { PluginsMarketplaceView } from "@/components/plugins/PluginsMarketplaceView";
import { AgentEditorModal } from "@/components/agent/AgentEditorModal";
import { useAgentMind } from "@/hooks/useAgentMind";
import { useRoutines } from "@/hooks/useRoutines";
import { useChatThread } from "@/hooks/useChatThread";
import { getService } from "@/services";
import { LayoutDashboard, Sparkles } from "lucide-react";

export function AppFrame() {
  const { state, dispatch } = usePreferences();
  const service = getService();

  const selectedAgent = state.agents.find(a => a.id === state.preferences.selectedAgentId) ?? state.agents[0] ?? null;
  const selectedWorkspace = state.workspaces.find(w => w.id === state.preferences.selectedWorkspaceId) ?? state.workspaces[0] ?? null;

  const { mind, loading: mindLoading, saveMemory, installSkill, removeSkill } = useAgentMind(selectedAgent?.id ?? null);
  const { routines, loading: routinesLoading, toggleEnabled, deleteRoutine } = useRoutines();
  const { thread: chatThread, loading: chatLoading, sendPrompt: sendChat, cancelTurn: cancelChat } = useChatThread(null);

  const handleCreateAgent = async (newAgentData: { name: string; engine: any; purpose: string }) => {
    const created = await service.createAgent(newAgentData);
    dispatch({ type: "createAgentSucceeded", agent: created });
  };

  const handleUpdateAgent = async (updated: any) => {
    const saved = await service.updateAgentProfile(updated);
    dispatch({ type: "agentProfileUpdated", agent: saved });
  };

  const handleDeleteAgent = async (id: string) => {
    await service.deleteAgentProfile(id);
    dispatch({ type: "deleteAgentSucceeded", agentId: id });
  };

  const handleAddWorkspace = async () => {
    const ws = await service.addWorkspace();
    if (ws) dispatch({ type: "addWorkspaceSucceeded", workspace: ws });
  };

  const uiScale = state.preferences.zoomPercent / 100;

  return (
    <div className="zoom-viewport" data-theme={state.preferences.appearance}>
      <div
        className="app-frame app-frame--scaled"
        style={{ "--ui-scale": uiScale } as React.CSSProperties}
      >
        <Titlebar
          mode={state.preferences.workMode}
          sidebarVisible={state.preferences.sidebarVisible}
          onModeChange={(mode) => dispatch({ type: "setMode", mode })}
          onToggleSidebar={() => dispatch({ type: "toggleSidebar" })}
        />

        <div className={`workspace-shell ${state.preferences.sidebarVisible ? "" : "workspace-shell--sidebar-hidden"}`}>
          {state.preferences.sidebarVisible && (
            <Sidebar
              mode={state.preferences.workMode}
              route={state.preferences.route}
              agents={state.agents}
              workspaces={state.workspaces}
              selectedAgentId={selectedAgent?.id ?? null}
              selectedWorkspaceId={selectedWorkspace?.id ?? null}
              appearance={state.preferences.appearance}
              creditsLabel="12,500"
              accountName="Builder"
              accountTier="ULTRA"
              onOpenDestination={(destination) => dispatch({ type: "openDestination", destination })}
              onSelectAgent={(id) => dispatch({ type: "selectAgent", id })}
              onSelectWorkspace={(id) => dispatch({ type: "selectWorkspace", id })}
              onShowModeHome={() => dispatch({ type: "showModeHome" })}
              onNewAgent={() => dispatch({ type: "openAgentEditor" })}
              onAddWorkspace={handleAddWorkspace}
              onNewChat={() => {
                dispatch({ type: "setMode", mode: "chat" });
              }}
              onToggleAppearance={() =>
                dispatch({
                  type: "setAppearance",
                  appearance: state.preferences.appearance === "dark" ? "light" : "dark"
                })
              }
              onOpenSettings={() => {}}
            />
          )}

          <div className="workspace-shell__stage" style={{ flex: "auto", minWidth: 0, minHeight: 0, display: "flex" }}>
            {state.preferences.route.kind === "destination" ? (
              <>
                {state.preferences.route.destination === "plugins" && <PluginsMarketplaceView />}
                {state.preferences.route.destination === "routines" && (
                  <RoutinesView
                    routines={routines}
                    agents={state.agents}
                    loading={routinesLoading}
                    onToggle={toggleEnabled}
                    onDelete={deleteRoutine}
                  />
                )}
                {state.preferences.route.destination === "dashboard" && (
                  <section className="pane destination-pane">
                    <header className="pane-titlebar pane-titlebar--large">
                      <span aria-hidden="true" className="pane-titlebar__icon">
                        <LayoutDashboard size={14} />
                      </span>
                      <span className="pane-titlebar__copy">
                        <strong>Dashboard</strong>
                        <small>Every agent running across your workspaces.</small>
                      </span>
                      <span className="running-pill running-pill--empty">Idle</span>
                    </header>
                    <div className="agent-pane__rule" />
                    <div className="empty-surface empty-surface--embedded">
                      <h3 className="empty-surface__title">No agents running</h3>
                      <p className="empty-surface__detail">
                        Start an agent from its page or a workspace and it shows up here.
                      </p>
                    </div>
                  </section>
                )}
                {state.preferences.route.destination === "skills" && (
                  <section className="pane destination-pane">
                    <header className="pane-titlebar pane-titlebar--large">
                      <span aria-hidden="true" className="pane-titlebar__icon">
                        <Sparkles size={14} />
                      </span>
                      <span className="pane-titlebar__copy">
                        <strong>Skills</strong>
                        <small>Start from a vetted recipe or publish your own.</small>
                      </span>
                    </header>
                    <div className="agent-pane__rule" />
                    <div className="empty-surface empty-surface--embedded">
                      <h3 className="empty-surface__title">No skills published</h3>
                      <p className="empty-surface__detail">
                        Skills published by agents or imported into your workspace appear here.
                      </p>
                    </div>
                  </section>
                )}
              </>
            ) : (
              <>
                {state.preferences.workMode === "agent" && (
                  <AgentHub
                    agent={selectedAgent}
                    face={state.agentFace}
                    mind={mind}
                    mindLoading={mindLoading}
                    onFaceChange={(face) => dispatch({ type: "setAgentFace", face })}
                    onNewAgent={() => dispatch({ type: "openAgentEditor" })}
                    onSaveMemory={saveMemory}
                    onInstallSkill={installSkill}
                    onRemoveSkill={removeSkill}
                    onUpdateAgent={handleUpdateAgent}
                    onDeleteAgent={handleDeleteAgent}
                  />
                )}

                {state.preferences.workMode === "code" && (
                  <WorkspaceStudio
                    workspace={selectedWorkspace}
                    onAddWorkspace={handleAddWorkspace}
                    renderTerminal={(sessionId) => (
                      <div className="terminal-placeholder">Terminal: {sessionId}</div>
                    )}
                    renderBrowser={(surfaceId) => (
                      <div className="browser-placeholder">Browser: {surfaceId}</div>
                    )}
                  />
                )}

                {state.preferences.workMode === "chat" && (
                  <GeneralChatView
                    thread={chatThread}
                    loading={chatLoading}
                    onSend={sendChat}
                    onCancel={cancelChat}
                    onNewChat={() => {}}
                  />
                )}
              </>
            )}
          </div>
        </div>

        <AgentEditorModal
          open={state.agentEditorOpen}
          onClose={() => dispatch({ type: "closeAgentEditor" })}
          onCreate={handleCreateAgent}
        />
      </div>
    </div>
  );
}
