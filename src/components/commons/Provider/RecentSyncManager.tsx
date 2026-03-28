"use client";

import { useEffect } from "react";
import { useRecentItemsSync } from "@/client/hooks/useRecentItemsSync";
import { useRecentPerfumesStore } from "@/client/stores/perfumeStore";
import { useRecentPostsStore } from "@/client/stores/perfumeStore";
import { useUserStore } from "@/client/stores/useUserStore";
import { pointApi } from "@/client/utils/api/points.api";

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

  // 일일 로그인 체크
  useEffect(() => {
    if (!shouldSync) return;

    const checkDailyLogin = async () => {
      try {
        const lastCheck = localStorage.getItem("lastLoginCheck");
        const today = new Date().toDateString();

        if (lastCheck === today) return;

        const response = await pointApi.processLogin();
        if (response?.success) {
          localStorage.setItem("lastLoginCheck", today);
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("❌ [Daily Login] Failed:", error);
        }
      }
    };

    checkDailyLogin();
  }, [shouldSync]);

  return null;
}

export default RecentSyncManager;
