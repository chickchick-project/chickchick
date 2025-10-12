import { createRecentItemsStore } from "./createRecentItemsStore";
import type { ApiPostDetailResponse } from "@/lib/hono/schemas/community.schema";
import type { GenericRecentItem } from "./createRecentItemsStore";

export type RecentPostItem = GenericRecentItem<ApiPostDetailResponse>;

const MAX_RECENT_POSTS = 10;

export const useRecentPostsStore =
  createRecentItemsStore<ApiPostDetailResponse>({
    name: "recent-posts",
    maxItems: MAX_RECENT_POSTS,
    type: "post",
  });
