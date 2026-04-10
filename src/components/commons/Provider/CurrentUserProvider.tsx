"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useUserProfile } from "@/client/hooks/query/useUserQuery";
import { queryKeys } from "@/client/utils/queryKeys";
import { ApiMyProfileResponse } from "@/server/hono/schemas/me.schema";

interface CurrentUserState {
  user: ApiMyProfileResponse | null;
  isLoading: boolean;
  reset: () => void;
}

const CurrentUserContext = createContext<CurrentUserState | null>(null);

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const { status, data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const prevUserIdRef = useRef<string | undefined>(undefined);

  const isAuthenticated = status === "authenticated" && !!session?.user?.id;
  const currentUserId = session?.user?.id;

  // 계정 전환 감지: A→B 전환만 처리 (undefined → B 최초 로그인은 건너뜀)
  useEffect(() => {
    const prev = prevUserIdRef.current;
    if (prev !== undefined && prev !== currentUserId) {
      queryClient.removeQueries({ queryKey: queryKeys.user.all });
      router.refresh();
    }
    prevUserIdRef.current = currentUserId;
  }, [currentUserId, queryClient, router]);

  // 로그아웃 시 user 캐시 즉시 제거
  useEffect(() => {
    if (status === "unauthenticated") {
      queryClient.removeQueries({ queryKey: queryKeys.user.all });
    }
  }, [status, queryClient]);

  // "me" 고정 키 사용: queryKeys.user.profile(pageOwnerId)와 캐시 키 충돌 방지
  const { data: userProfile, isFetched } = useUserProfile({
    enabled: isAuthenticated,
  });

  const isLoading = status === "loading" || (isAuthenticated && !isFetched);
  const user = isAuthenticated && isFetched ? (userProfile ?? null) : null;

  const reset = () => {
    queryClient.removeQueries({ queryKey: queryKeys.user.all });
  };

  return (
    <CurrentUserContext.Provider value={{ user, isLoading, reset }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUserContext(): CurrentUserState {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) {
    throw new Error("useCurrentUserContext must be used within CurrentUserProvider");
  }
  return ctx;
}
