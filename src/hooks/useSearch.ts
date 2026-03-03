import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

type ApiEnvelope<T> = { success: boolean; data: T; message?: string; error?: string };

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export function useGlobalSearch(q: string) {
  const trimmed = useMemo(() => q.trim(), [q]);
  const debounced = useDebouncedValue(trimmed, 300);

  return useQuery({
    queryKey: ["globalSearch", debounced],
    enabled: debounced.length >= 2,
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<{ users: any[]; posts: any[]; opportunities: any[] }>>("/search", {
        params: { q: debounced },
      });
      return res.data.data;
    },
  });
}

