import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { getToken, removeToken, removeUser, saveToken, saveUser } from "@/lib/auth";

type ApiEnvelope<T> = { success: boolean; data: T; message?: string; error?: string };

export function useLogin() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const res = await api.post<ApiEnvelope<{ token: string; user: any }>>("/auth/login", payload);
      return res.data;
    },
    onSuccess: (resp) => {
      if (!resp.success) return;
      saveToken(resp.data.token);
      saveUser(resp.data.user);
      navigate("/feed", { replace: true });
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (payload: {
      fullName: string;
      email: string;
      phone?: string;
      password: string;
      college: string;
      degree: string;
      skills: string[];
    }) => {
      const res = await api.post<ApiEnvelope<{ token: string; user: any }>>("/auth/register", payload);
      return res.data;
    },
    onSuccess: (resp) => {
      if (!resp.success) return;
      saveToken(resp.data.token);
      saveUser(resp.data.user);
      navigate("/feed", { replace: true });
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  return () => {
    removeToken();
    removeUser();
    navigate("/login", { replace: true });
  };
}

export function useMe() {
  const token = getToken();
  return useQuery({
    queryKey: ["me"],
    enabled: !!token,
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<{ user: any }>>("/auth/me");
      return res.data.data.user;
    },
  });
}

