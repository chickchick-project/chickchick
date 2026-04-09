"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useUserProfile } from "@/client/hooks/query/useUserQuery";
import { queryKeys } from "@/client/utils/queryKeys";
import { ApiMyProfileResponse } from "@/server/hono/schemas/me.schema";

interface UserState {
  user: ApiMyProfileResponse | null;
  isLoading: boolean;
  reset: () => void;
}

export const useCurrentUser = (): UserState => {
  const { status, data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const prevUserIdRef = useRef<string | undefined>(undefined);

  const isAuthenticated = status === "authenticated" && !!session?.user?.id;
  const currentUserId = session?.user?.id;

  // 계정 전환 감지: userId가 바뀌면 이전 유저의 캐시를 제거하고
  // router.refresh()로 서버 컴포넌트도 새 세션 기준으로 재렌더링한다.
  // undefined → "userId-B" 전환(최초 로그인)은 건너뛰고, A→B 전환만 처리한다.
  useEffect(() => {
    const prev = prevUserIdRef.current;
    if (prev !== undefined && prev !== currentUserId) {
      console.log(
        `[CURRENT_USER][account-switch] 계정 전환 감지 — prev=${prev} next=${currentUserId ?? "none"}`,
      );
      queryClient.removeQueries({ queryKey: queryKeys.user.all });
      // App Router 서버 컴포넌트를 새 세션 기준으로 재실행
      router.refresh();
    }
    prevUserIdRef.current = currentUserId;
  }, [currentUserId, queryClient, router]);

  // 로그아웃(unauthenticated) 시 user 관련 캐시를 즉시 제거한다.
  // (signOut redirect가 router.push() 방식일 때도 대응)
  useEffect(() => {
    if (status === "unauthenticated") {
      queryClient.removeQueries({ queryKey: queryKeys.user.all });
    }
  }, [status, queryClient]);

  useEffect(() => {
    console.log(
      `[CURRENT_USER][session] status=${status} userId=${session?.user?.id ?? "없음"} email=${session?.user?.email ?? "없음"}`,
    );
  }, [status, session?.user?.id, session?.user?.email]);

  const { data: userProfile, isFetched } = useUserProfile({
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (isFetched) {
      console.log(
        `[CURRENT_USER][profile] 로드 완료 — userId=${userProfile?.id ?? "null"} nickname=${userProfile?.nickname ?? "null"}`,
      );
    }
  }, [isFetched, userProfile?.id, userProfile?.nickname]);

  // status가 "authenticated"가 아니거나 아직 fetch 완료 전이면 반드시 null 반환.
  // isFetched가 true여도 status가 "loading"이면 이전 세션 데이터일 수 있으므로 차단한다.
  const isLoading = status === "loading" || (isAuthenticated && !isFetched);
  const user = isAuthenticated && isFetched ? (userProfile ?? null) : null;

  const reset = () => {
    queryClient.removeQueries({ queryKey: queryKeys.user.all });
  };

  return { user, isLoading, reset };
};
