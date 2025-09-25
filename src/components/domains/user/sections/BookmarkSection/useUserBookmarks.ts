"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  fetchUserBookmarksPerfumes,
  fetchUserBookmarksPosts,
} from "@/components/domains/user/user.helper";

export const usePerfumeBookmarks = (userId: string) => {
  const queryResult = useSuspenseQuery({
    queryKey: ["bookmarks", "perfumes", userId],
    queryFn: async () => (await fetchUserBookmarksPerfumes(userId)).data,
  });
  return queryResult;
};

export const useUserPostsBookmarks = (userId: string) => {
  const queryResult = useSuspenseQuery({
    queryKey: ["bookmarks", "posts", userId],
    queryFn: async () => (await fetchUserBookmarksPosts()).data,
  });
  return queryResult;
};
