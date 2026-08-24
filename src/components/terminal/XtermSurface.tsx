import React, { useRef, useState, useEffect } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { CanvasAddon } from "@xterm/addon-canvas";
import { getService } from "@/services";

export interface XtermSurfaceProps {
  sessionId: string;
  workspaceId: string;
  workspaceName?: string;
  visible?: boolean;
}

const TERMINAL_THEME = {
  background: "#000000",
  foreground: "#d4d4d4",
  cursor: "#ffffff",
  cursorAccent: "#000000",
  selectionBackground: "rgba(59, 130, 246, 0.4)",
  black: "#18181b",
  red: "#ef4444",
  green: "#22c55e",
  yellow: "#eab308",
  blue: "#3b82f6",
  magenta: "#a855f7",
  cyan: "#06b6d4",
  white: "#f4f4f5",
  brightBlack: "#71717a",
  brightRed: "#f87171",
  brightGreen: "#4ade80",
  brightYellow: "#fde047",
  brightBlue: "#60a5fa",
  brightMagenta: "#c4b5fd",
  brightCyan: "#67e8f9",
  brightWhite: "#ffffff"
};

export function XtermSurface({
  sessionId,
  workspaceId,
  visible = true
}: XtermSurfaceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const service = getService();

  useEffect(() => {
    if (!visible) return;
    const container = containerRef.current;
    if (!container) return;

    const term = new Terminal({
      allowProposedApi: false,
      cursorBlink: false,
      cursorStyle: "bar",
      fontFamily: '"Cascadia Mono", "Cascadia Code", Consolas, monospace',
      fontSize: 13,
      lineHeight: 1.16,
      theme: TERMINAL_THEME
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    try {
      const canvasAddon = new CanvasAddon();
      term.loadAddon(canvasAddon);
    } catch {
      // Fallback to standard DOM renderer
    }

    term.open(container);
    if (container.clientWidth > 0 && container.clientHeight > 0) {
      fitAddon.fit();
    }

    service.startTerminal({
      sessionId,
      workspaceId,
      cols: term.cols,
      rows: term.rows
    });

    const onDataDisp = term.onData((data) => {
      service.writeTerminal({ sessionId, data });
    });

    const resizeObserver = new ResizeObserver(() => {
      if (container.clientWidth > 0 && container.clientHeight > 0) {
        fitAddon.fit();
        service.resizeTerminal({ sessionId, cols: term.cols, rows: term.rows });
      }
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      onDataDisp.dispose();
      term.dispose();
      service.terminateTerminal(sessionId);
    };
  }, [sessionId, workspaceId, visible, service]);

  return <div className="terminal-surface" ref={containerRef} />;
}
