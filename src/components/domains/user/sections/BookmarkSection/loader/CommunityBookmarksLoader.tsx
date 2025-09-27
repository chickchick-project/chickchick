"use client";

import { CommunityBookmarkList } from "../components";
import { useUserPostsBookmarks } from "../hooks/useUserBookmarks";

export default function CommunityBookmarksLoader() {
  const { data: communityData } = useUserPostsBookmarks();
  return <CommunityBookmarkList communityPosts={communityData || []} />;
}
