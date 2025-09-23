import { fetchMockCommunityBookmarks } from "@/lib/mocks/fetchUser";
import { renderCommunityBookmarks } from "./bookmarkSection.helper";

export default async function CommunityBookmarksLoader({
  userId,
}: {
  userId: string;
}) {
  const data = await fetchMockCommunityBookmarks(userId);
  const communityData = data;

  return renderCommunityBookmarks(communityData);
}
