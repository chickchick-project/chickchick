"use client";

import { renderCommunityBookmarks } from "./bookmarkSection.helper";
import { useUserPostsBookmarks } from "./useUserBookmarks";

export default function CommunityBookmarksLoader({
  userId,
}: {
  userId: string;
}) {
  const { data: communityData } = useUserPostsBookmarks(userId);
  return renderCommunityBookmarks(communityData || []);
}
