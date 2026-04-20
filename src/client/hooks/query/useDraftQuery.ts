import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { draftApi } from "@/client/utils/api/draft.api";
import { queryKeys } from "@/client/utils/queryKeys";
import { CreateDraftBody, DraftType } from "@/server/hono/schemas/draft.schema";

/**
 * 임시 저장 생성/업데이트 Mutation Hook
 */
export const useCreateDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draftData: CreateDraftBody) => draftApi.create(draftData),
    onSuccess: (data) => {
      if (data?.data?.type) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.drafts.byType(data.data.type),
        });
      }
    },
  });
};

/**
 * 특정 임시 저장 조회 Query Hook
 */
export const useDraft = (id: string) => {
  return useQuery({
    queryKey: queryKeys.drafts.detail(id),
    queryFn: async () => {
      try {
        const response = await draftApi.get(id);
        if (!response || !response.success) {
          return null;
        }
        return response.data;
      } catch (error) {
        console.error("Failed to fetch draft:", error);
        return null;
      }
    },
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
  });
};

/**
 * 임시 저장 삭제 Mutation Hook
 */
export const useDeleteDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return draftApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.drafts.all,
      });
    },
  });
};

/**
 * 타입별 임시 저장 조회 Query Hook
 * @param type - CREATE: 새 글 작성용, UPDATE: 글 수정용
 * @param enabled - 쿼리 활성화 여부 (기본값: true)
 */
export const useDraftByType = (type: DraftType, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.drafts.byType(type),
    queryFn: async () => {
      try {
        const response = await draftApi.list(type);
        if (!response || !response.success) return null;
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch ${type} draft:`, error);
        return null;
      }
    },
    enabled,
    staleTime: 0,
    gcTime: 0,
  });
};

/**
 * postId로 UPDATE 타입 임시 저장 조회 Query Hook
 * @param postId - 게시글 ID
 * @param enabled - 쿼리 활성화 여부 (기본값: true)
 */
export const useDraftByPostId = (postId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.drafts.byPostId(postId),
    queryFn: async () => {
      try {
        const response = await draftApi.list(DraftType.UPDATE);
        if (!response || !response.success) return null;
        // UPDATE draft는 유저당 1개 — postId만 확인
        const draft = response.data;
        return draft?.postId === postId ? draft : null;
      } catch (error) {
        console.error(`[useDraftByPostId] 오류 for postId ${postId}:`, error);
        return null;
      }
    },
    enabled: enabled && !!postId,
    staleTime: 0,
    gcTime: 0,
  });
};
