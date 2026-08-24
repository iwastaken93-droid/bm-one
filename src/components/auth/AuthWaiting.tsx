import React from "react";
import { Loader2 } from "lucide-react";
import type { AuthSnapshot } from "@/types";

export interface AuthWaitingProps {
  snapshot: AuthSnapshot;
  busy: boolean;
  onReopenBrowser: () => void;
  onCancel: () => void;
}

export function AuthWaiting({ snapshot, busy, onReopenBrowser, onCancel }: AuthWaitingProps) {
  const phase = snapshot.phase;
  if (phase.kind !== "signingIn") return null;

  const statusText =
    phase.step === "starting"
      ? "Opening your browser…"
      : phase.step === "waitingForBrowser"
      ? "Finish signing in in your browser."
      : "Signing you in…";

  return (
    <div className="auth-waiting" role="status">
      <div className="auth-waiting__title">
        <Loader2 aria-hidden="true" className="auth-spinner animate-spin" size={16} />
        <span>{statusText}</span>
      </div>
      {phase.step === "waitingForBrowser" && (
        <p>This window picks up the moment you're done.</p>
      )}
      <div className="auth-waiting__actions">
        {snapshot.canReopenBrowser && (
          <button className="secondary-button" disabled={busy} onClick={onReopenBrowser} type="button">
            Open browser again
          </button>
        )}
        <button className="secondary-button" disabled={busy} onClick={onCancel} type="button">
          Cancel
        </button>
      </div>
    </div>
  );
}
