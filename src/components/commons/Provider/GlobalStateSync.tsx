"use client";

import { useEffect } from "react";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { useUserStore } from "@/lib/stores/useUserStore";

//전역으로 사용하는 상태 동기화
export default function GlobalStateSync() {
  // HttpOnly 쿠키는 JavaScript에서 접근 불가능하므로, 항상 API를 호출하고
  // 401 응답이 오면 세션이 없는 것으로 판단합니다.
  const { data: userProfile, isLoading, error } = useUserProfile();
  const setUser = useUserStore((state) => state.setUser);
  const zustandUser = useUserStore((state) => state.user);

  useEffect(() => {
    // API 에러가 발생하면 (401 등) 유저를 null로 설정
    if (error) {
      if (zustandUser !== null) {
        setUser(null);
      }
      return;
    }

    // 유저 프로필 데이터가 변경되면 업데이트
    if (JSON.stringify(userProfile) !== JSON.stringify(zustandUser)) {
      setUser(userProfile ?? null);
    }
  }, [isLoading, userProfile, error, setUser, zustandUser]);

  return null;
}
