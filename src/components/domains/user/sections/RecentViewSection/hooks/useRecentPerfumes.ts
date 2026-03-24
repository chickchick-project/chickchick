import { useMemo } from "react";
import { useRecentPerfumesStore } from "@/client/stores/useRecentPerfumesStore";
import { useFooterPagination } from "./useFooterPagination";

const PERFUMES_PER_VIEW = 5;

export const useRecentPerfumes = (isTabletOrLarger: boolean | undefined) => {
  const recentPerfumeItems = useRecentPerfumesStore((s) => s.items);
  const perfumesHydrated = useRecentPerfumesStore((s) => s._hasHydrated);

  const pagination = useFooterPagination({
    items: recentPerfumeItems,
    itemsPerPage: PERFUMES_PER_VIEW,
    enabled: isTabletOrLarger === true,
  });

  const perfumesForCards = useMemo(() => {
    return pagination.visibleItems.map((ri) => ({
      id: ri.id,
      imageUrl: ri.item.imageUrl,
      brandName: ri.item.brandName,
      perfumeName: ri.item.perfumeName,
    }));
  }, [pagination.visibleItems]);

  return {
    perfumes: perfumesForCards,
    isEmpty: recentPerfumeItems.length === 0,
    isHydrated: perfumesHydrated,
    pagination: {
      hasPrev: pagination.hasPrev,
      hasNext: pagination.hasNext,
      handlePrev: pagination.handlePrev,
      handleNext: pagination.handleNext,
    },
  };
};
