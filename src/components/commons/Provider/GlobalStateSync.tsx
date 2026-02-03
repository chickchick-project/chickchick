"use client";

import { useEffect, useState } from "react";
import { useUserProfile } from "@/lib/hooks/query/useUserQuery";
import { useUserStore } from "@/lib/stores/useUserStore";
import { pointApi } from "@/lib/utils/api/points.api";

/**
 * 클라이언트에서 세션 토큰 존재 여부 확인
 */
function hasSessionToken(): boolean {
  if (typeof document === "undefined") return false;
  return (
    document.cookie.includes("authjs.session-token=") ||
    document.cookie.includes("__Secure-authjs.session-token=")
  );
}

//전역으로 사용하는 상태 동기화
export default function GlobalStateSync() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { setUser, reset } = useUserStore();

  // 클라이언트에서만 세션 체크
  useEffect(() => {
    const hasSession = hasSessionToken();
    setIsLoggedIn(hasSession);

    // 세션이 없으면 즉시 사용자 상태 초기화
    if (!hasSession) {
      reset();
    }
  }, [reset]);

  // 로그인된 사용자만 프로필 조회
  const { data: userProfile, isFetched } = useUserProfile({
    enabled: isLoggedIn,
  });

  // 사용자 프로필 동기화
  useEffect(() => {
    if (isFetched) {
      if (userProfile) {
        setUser(userProfile);
      } else {
        reset();
      }
    }
  }, [isFetched, userProfile, setUser, reset]);

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
