import React from "react";

export interface AuthSceneProps {
  children: React.ReactNode;
  version?: string;
}

export function AuthScene({ children, version = "1.0.0" }: AuthSceneProps) {
  return (
    <main className="auth-scene">
      <div aria-hidden="true" className="auth-scene__drag" data-tauri-drag-region />
      <div className="auth-scene__content">{children}</div>
      <span className="auth-scene__version">v{version}</span>
    </main>
  );
}
