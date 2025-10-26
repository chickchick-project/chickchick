"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { userApi, meApi } from "@/lib/utils/api/users.api";
import { queryKeys } from "@/lib/utils/queryKeys";

export const usePerfumeBookmarks = (userId: string) => {
  const queryResult = useSuspenseQuery({
    queryKey: queryKeys.user.bookmarks.perfumes(userId),
    queryFn: () => userApi.bookmarks.perfumes(userId),
    select: (response) => {
      if (!response || !response.success) return [];
      return response.data;
    },
  });
  return queryResult;
};

export const useUserPostsBookmarks = () => {
  const queryResult = useSuspenseQuery({
    queryKey: queryKeys.user.bookmarks.posts("me"),
    queryFn: () => meApi.bookmarks.posts(),
    select: (response) => {
      if (!response || !response.success) return [];
      return response.data;
    },
  });
  return queryResult;
};
