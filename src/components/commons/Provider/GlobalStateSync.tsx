"use client";

import { useEffect } from "react";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { useUserStore } from "@/lib/stores/useUserStore";

//전역으로 사용하는 상태 동기화
export default function GlobalStateSync() {
  const { data: userProfile, isFetched } = useUserProfile();
  const { setUser, reset } = useUserStore();

  useEffect(() => {
    if (isFetched) {
      if (userProfile) {
        setUser(userProfile);
      } else {
        reset();
      }
    }
  }, [isFetched, userProfile, setUser, reset]);

  return null;
}
