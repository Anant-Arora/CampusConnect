import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

type ApiEnvelope<T> = { success: boolean; data: T; message?: string; error?: string };

export function useOpportunities(filters: { type?: string | null; search?: string | null; page?: number; limit?: number }) {
  const { type, search, page = 1, limit = 10 } = filters;
  return useQuery({
    queryKey: ["opportunities", { type: type || "", search: search || "", page, limit }],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<{ opportunities: any[]; page: number; limit: number }>>("/opportunities", {
        params: { type: type || undefined, search: search || undefined, page, limit },
      });
      return res.data.data;
    },
  });
}

export function useCreateOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      title: string;
      company: string;
      description: string;
      type: string;
      skills: string[];
      location?: string;
      isRemote?: boolean;
      applyLink?: string;
      deadline?: string;
    }) => {
      const res = await api.post<ApiEnvelope<{ opportunity: any }>>("/opportunities", payload);
      return res.data.data.opportunity;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["opportunities"] });
    },
  });
}

export function useSaveOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (opportunityId: string) => {
      const res = await api.post<ApiEnvelope<{ saved: boolean }>>(`/opportunities/${opportunityId}/save`);
      return res.data.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["opportunities"] });
    },
  });
}

export function useUnsaveOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (opportunityId: string) => {
      const res = await api.delete<ApiEnvelope<{ saved: boolean }>>(`/opportunities/${opportunityId}/save`);
      return res.data.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["opportunities"] });
    },
  });
}

