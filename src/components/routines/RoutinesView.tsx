import React from "react";
import type { Routine, AgentProfile } from "@/types";
import { Clock } from "lucide-react";

export interface RoutinesViewProps {
  routines: Routine[];
  agents: AgentProfile[];
  loading: boolean;
  onToggle: (routine: Routine) => Promise<void>;
  onDelete: (routine: Routine) => Promise<void>;
}

export function RoutinesView({ routines, agents }: RoutinesViewProps) {
  return (
    <section className="pane destination-pane">
      <header className="pane-titlebar pane-titlebar--large">
        <span aria-hidden="true" className="pane-titlebar__icon">
          <Clock size={14} />
        </span>
        <span className="pane-titlebar__copy">
          <strong>Routines</strong>
          <small>Work your agents pick up on their own.</small>
        </span>
      </header>

      <div className="agent-pane__rule" />

      {routines.length === 0 ? (
        <div className="empty-surface empty-surface--embedded">
          <div aria-hidden="true" className="empty-surface__icon">
            <Clock size={24} strokeWidth={1.4} />
          </div>
          <h3 className="empty-surface__title">No routines yet</h3>
          <p className="empty-surface__detail">
            Create an agent first, then add a job here — or let the agent schedule one itself while you work.
          </p>
        </div>
      ) : (
        <div className="routines-list">
          {routines.map((routine) => (
            <div key={routine.id} className="routine-row">
              <h4>{routine.title}</h4>
              <p>{routine.prompt}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
