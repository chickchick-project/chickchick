import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { collectionApi } from "../../utils/api/collections.api";
import { queryKeys } from "../../utils/queryKeys";
import type { UploadedImageInfo } from "@/lib/hono/schemas/common.schema";

interface CreateCollectionParams {
  perfumeId: string;
  imageInfo: UploadedImageInfo;
  comment?: string;
}

// 컬렉션 추가 시 향수 검색
export const useCollectionPerfumeSearch = (query: string) => {
  return useQuery({
    queryKey: ["collection", "search", query],
    queryFn: () => collectionApi.searchPerfumes(query),
    enabled: !!query && query.trim().length > 0,
  });
};

/**
 * 컬렉션 생성/수정/삭제를 위한 mutation hook
 * - TanStack Query의 쿼리 무효화를 통해 자동으로 UI 업데이트
 * - 옵티미스틱 업데이트로 즉각적인 사용자 피드백 제공
 */
export const useCollectionMutation = (userId?: string) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: ({ perfumeId, imageInfo, comment }: CreateCollectionParams) =>
      collectionApi.create(perfumeId, imageInfo, comment),

    // 옵티미스틱 업데이트: 서버 응답 전에 UI를 먼저 업데이트
    onMutate: async () => {
      // 진행 중인 쿼리들을 취소하여 옵티미스틱 업데이트를 덮어쓰지 않도록 함
      await queryClient.cancelQueries({
        queryKey: queryKeys.user.collections.all(),
      });

      // 이전 데이터를 백업 (롤백용)
      const previousCollections = queryClient.getQueryData(
        queryKeys.user.collections.byUserId(userId ?? "me")
      );

      // 옵티미스틱 업데이트 적용
      // 실제로는 새로운 컬렉션을 캐시에 추가할 수 있지만,
      // 서버에서 생성된 ID 등이 필요하므로 여기서는 스킵하고
      // 단순히 무효화만 사용

      return { previousCollections };
    },

    onSuccess: () => {
      // 모든 컬렉션 쿼리 무효화 - 자동으로 리프레시됨
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.collections.all(),
      });

      // 현재 사용자의 컬렉션도 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.collections.byUserId(userId ?? "me"),
      });
    },

    onError: (error, _newCollection, context) => {
      // 에러 발생 시 이전 상태로 롤백
      if (context?.previousCollections) {
        queryClient.setQueryData(
          queryKeys.user.collections.byUserId(userId ?? "me"),
          context.previousCollections
        );
      }
      console.error("컬렉션 생성 실패:", error);
    },

    onSettled: () => {
      // 성공/실패 여부와 관계없이 최종적으로 쿼리 무효화하여 서버 상태와 동기화
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.collections.all(),
      });
    },
  });

  return { createMutation };
};
