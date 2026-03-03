import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

type ApiEnvelope<T> = { success: boolean; data: T; message?: string; error?: string };

export function useSearchUsers(query: string, skills: string[]) {
  const skillsParam = skills.length ? skills.join(",") : "";
  return useQuery({
    queryKey: ["userSearch", query, skillsParam],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<{ users: any[] }>>("/users/search", {
        params: { q: query || undefined, skills: skillsParam || undefined },
      });
      return res.data.data.users;
    },
  });
}

export function useUser(id: string | null) {
  return useQuery({
    queryKey: ["user", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<{ user: any }>>(`/users/${id}`);
      return res.data.data.user;
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; data: Record<string, any> }) => {
      const res = await api.put<ApiEnvelope<{ user: any }>>(`/users/${payload.id}`, payload.data);
      return res.data.data.user;
    },
    onSuccess: async (user) => {
      await qc.invalidateQueries({ queryKey: ["user", user.id] });
      await qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

