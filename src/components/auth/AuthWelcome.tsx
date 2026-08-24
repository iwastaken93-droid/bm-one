import React from "react";
import type { AuthSnapshot } from "@/types";
import { AuthScene } from "./AuthScene";
import { AuthOrbit } from "./AuthOrbit";
import { AuthProblem } from "./AuthProblem";
import { AuthWaiting } from "./AuthWaiting";

export interface AuthWelcomeProps {
  snapshot: AuthSnapshot;
  busy: boolean;
  error: string | null;
  version?: string;
  actions: {
    beginSignIn: () => void;
    cancelSignIn: () => void;
    reopenBrowser: () => void;
    createAccount: () => void;
  };
}

export function AuthWelcome({ snapshot, busy, error, version, actions }: AuthWelcomeProps) {
  const phase = snapshot.phase;

  return (
    <AuthScene version={version}>
      <div className="auth-welcome">
        <AuthOrbit />
        <div className="auth-eyebrow">
          <span>BridgeMind</span>
          <i aria-hidden="true" />
          <span className="auth-eyebrow__one">One</span>
        </div>
        <h1>
          The Agent <span className="auth-welcome__accent">SuperApp</span>
        </h1>

        {phase.kind === "signingIn" ? (
          <AuthWaiting
            snapshot={snapshot}
            busy={busy}
            onReopenBrowser={actions.reopenBrowser}
            onCancel={actions.cancelSignIn}
          />
        ) : (
          <div className="auth-signin-actions">
            <AuthProblem message={error ?? snapshot.problem?.message ?? null} />
            <button
              className="primary-button auth-button--hero"
              disabled={busy}
              onClick={actions.beginSignIn}
              type="button"
            >
              {error === null && snapshot.problem === undefined ? "Sign in" : "Try again"}
            </button>
            <button
              className="secondary-button auth-button--hero"
              disabled={busy}
              onClick={actions.createAccount}
              type="button"
            >
              Create account
            </button>
          </div>
        )}
      </div>
    </AuthScene>
  );
}
