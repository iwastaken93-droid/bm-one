import { useState, useEffect, useCallback } from "react";
import type { AgentMind, AgentSkill } from "@/types";
import { getService } from "@/services";

export function useAgentMind(agentId: string | null) {
  const [mind, setMind] = useState<AgentMind | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = getService();

  const loadMind = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.loadAgentMind(id);
      setMind(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load agent mind.");
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    if (agentId) {
      loadMind(agentId);
    } else {
      setMind(null);
    }
  }, [agentId, loadMind]);

  const saveMemory = useCallback(async (memory: string, user?: string) => {
    if (!agentId) return;
    try {
      const updated = await service.writeAgentMemory({ agentId, memory, user });
      setMind(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save memory.");
    }
  }, [agentId, service]);

  const installSkill = useCallback(async (skill: AgentSkill) => {
    if (!agentId) return;
    try {
      const saved = await service.writeAgentSkill({ agentId, skill });
      setMind(prev => prev ? { ...prev, skills: [...prev.skills.filter(s => s.id !== saved.id), saved] } : null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to install skill.");
    }
  }, [agentId, service]);

  const removeSkill = useCallback(async (skillId: string) => {
    if (!agentId) return;
    try {
      await service.removeAgentSkill({ agentId, skillId });
      setMind(prev => prev ? { ...prev, skills: prev.skills.filter(s => s.id !== skillId) } : null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to remove skill.");
    }
  }, [agentId, service]);

  return { mind, loading, error, saveMemory, installSkill, removeSkill, reload: () => agentId && loadMind(agentId) };
}
