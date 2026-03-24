"use client";

import { CommunityBookmarkList } from "../components";
import { useUserPostsBookmarks } from "@/client/hooks/query/useUserQuery";

export default function CommunityBookmarksLoader() {
  const { data: communityData } = useUserPostsBookmarks();
  return <CommunityBookmarkList communityPosts={communityData || []} />;
}
