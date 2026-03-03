import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

type ApiEnvelope<T> = { success: boolean; data: T; message?: string; error?: string };

export function usePosts(limit = 10) {
  return useInfiniteQuery({
    queryKey: ["posts", { limit }],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await api.get<ApiEnvelope<{ posts: any[]; page: number; limit: number }>>("/posts", {
        params: { page: pageParam, limit },
      });
      return res.data.data;
    },
    getNextPageParam: (lastPage) => (lastPage.posts.length === lastPage.limit ? lastPage.page + 1 : undefined),
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { content: string; imageUrl?: string; linkUrl?: string }) => {
      const res = await api.post<ApiEnvelope<{ post: any }>>("/posts", payload);
      return res.data.data.post;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useLikePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await api.post<ApiEnvelope<{ liked: boolean }>>(`/posts/${postId}/like`);
      return res.data.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUnlikePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await api.delete<ApiEnvelope<{ liked: boolean }>>(`/posts/${postId}/like`);
      return res.data.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function usePostComments(postId: string) {
  return useQuery({
    queryKey: ["postComments", postId],
    enabled: !!postId,
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<{ comments: any[] }>>(`/posts/${postId}/comments`);
      return res.data.data.comments;
    },
  });
}

export function useAddComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { postId: string; content: string }) => {
      const res = await api.post<ApiEnvelope<{ comment: any }>>(`/posts/${payload.postId}/comments`, {
        content: payload.content,
      });
      return res.data.data.comment;
    },
    onSuccess: async (_data, variables) => {
      await qc.invalidateQueries({ queryKey: ["postComments", variables.postId] });
      await qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

