import { useQuery } from "@tanstack/react-query";
import { meApi, userApi } from "../utils/api/users.api";
import { queryKeys } from "../utils/queryKeys";

export const useUserProfile = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.user.profile("me"),
    queryFn: () => meApi.profile.get(),
    enabled: options?.enabled ?? true,
    retry: (failureCount, error) => {
      // 401, 403 에러는 재시도하지 않음 (인증 실패)
      const errorStatus = (error as { status?: number })?.status;
      if (errorStatus === 401 || errorStatus === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useUserProfileById = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.user.profile(userId),
    queryFn: () => userApi.getById(userId),
  });
};
