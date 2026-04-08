"use client";

import { useSession } from "next-auth/react";
import { useUserProfile } from "@/client/hooks/query/useUserQuery";
import { ApiMyProfileResponse } from "@/server/hono/schemas/me.schema";

interface UserState {
  user: ApiMyProfileResponse | null;
  isLoading: boolean;
  reset: () => void;
}

export const useCurrentUser = (): UserState => {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const { data: userProfile, isFetched } = useUserProfile({
    enabled: isAuthenticated,
  });

  const isLoading = status === "loading" || (isAuthenticated && !isFetched);
  const user = isAuthenticated && isFetched ? (userProfile ?? null) : null;

  // 로그아웃 후 window.location.reload()가 호출되므로 no-op
  const reset = () => {};

  return { user, isLoading, reset };
};
