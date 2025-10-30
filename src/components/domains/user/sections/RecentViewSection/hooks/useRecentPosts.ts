import { useMemo } from "react";
import { useRecentPostsStore } from "@/lib/stores/useRecentPostsStore";
import { useFooterPagination } from "./useFooterPagination";
import type { ApiPostDetailResponse } from "@/lib/hono/schemas/community.schema";

interface PostForCard extends Omit<ApiPostDetailResponse, "userId"> {
  userId: string;
}

const POSTS_PER_VIEW = 2;

export const useRecentPosts = (isTabletOrLarger: boolean | undefined) => {
  const recentPostItems = useRecentPostsStore((s) => s.items);
  const postsHydrated = useRecentPostsStore((s) => s._hasHydrated);

  const pagination = useFooterPagination({
    items: recentPostItems,
    itemsPerPage: POSTS_PER_VIEW,
    enabled: isTabletOrLarger === true,
  });

  const postsForCards = useMemo(() => {
    return pagination.visibleItems.map((ri) => {
      const postForCard: PostForCard = {
        ...ri.item,
        userId: ri.item.author.id,
      };
      return {
        id: ri.id,
        post: postForCard,
        updatedAt: ri.item.updatedAt ?? ri.item.createdAt,
      };
    });
  }, [pagination.visibleItems]);

  return {
    posts: postsForCards,
    isEmpty: recentPostItems.length === 0,
    isHydrated: postsHydrated,
    pagination: {
      hasPrev: pagination.hasPrev,
      hasNext: pagination.hasNext,
      handlePrev: pagination.handlePrev,
      handleNext: pagination.handleNext,
    },
  };
};
