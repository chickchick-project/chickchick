"use client";

import { useEffect } from "react";
import { useUserProfile } from "@/lib/hooks/query/useUserQuery";
import { useUserStore } from "@/lib/stores/useUserStore";
import { pointApi } from "@/lib/utils/api/points.api";

interface GlobalStateSyncProps {
  isAuthenticated: boolean;
}

//전역으로 사용하는 상태 동기화
export default function GlobalStateSync({ isAuthenticated }: GlobalStateSyncProps) {
  const { setUser, reset } = useUserStore();

  // 서버에서 인증된 경우에만 프로필 조회
  const { data: userProfile, isFetched } = useUserProfile({
    enabled: isAuthenticated,
  });

  // 인증되지 않은 경우 즉시 reset
  useEffect(() => {
    if (!isAuthenticated) {
      reset();
    }
  }, [isAuthenticated, reset]);

  // 사용자 프로필 동기화
  useEffect(() => {
    // 인증된 경우에만 프로필 동기화
    if (isAuthenticated && isFetched) {
      if (userProfile) {
        setUser(userProfile);
      } else {
        reset();
      }
    }
  }, [isAuthenticated, isFetched, userProfile, setUser, reset]);

  // 일일 로그인 체크
  useEffect(() => {
    // 사용자가 로그인하지 않았거나 프로필이 없으면 스킵
    if (!isFetched || !userProfile) {
      return;
    }

    const checkDailyLogin = async () => {
      try {
        const lastCheck = localStorage.getItem("lastLoginCheck");
        const today = new Date().toDateString();

        // 오늘 이미 체크했다면 스킵
        if (lastCheck === today) {
          return;
        }

        // 서버에 로그인 처리 요청
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
  }, [isFetched, userProfile]);

  return null;
}
