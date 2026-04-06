import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export interface SalesEntry {
  id: string;
  date: string;
  naverGross: number;
  naverRefund: number;
  naverNet: number;
  coupangGross: number;
  coupangRefund: number;
  coupangNet: number;
  totalNet: number;
  memo: string;
}

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export function useSales() {
  const queryClient = useQueryClient();

  const { data: history = [], isLoading: historyLoading } = useQuery<SalesEntry[]>({
    queryKey: ["sales-history"],
    queryFn: () => apiFetch("/sales"),
    staleTime: 30000,
  });

  const { data: today, isLoading: todayLoading } = useQuery<SalesEntry>({
    queryKey: ["sales-today"],
    queryFn: () => apiFetch("/sales/today"),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const updateToday = useCallback(
    async (updates: Partial<Pick<SalesEntry, "naverGross" | "naverRefund" | "coupangGross" | "coupangRefund" | "memo">>) => {
      if (!today) return;
      const updated = await apiFetch(`/sales/${today.id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      queryClient.setQueryData<SalesEntry>(["sales-today"], updated);
      queryClient.invalidateQueries({ queryKey: ["sales-history"] });
    },
    [today, queryClient]
  );

  return {
    today,
    history,
    isLoading: historyLoading || todayLoading,
    updateToday,
  };
}
