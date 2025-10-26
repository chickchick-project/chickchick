"use client";

import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/utils/api/users.api";
import { queryKeys } from "@/lib/utils/queryKeys";

export const useUserCollections = (userId: string) => {
  const query = useQuery({
    queryKey: queryKeys.user.collections.byUserId(userId),
    queryFn: () => userApi.collections(userId),
    select: (response) => {
      if (!response || !response.success) return [];
      return response.data;
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  return query;
};
