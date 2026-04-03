import { useState, useCallback } from "react";
import { loadState, saveState, generateId } from "../lib/storage";
import type { DashboardState, Task, TaskPhase, PartnerTask, PartnerStatus, DriveLink, LogEntry, Comment } from "../types";

function useLocalState<T>(key: string, init: T) {
  void key;
  return useState<T>(init);
}
void useLocalState;

export function useDashboard() {
  const [state, setStateRaw] = useState<DashboardState>(() => loadState());

  const setState = useCallback((updater: (prev: DashboardState) => DashboardState) => {
    setStateRaw((prev) => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  const toggleTask = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  }, [setState]);

  const addTask = useCallback((title: string, phase: TaskPhase) => {
    const newTask: Task = {
      id: generateId(),
      title,
      phase,
      completed: false,
      comments: [],
    };
    setState((s) => ({ ...s, tasks: [...s.tasks, newTask] }));
  }, [setState]);

  const addMultipleTasks = useCallback((newTasks: { title: string; phase: TaskPhase }[]) => {
    const tasks: Task[] = newTasks.map((t) => ({
      id: generateId(),
      title: t.title,
      phase: t.phase,
      completed: false,
      comments: [],
    }));
    setState((s) => ({ ...s, tasks: [...s.tasks, ...tasks] }));
  }, [setState]);

  const updateTask = useCallback((id: string, title: string, phase: TaskPhase) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, title, phase } : t)),
    }));
  }, [setState]);

  const deleteTask = useCallback((id: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  }, [setState]);

  const addComment = useCallback((taskId: string, text: string, author: "partner" | "boss") => {
    const comment: Comment = {
      id: generateId(),
      author,
      authorName: author === "partner" ? "나 (파트너)" : "마시떡 사장님",
      text,
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, comments: [...t.comments, comment] } : t
      ),
    }));
  }, [setState]);

  const updatePartnerTask = useCallback((id: string, updates: Partial<Pick<PartnerTask, "status" | "current" | "total" | "title">>) => {
    setState((s) => ({
      ...s,
      partnerTasks: s.partnerTasks.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  }, [setState]);

  const addPartnerTask = useCallback((title: string, total: number, unit: string) => {
    const newTask: PartnerTask = {
      id: generateId(),
      title,
      status: "지시완료",
      current: 0,
      total,
      unit,
    };
    setState((s) => ({ ...s, partnerTasks: [...s.partnerTasks, newTask] }));
  }, [setState]);

  const deletePartnerTask = useCallback((id: string) => {
    setState((s) => ({ ...s, partnerTasks: s.partnerTasks.filter((p) => p.id !== id) }));
  }, [setState]);

  const updateDriveLink = useCallback((id: string, url: string) => {
    setState((s) => ({
      ...s,
      driveLinks: s.driveLinks.map((d) => (d.id === id ? { ...d, url } : d)),
    }));
  }, [setState]);

  const updateDriveLinkLabel = useCallback((id: string, label: string) => {
    setState((s) => ({
      ...s,
      driveLinks: s.driveLinks.map((d) => (d.id === id ? { ...d, label } : d)),
    }));
  }, [setState]);

  const addDriveLink = useCallback((label: string, url: string) => {
    const newLink: DriveLink = { id: generateId(), label, url };
    setState((s) => ({ ...s, driveLinks: [...s.driveLinks, newLink] }));
  }, [setState]);

  const deleteDriveLink = useCallback((id: string) => {
    setState((s) => ({ ...s, driveLinks: s.driveLinks.filter((d) => d.id !== id) }));
  }, [setState]);

  const addLog = useCallback((text: string) => {
    const entry: LogEntry = {
      id: generateId(),
      text,
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, logs: [entry, ...s.logs] }));
  }, [setState]);

  const deleteLog = useCallback((id: string) => {
    setState((s) => ({ ...s, logs: s.logs.filter((l) => l.id !== id) }));
  }, [setState]);

  const myProgress = state.tasks.length > 0
    ? Math.round((state.tasks.filter((t) => t.completed).length / state.tasks.length) * 100)
    : 0;

  const partnerProgress = (() => {
    const totalItems = state.partnerTasks.reduce((a, p) => a + p.total, 0);
    const doneItems = state.partnerTasks.reduce((a, p) => a + p.current, 0);
    return totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;
  })();

  return {
    state,
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
  };
}
