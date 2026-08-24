import { useState, useEffect, useCallback } from "react";
import type { Routine } from "@/types";
import { getService } from "@/services";

export function useRoutines() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = getService();

  const loadRoutines = useCallback(async () => {
    setLoading(true);
    try {
      const list = await service.listRoutines();
      setRoutines(list);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load routines.");
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    loadRoutines();
  }, [loadRoutines]);

  const createRoutine = useCallback(async (routine: Omit<Routine, "id">) => {
    try {
      const created = await service.createRoutine(routine);
      setRoutines(prev => [...prev, created]);
      return created;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Routine creation failed.");
      throw err;
    }
  }, [service]);

  const toggleEnabled = useCallback(async (routine: Routine) => {
    try {
      const updated = await service.setRoutineEnabled({
        routineId: routine.id,
        agentId: routine.agentId,
        enabled: !routine.enabled
      });
      setRoutines(prev => prev.map(r => r.id === updated.id ? updated : r));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to toggle routine.");
    }
  }, [service]);

  const deleteRoutine = useCallback(async (routine: Routine) => {
    try {
      await service.deleteRoutine({ routineId: routine.id, agentId: routine.agentId });
      setRoutines(prev => prev.filter(r => r.id !== routine.id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete routine.");
    }
  }, [service]);

  return { routines, loading, error, createRoutine, toggleEnabled, deleteRoutine, reload: loadRoutines };
}
