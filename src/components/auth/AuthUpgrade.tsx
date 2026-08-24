import React from "react";
import type { AuthSnapshot, AuthAccess } from "@/types";
import { AuthScene } from "./AuthScene";
import { AuthProblem } from "./AuthProblem";

export interface AuthUpgradeProps {
  snapshot: AuthSnapshot;
  busy: boolean;
  error: string | null;
  version?: string;
  actions: {
    retryEntitlement: () => void;
    updatePlan: () => void;
    signOut: () => void;
  };
}

function getAccessClaim(access: AuthAccess): { title: string; detail: string; primary: string } {
  if (access.kind === "unverified") {
    return {
      title: "Verify your email",
      detail: "Check your inbox to confirm your account and activate BridgeMind One.",
      primary: "Check verification"
    };
  }
  if (access.kind === "upgradeRequired") {
    switch (access.reason) {
      case "basic":
        return {
          title: "Upgrade to Pro",
          detail: "A Pro or Ultra subscription is required to run advanced coding threads.",
          primary: "Get Pro"
        };
      case "inactive":
        return {
          title: "Reactivate Subscription",
          detail: "Your previous plan has expired. Reactivate your subscription to continue.",
          primary: "Reactivate Plan"
        };
      default:
        return {
          title: "Upgrade to Pro",
          detail: "A BridgeMind One Pro or Ultra subscription is required to launch agents.",
          primary: "Upgrade plan"
        };
    }
  }
  return {
    title: "Account Authority Required",
    detail: "An active plan is required to continue.",
    primary: "Upgrade plan"
  };
}

export function AuthUpgrade({ snapshot, busy, error, version, actions }: AuthUpgradeProps) {
  const claim = getAccessClaim(snapshot.access);
  const email = snapshot.user?.email;
  const isUnverified = snapshot.access.kind === "unverified";

  return (
    <AuthScene version={version}>
      <div className="auth-upgrade">
        <img
          src="/output/assets/bridge-mind-symbol.png"
          alt=""
          className="auth-upgrade__mark"
          aria-hidden="true"
        />
        <div className="auth-eyebrow">
          <span>BridgeMind</span>
          <i aria-hidden="true" />
          <span className="auth-eyebrow__one">One</span>
        </div>
        <div className="auth-upgrade__claim">
          <h1>{claim.title}</h1>
          <p>{claim.detail}</p>
          {email && <span className="auth-upgrade__email">Signed in as {email}</span>}
        </div>

        <AuthProblem message={error ?? snapshot.problem?.message ?? null} />

        <div className="auth-upgrade__actions">
          <button
            className="primary-button auth-button--hero"
            disabled={busy}
            onClick={isUnverified ? actions.retryEntitlement : actions.updatePlan}
            type="button"
          >
            {claim.primary}
          </button>
          {!isUnverified && (
            <button
              className="secondary-button auth-button--hero"
              disabled={busy}
              onClick={actions.retryEntitlement}
              type="button"
            >
              I already upgraded
            </button>
          )}
          <button
            className="auth-text-action"
            disabled={busy}
            onClick={actions.signOut}
            type="button"
          >
            Sign out
          </button>
        </div>
      </div>
    </AuthScene>
  );
}
