import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { draftApi } from "@/lib/utils/api/draft.api";
import { queryKeys } from "@/lib/utils/queryKeys";
import { CreateDraftBody } from "@/lib/hono/schemas/draft.schema";

/**
 * 임시 저장 생성/업데이트 Mutation Hook
 */
export const useCreateDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draftData: CreateDraftBody) => draftApi.create(draftData),
    onSuccess: () => {
      // 임시 저장 목록 무효화하여 최신 데이터 반영
      queryClient.invalidateQueries({
        queryKey: queryKeys.drafts.list(),
      });
    },
  });
};

/**
 * 임시 저장 목록 조회 Query Hook
 */
export const useDraftList = () => {
  return useQuery({
    queryKey: queryKeys.drafts.list(),
    queryFn: async () => {
      try {
        const response = await draftApi.list();
        if (!response || !response.success) {
          return [];
        }
        return response.data;
      } catch (error) {
        console.error("Failed to fetch draft list:", error);
        return [];
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
  });
};

/**
 * 임시 저장 삭제 Mutation Hook
 */
export const useDeleteDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => draftApi.delete(id),
    onSuccess: () => {
      // 임시 저장 목록 무효화하여 최신 데이터 반영
      queryClient.invalidateQueries({
        queryKey: queryKeys.drafts.list(),
      });
    },
  });
};
