import React from "react";
import { Loader2 } from "lucide-react";
import { AuthScene } from "./AuthScene";

export function AuthRestoring({ version }: { version?: string }) {
  return (
    <AuthScene version={version}>
      <div aria-label="Restoring your session" className="auth-restoring" role="status">
        <Loader2 aria-hidden="true" className="auth-spinner animate-spin" size={16} />
        <span>Restoring your session…</span>
      </div>
    </AuthScene>
  );
}
