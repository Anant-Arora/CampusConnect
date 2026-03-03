import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

type ApiEnvelope<T> = { success: boolean; data: T; message?: string; error?: string };

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<{ notifications: any[]; unreadCount: number }>>("/notifications");
      return res.data.data;
    },
    refetchInterval: 10000,
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await api.put<ApiEnvelope<{}>>("/notifications/read");
      return res.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

