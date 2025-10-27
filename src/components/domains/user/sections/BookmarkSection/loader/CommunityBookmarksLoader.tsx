"use client";

import { CommunityBookmarkList } from "../components";
import { useUserPostsBookmarks } from "@/lib/hooks/query/useUserQuery";

export default function CommunityBookmarksLoader() {
  const { data: communityData } = useUserPostsBookmarks();
  return <CommunityBookmarkList communityPosts={communityData || []} />;
}
