import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { draftApi } from "@/client/utils/api/draft.api";
import { queryKeys } from "@/client/utils/queryKeys";
import { CreateDraftBody } from "@/server/hono/schemas/draft.schema";
import { DraftType } from "@prisma/client";

/**
 * 임시 저장 생성/업데이트 Mutation Hook
 */
export const useCreateDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draftData: CreateDraftBody) => draftApi.create(draftData),
    onSuccess: (data) => {
      // 임시 저장 목록 무효화하여 최신 데이터 반영
      queryClient.invalidateQueries({
        queryKey: queryKeys.drafts.list(),
      });
      // 타입별 쿼리도 무효화
      if (data?.data?.type) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.drafts.byType(data.data.type),
        });
      }
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
    staleTime: 0,
    gcTime: 0,
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
    onSuccess: (_data, deletedId) => {
      console.log("[useDeleteDraft] 삭제 성공:", deletedId);

      // 모든 drafts 관련 쿼리 무효화 (가장 강력한 방법)
      queryClient.invalidateQueries({
        queryKey: queryKeys.drafts.all,
      });

      // 추가로 명시적으로 각 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.drafts.list(),
      });

      // UPDATE 타입 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.drafts.byType(DraftType.UPDATE),
      });

      // 모든 byPostId 쿼리 제거 (패턴 매칭)
      queryClient.removeQueries({
        predicate: (query) => {
          const key = query.queryKey;
          return (
            Array.isArray(key) && key[0] === "drafts" && key[1] === "postId"
          );
        },
      });
    },
    onError: (error) => {
      console.error("[useDeleteDraft] 삭제 실패:", error);
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
        const response = await draftApi.list();
        if (!response || !response.success) {
          return null;
        }
        // 타입에 맞는 draft 찾기 (userId, type unique constraint로 1개만 존재)
        const draft = response.data.find((d) => d.type === type);
        return draft || null;
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
      console.log(`[useDraftByPostId] Fetch 시작 for postId: ${postId}`);
      try {
        const response = await draftApi.list();
        if (!response || !response.success) {
          console.log(`[useDraftByPostId] API 응답 실패`);
          return null;
        }

        // UPDATE 타입이면서 해당 postId를 가진 draft 찾기
        const draft = response.data.find(
          (d) => d.type === DraftType.UPDATE && d.postId === postId,
        );

        return draft || null;
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
