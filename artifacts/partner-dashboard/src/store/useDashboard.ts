import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { DashboardState, TaskPhase, PartnerStatus } from "../types";

const QUERY_KEY = ["dashboard"];

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useDashboard() {
  const queryClient = useQueryClient();

  const { data: state, isLoading } = useQuery<DashboardState>({
    queryKey: QUERY_KEY,
    queryFn: () => apiFetch("/dashboard"),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  }, [queryClient]);

  // optimistic update helper
  const optimistic = useCallback(
    (updater: (prev: DashboardState) => DashboardState) => {
      queryClient.setQueryData<DashboardState>(QUERY_KEY, (prev) =>
        prev ? updater(prev) : prev
      );
    },
    [queryClient]
  );

  const toggleTask = useCallback(
    async (id: string) => {
      const prev = queryClient.getQueryData<DashboardState>(QUERY_KEY);
      const task = prev?.tasks.find((t) => t.id === id);
      if (!task) return;
      const completed = !task.completed;
      optimistic((s) => ({
        ...s,
        tasks: s.tasks.map((t) => (t.id === id ? { ...t, completed } : t)),
      }));
      await apiFetch(`/dashboard/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ completed }),
      });
    },
    [queryClient, optimistic]
  );

  const addTask = useCallback(
    async (title: string, phase: TaskPhase) => {
      const tmpId = genId();
      optimistic((s) => ({
        ...s,
        tasks: [...s.tasks, { id: tmpId, title, phase, completed: false, comments: [] }],
      }));
      await apiFetch("/dashboard/tasks", {
        method: "POST",
        body: JSON.stringify({ title, phase }),
      });
      invalidate();
    },
    [optimistic, invalidate]
  );

  const addMultipleTasks = useCallback(
    async (newTasks: { title: string; phase: TaskPhase }[]) => {
      for (const t of newTasks) {
        await apiFetch("/dashboard/tasks", {
          method: "POST",
          body: JSON.stringify({ title: t.title, phase: t.phase }),
        });
      }
      invalidate();
    },
    [invalidate]
  );

  const updateTask = useCallback(
    async (id: string, title: string, phase: TaskPhase) => {
      optimistic((s) => ({
        ...s,
        tasks: s.tasks.map((t) => (t.id === id ? { ...t, title, phase } : t)),
      }));
      await apiFetch(`/dashboard/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ title, phase }),
      });
    },
    [optimistic]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      optimistic((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
      await apiFetch(`/dashboard/tasks/${id}`, { method: "DELETE" });
    },
    [optimistic]
  );

  const addComment = useCallback(
    async (taskId: string, text: string, author: "partner" | "boss") => {
      const authorName = author === "partner" ? "나 (파트너)" : "마시떡 사장님";
      const comment = await apiFetch(`/dashboard/tasks/${taskId}/comments`, {
        method: "POST",
        body: JSON.stringify({ author, authorName, text }),
      });
      optimistic((s) => ({
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === taskId ? { ...t, comments: [...t.comments, comment] } : t
        ),
      }));
    },
    [optimistic]
  );

  const updatePartnerTask = useCallback(
    async (id: string, updates: Partial<Pick<{ status: PartnerStatus; current: number; total: number; title: string }, "status" | "current" | "total" | "title">>) => {
      optimistic((s) => ({
        ...s,
        partnerTasks: s.partnerTasks.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      }));
      await apiFetch(`/dashboard/partner-tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    },
    [optimistic]
  );

  const addPartnerTask = useCallback(
    async (title: string, total: number, unit: string) => {
      await apiFetch("/dashboard/partner-tasks", {
        method: "POST",
        body: JSON.stringify({ title, total, unit }),
      });
      invalidate();
    },
    [invalidate]
  );

  const deletePartnerTask = useCallback(
    async (id: string) => {
      optimistic((s) => ({ ...s, partnerTasks: s.partnerTasks.filter((p) => p.id !== id) }));
      await apiFetch(`/dashboard/partner-tasks/${id}`, { method: "DELETE" });
    },
    [optimistic]
  );

  const updateDriveLink = useCallback(
    async (id: string, url: string) => {
      optimistic((s) => ({
        ...s,
        driveLinks: s.driveLinks.map((d) => (d.id === id ? { ...d, url } : d)),
      }));
      await apiFetch(`/dashboard/drive-links/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ url }),
      });
    },
    [optimistic]
  );

  const updateDriveLinkLabel = useCallback(
    async (id: string, label: string) => {
      optimistic((s) => ({
        ...s,
        driveLinks: s.driveLinks.map((d) => (d.id === id ? { ...d, label } : d)),
      }));
      await apiFetch(`/dashboard/drive-links/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ label }),
      });
    },
    [optimistic]
  );

  const addDriveLink = useCallback(
    async (label: string, url: string) => {
      await apiFetch("/dashboard/drive-links", {
        method: "POST",
        body: JSON.stringify({ label, url }),
      });
      invalidate();
    },
    [invalidate]
  );

  const deleteDriveLink = useCallback(
    async (id: string) => {
      optimistic((s) => ({ ...s, driveLinks: s.driveLinks.filter((d) => d.id !== id) }));
      await apiFetch(`/dashboard/drive-links/${id}`, { method: "DELETE" });
    },
    [optimistic]
  );

  const reorderTasks = useCallback(
    async (orderedIds: string[]) => {
      optimistic((s) => {
        const idToTask = Object.fromEntries(s.tasks.map((t) => [t.id, t]));
        const reordered = orderedIds.map((id) => idToTask[id]).filter(Boolean) as typeof s.tasks;
        const rest = s.tasks.filter((t) => !orderedIds.includes(t.id));
        return { ...s, tasks: [...reordered, ...rest] };
      });
      await apiFetch("/dashboard/tasks/reorder", {
        method: "POST",
        body: JSON.stringify({ orderedIds }),
      });
    },
    [optimistic]
  );

  const reorderPartnerTasks = useCallback(
    async (orderedIds: string[]) => {
      optimistic((s) => {
        const idToTask = Object.fromEntries(s.partnerTasks.map((t) => [t.id, t]));
        const reordered = orderedIds.map((id) => idToTask[id]).filter(Boolean) as typeof s.partnerTasks;
        return { ...s, partnerTasks: reordered };
      });
      await apiFetch("/dashboard/partner-tasks/reorder", {
        method: "POST",
        body: JSON.stringify({ orderedIds }),
      });
    },
    [optimistic]
  );

  const addLog = useCallback(
    async (text: string) => {
      const log = await apiFetch("/dashboard/logs", {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      optimistic((s) => ({ ...s, logs: [log, ...s.logs] }));
    },
    [optimistic]
  );

  const deleteLog = useCallback(
    async (id: string) => {
      optimistic((s) => ({ ...s, logs: s.logs.filter((l) => l.id !== id) }));
      await apiFetch(`/dashboard/logs/${id}`, { method: "DELETE" });
    },
    [optimistic]
  );

  const emptyState: DashboardState = { tasks: [], partnerTasks: [], driveLinks: [], logs: [] };
  const resolvedState = state ?? emptyState;

  const myProgress =
    resolvedState.tasks.length > 0
      ? Math.round(
          (resolvedState.tasks.filter((t) => t.completed).length /
            resolvedState.tasks.length) *
            100
        )
      : 0;

  const partnerProgress = (() => {
    const totalItems = resolvedState.partnerTasks.reduce((a, p) => a + p.total, 0);
    const doneItems = resolvedState.partnerTasks.reduce((a, p) => a + p.current, 0);
    return totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;
  })();

  return {
    state: resolvedState,
    isLoading,
    myProgress,
    partnerProgress,
    toggleTask,
    addTask,
    addMultipleTasks,
    updateTask,
    deleteTask,
    addComment,
    updatePartnerTask,
    addPartnerTask,
    deletePartnerTask,
    updateDriveLink,
    updateDriveLinkLabel,
    addDriveLink,
    deleteDriveLink,
    addLog,
    deleteLog,
    reorderTasks,
    reorderPartnerTasks,
  };
}
