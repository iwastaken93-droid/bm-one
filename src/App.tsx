import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthGate, PaymentRecovery } from "@/components/auth";
import { AppFrame } from "@/components/frame/AppFrame";

export function App() {
  const { snapshot, busy, error, actions } = useAuth();

  return (
    <AuthGate
      snapshot={snapshot}
      busy={busy}
      error={error}
      actions={actions}
      version="1.0.0"
    >
      {snapshot.paymentRecovery && <PaymentRecovery />}
      <AppFrame />
    </AuthGate>
  );
}

export default App;
