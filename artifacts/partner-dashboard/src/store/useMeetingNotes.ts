import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export interface MeetingNote {
  id: string;
  date: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
}

const QUERY_KEY = ["meetingNotes"];

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

export function useMeetingNotes() {
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery<MeetingNote[]>({
    queryKey: QUERY_KEY,
    queryFn: () => apiFetch("/dashboard/notes"),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  }, [queryClient]);

  const addNote = useCallback(
    async (date: string, title: string, content: string) => {
      const tempId = genId();
      const tempNote: MeetingNote = { id: tempId, date, title, content, pinned: false, createdAt: new Date().toISOString() };
      queryClient.setQueryData<MeetingNote[]>(QUERY_KEY, (prev = []) => [tempNote, ...prev]);
      await apiFetch("/dashboard/notes", {
        method: "POST",
        body: JSON.stringify({ date, title, content }),
      });
      invalidate();
    },
    [queryClient, invalidate]
  );

  const updateNote = useCallback(
    async (id: string, fields: Partial<Pick<MeetingNote, "date" | "title" | "content" | "pinned">>) => {
      queryClient.setQueryData<MeetingNote[]>(QUERY_KEY, (prev = []) =>
        prev.map((n) => (n.id === id ? { ...n, ...fields } : n))
      );
      await apiFetch(`/dashboard/notes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(fields),
      });
      invalidate();
    },
    [queryClient, invalidate]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      queryClient.setQueryData<MeetingNote[]>(QUERY_KEY, (prev = []) => prev.filter((n) => n.id !== id));
      await apiFetch(`/dashboard/notes/${id}`, { method: "DELETE" });
    },
    [queryClient]
  );

  const pinnedNotes = notes.filter((n) => n.pinned);
  const regularNotes = notes.filter((n) => !n.pinned);

  return { notes, pinnedNotes, regularNotes, isLoading, addNote, updateNote, deleteNote };
}
