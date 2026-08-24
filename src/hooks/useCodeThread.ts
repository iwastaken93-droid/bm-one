import { useState, useEffect, useCallback } from "react";
import type { CodeThread, CodeProvider, CodeExecutionMode } from "@/types";
import { getService } from "@/services";

export function useCodeThread(threadId: string | null) {
  const [thread, setThread] = useState<CodeThread | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = getService();

  const loadThread = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await service.readCodeThread(id);
      setThread(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load code thread.");
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    if (threadId) loadThread(threadId);
    else setThread(null);
  }, [threadId, loadThread]);

  const configure = useCallback(async (config: { provider?: CodeProvider; mode?: CodeExecutionMode }) => {
    if (!threadId) return;
    try {
      const updated = await service.configureCodeThread({ threadId, ...config });
      setThread(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to configure thread.");
    }
  }, [threadId, service]);

  const sendPrompt = useCallback(async (prompt: string) => {
    if (!threadId || !thread) return;
    try {
      await service.startCodeThreadTurn({ target: threadId, prompt, expectedRevision: "rev-0" });
      setThread(prev => prev ? { ...prev, status: "running" } : null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to start code turn.");
    }
  }, [threadId, thread, service]);

  const stopTurn = useCallback(async () => {
    if (!threadId) return;
    try {
      await service.stopCodeThreadTurn(threadId);
      setThread(prev => prev ? { ...prev, status: "idle" } : null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to stop code turn.");
    }
  }, [threadId, service]);

  return { thread, loading, error, configure, sendPrompt, stopTurn, reload: () => threadId && loadThread(threadId) };
}
