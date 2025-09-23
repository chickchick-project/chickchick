"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserCollections } from "../../user.helper";
import { useEffect, useCallback } from "react";
import { CollectionItem } from "../sections.type";

/**
 * 특정 사용자의 컬렉션 목록을 조회하는 React Query 커스텀 훅입니다.
 * 실시간 업데이트를 지원합니다.
 * @param userId - 컬렉션을 조회할 사용자의 ID
 */
export const useUserCollections = (userId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["collections", userId],
    queryFn: () => fetchUserCollections(userId),
    enabled: !!userId,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 신선하게 유지
  });

  // 데이터 무효화 함수 (즉시 리페치)
  const invalidateCollections = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["collections", userId],
    });
  }, [queryClient, userId]);

  // 새로운 컬렉션 추가 후 호출할 함수 (백그라운드에서 리페치)
  const refreshCollections = useCallback(() => {
    queryClient.refetchQueries({
      queryKey: ["collections", userId],
    });
  }, [queryClient, userId]);

  // 옵티미스틱 업데이트 함수 (새 아이템 추가)
  const addCollectionOptimistic = useCallback((newCollection: CollectionItem) => {
    queryClient.setQueryData(["collections", userId], (oldData: { data: CollectionItem[] } | undefined) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        data: [newCollection, ...oldData.data],
      };
    });
  }, [queryClient, userId]);

  // 옵티미스틱 업데이트 함수 (아이템 제거)
  const removeCollectionOptimistic = useCallback((collectionId: string) => {
    queryClient.setQueryData(["collections", userId], (oldData: { data: CollectionItem[] } | undefined) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        data: oldData.data.filter((item: CollectionItem) => item.id !== collectionId),
      };
    });
  }, [queryClient, userId]);

  // 전역 이벤트 리스너로 다른 컴포넌트에서 발생한 변경사항 감지
  useEffect(() => {
    const handleCollectionAdded = (event: CustomEvent) => {
      const newCollection = event.detail;
      if (newCollection) {
        addCollectionOptimistic(newCollection);
      } else {
        invalidateCollections();
      }
    };

    const handleCollectionRemoved = (event: CustomEvent) => {
      const collectionId = event.detail?.id;
      if (collectionId) {
        removeCollectionOptimistic(collectionId);
      } else {
        invalidateCollections();
      }
    };

    const handleCollectionUpdate = () => {
      invalidateCollections();
    };

    // 커스텀 이벤트 리스너 등록
    window.addEventListener("collection-added", handleCollectionAdded as EventListener);
    window.addEventListener("collection-removed", handleCollectionRemoved as EventListener);
    window.addEventListener("collection-updated", handleCollectionUpdate);

    return () => {
      window.removeEventListener("collection-added", handleCollectionAdded as EventListener);
      window.removeEventListener("collection-removed", handleCollectionRemoved as EventListener);
      window.removeEventListener("collection-updated", handleCollectionUpdate);
    };
  }, [addCollectionOptimistic, removeCollectionOptimistic, invalidateCollections]);

  return {
    ...query,
    invalidateCollections,
    refreshCollections,
    addCollectionOptimistic,
    removeCollectionOptimistic,
  };
};
