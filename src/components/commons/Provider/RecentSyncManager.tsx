"use client";

import { useRecentItemsSync } from "@/lib/hooks/useRecentItemsSync";
import { useRecentPerfumesStore } from "@/lib/stores/useRecentPerfumesStore";
import { useRecentPostsStore } from "@/lib/stores/useRecentPostsStore";
import { useUserStore } from "@/lib/stores/useUserStore";

function RecentSyncManager() {
  const { user, isLoading } = useUserStore();

  // 로그인 상태가 확정된 후에만 동기화 활성화
  const shouldSync = !isLoading && user !== null;

  // 최근 본 향수 목록 동기화
  useRecentItemsSync({
    useStore: useRecentPerfumesStore,
    apiEndpoint: "recents/perfumes",
    enabled: shouldSync,
  });
  // 최근 본 게시글 목록 동기화
  useRecentItemsSync({
    useStore: useRecentPostsStore,
    apiEndpoint: "recents/posts",
    enabled: shouldSync,
  });

  return null;
}

export default RecentSyncManager;
