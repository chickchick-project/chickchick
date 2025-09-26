"use client";

import { CommunityBookmarkList } from "./bookmarkSection.components";
import { useUserPostsBookmarks } from "./useUserBookmarks";

export default function CommunityBookmarksLoader({}) {
  const { data: communityData } = useUserPostsBookmarks();
  return <CommunityBookmarkList communityPosts={communityData || []} />;
}
