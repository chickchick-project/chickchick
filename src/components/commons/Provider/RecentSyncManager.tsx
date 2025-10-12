"use client";

import { useRecentItemsSync } from "@/lib/hooks/useRecentItemsSync";
import { useRecentPerfumesStore } from "@/lib/stores/useRecentPerfumesStore";
import { useRecentPostsStore } from "@/lib/stores/useRecentPostsStore";

function RecentSyncManager() {
  // 최근 본 향수 목록 동기화
  useRecentItemsSync({
    useStore: useRecentPerfumesStore,
    apiEndpoint: "recent-perfumes",
  });
  // 최근 본 게시글 목록 동기화
  useRecentItemsSync({
    useStore: useRecentPostsStore,
    apiEndpoint: "recent-posts",
  });

  return null;
}

export default RecentSyncManager;
