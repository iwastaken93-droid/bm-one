import React from "react";
import type { AuthSnapshot } from "@/types";
import { AuthRestoring } from "./AuthRestoring";
import { AuthWelcome } from "./AuthWelcome";
import { AuthUpgrade } from "./AuthUpgrade";

export interface AuthGateProps {
  snapshot: AuthSnapshot;
  busy: boolean;
  error: string | null;
  version?: string;
  actions: {
    beginSignIn: () => void;
    cancelSignIn: () => void;
    reopenBrowser: () => void;
    createAccount: () => void;
    retryEntitlement: () => void;
    updatePlan: () => void;
    signOut: () => void;
  };
  children: React.ReactNode;
}

export function AuthGate({ snapshot, busy, error, version, actions, children }: AuthGateProps) {
  // 1. App startup restoring session
  if (snapshot.phase.kind === "restoring") {
    return <AuthRestoring version={version} />;
  }

  // 2. User signed in -> evaluate entitlement
  if (snapshot.phase.kind === "signedIn") {
    if (snapshot.access.kind === "unknown") {
      return <AuthRestoring version={version} />;
    }
    if (snapshot.access.kind === "entitled") {
      return <>{children}</>;
    }
    return (
      <AuthUpgrade
        snapshot={snapshot}
        busy={busy}
        error={error}
        version={version}
        actions={actions}
      />
    );
  }

  // 3. User signed out or in signing-in browser loop
  return (
    <AuthWelcome
      snapshot={snapshot}
      busy={busy}
      error={error}
      version={version}
      actions={actions}
    />
  );
}
