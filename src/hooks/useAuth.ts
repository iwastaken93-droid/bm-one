import { useState, useEffect, useCallback } from "react";
import type { AuthSnapshot } from "@/types";
import { getService } from "@/services";

export function useAuth() {
  const [snapshot, setSnapshot] = useState<AuthSnapshot>({
    schemaVersion: 1,
    revision: 0,
    phase: { kind: "restoring" },
    access: { kind: "unknown" },
    subscriptionTier: "free",
    canReopenBrowser: false,
    paymentRecovery: false
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = getService();

  const refreshSnapshot = useCallback(async () => {
    try {
      const snap = await service.readAuthSnapshot();
      setSnapshot(snap);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to read session status.";
      setError(msg);
    }
  }, [service]);

  useEffect(() => {
    service.restoreAuth().then(setSnapshot).catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Failed to restore session.");
    });
  }, [service]);

  const beginSignIn = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const snap = await service.beginSignIn();
      setSnapshot(snap);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }, [service]);

  const cancelSignIn = useCallback(async () => {
    setBusy(true);
    try {
      const snap = await service.cancelSignIn();
      setSnapshot(snap);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Cancellation failed.");
    } finally {
      setBusy(false);
    }
  }, [service]);

  const reopenBrowser = useCallback(async () => {
    try {
      const snap = await service.reopenSignInBrowser();
      setSnapshot(snap);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reopen browser.");
    }
  }, [service]);

  const signOut = useCallback(async () => {
    setBusy(true);
    try {
      const snap = await service.signOut();
      setSnapshot(snap);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign-out failed.");
    } finally {
      setBusy(false);
    }
  }, [service]);

  const retryEntitlement = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const snap = await service.retryEntitlement();
      setSnapshot(snap);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to check plan.");
    } finally {
      setBusy(false);
    }
  }, [service]);

  const createAccount = useCallback(async () => {
    await service.openSignUp();
  }, [service]);

  const updatePlan = useCallback(async () => {
    await service.openUpgrade();
  }, [service]);

  return {
    snapshot,
    busy,
    error,
    actions: {
      beginSignIn,
      cancelSignIn,
      reopenBrowser,
      signOut,
      retryEntitlement,
      createAccount,
      updatePlan,
      refreshSnapshot
    }
  };
}
