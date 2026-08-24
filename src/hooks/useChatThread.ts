import { useState, useEffect, useCallback } from "react";
import type { ChatThread } from "@/types";
import { getService } from "@/services";

export function useChatThread(threadId: string | null) {
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = getService();

  const loadThread = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await service.loadChatThread(id);
      setThread(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load chat thread.");
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    if (threadId) loadThread(threadId);
    else setThread(null);
  }, [threadId, loadThread]);

  const sendPrompt = useCallback(async (prompt: string) => {
    if (!threadId || !thread) return;
    try {
      await service.startChatTurn({ threadId, prompt, expectedRevision: thread.revision });
      setThread(prev => prev ? { ...prev, status: "running" } : null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send chat turn.");
    }
  }, [threadId, thread, service]);

  const cancelTurn = useCallback(async () => {
    if (!threadId) return;
    try {
      await service.cancelChatTurn(threadId);
      setThread(prev => prev ? { ...prev, status: "idle" } : null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to cancel chat turn.");
    }
  }, [threadId, service]);

  return { thread, loading, error, sendPrompt, cancelTurn, reload: () => threadId && loadThread(threadId) };
}
