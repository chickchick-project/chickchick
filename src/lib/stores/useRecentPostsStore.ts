import { createRecentItemsStore } from "./createRecentItemsStore";
import type { GenericRecentItem } from "./createRecentItemsStore";
import type { PostCardProps } from "@/components/commons/card/postCard/postCard.types";

export type RecentPostItem = GenericRecentItem<PostCardProps>;

const MAX_RECENT_POSTS = 10;

export const useRecentPostsStore = createRecentItemsStore<PostCardProps>({
  name: "recent-posts",
  maxItems: MAX_RECENT_POSTS,
  type: "post",
});
