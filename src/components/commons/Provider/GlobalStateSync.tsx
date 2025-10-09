"use client";

import { useEffect } from "react";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { useUserStore } from "@/lib/stores/useUserStore";

//전역으로 사용하는 상태 동기화
export default function GlobalStateSync() {
  const { data: userProfile, isLoading } = useUserProfile();
  const setUser = useUserStore((state) => state.setUser);
  const zustandUser = useUserStore((state) => state.user);

  useEffect(() => {
    if (JSON.stringify(userProfile) !== JSON.stringify(zustandUser)) {
      setUser(userProfile ?? null);
    }
  }, [isLoading, userProfile, setUser, zustandUser]);

  return null;
}
