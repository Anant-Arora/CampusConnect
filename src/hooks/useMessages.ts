import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

type ApiEnvelope<T> = { success: boolean; data: T; message?: string; error?: string };

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<{ conversations: any[] }>>("/conversations");
      return res.data.data.conversations;
    },
    refetchInterval: 5000,
  });
}

export function useMessages(conversationId: string | null, page = 1, limit = 30) {
  return useQuery({
    queryKey: ["messages", conversationId, page, limit],
    enabled: !!conversationId,
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<{ messages: any[]; page: number; limit: number }>>(
        `/conversations/${conversationId}/messages`,
        { params: { page, limit } }
      );
      return res.data.data.messages;
    },
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { conversationId: string; content: string }) => {
      const res = await api.post<ApiEnvelope<{ message: any }>>(`/conversations/${payload.conversationId}/messages`, {
        content: payload.content,
      });
      return res.data.data.message;
    },
    onSuccess: async (_data, variables) => {
      await qc.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
      await qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useStartConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { recipientId: string }) => {
      const res = await api.post<ApiEnvelope<{ conversation: any }>>("/conversations", payload);
      return res.data.data.conversation;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

