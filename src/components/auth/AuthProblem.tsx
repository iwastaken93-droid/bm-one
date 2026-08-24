import React from "react";
import { AlertCircle } from "lucide-react";

export function AuthProblem({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="auth-problem" role="alert">
      <AlertCircle aria-hidden="true" size={13} />
      <span>{message}</span>
    </div>
  );
}
