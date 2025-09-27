"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  fetchUserBookmarksPerfumes,
  fetchUserBookmarksPosts,
} from "@/components/domains/user/user.helper";
import { PerfumeBaseResponse } from "@/lib/hono/schemas/perfume.schema";

export const usePerfumeBookmarks = (
  userId: string,
  initialData?: PerfumeBaseResponse[]
) => {
  const queryResult = useSuspenseQuery({
    queryKey: ["bookmarks", "perfumes", userId],
    queryFn: async () => (await fetchUserBookmarksPerfumes(userId)).data,
    initialData,
  });
  return queryResult;
};

export const useUserPostsBookmarks = () => {
  const queryResult = useSuspenseQuery({
    queryKey: ["bookmarks", "posts", "me"],
    queryFn: async () => (await fetchUserBookmarksPosts()).data,
  });
  return queryResult;
};
