import { renderPerfumeBookmarks } from "./bookmarkSection.helper";
import { fetchUserBookmarksPerfumes } from "../../user.helper";

export default async function PerfumeBookmarksLoader({
  userId,
}: {
  userId: string;
}) {
  const perfumes = await fetchUserBookmarksPerfumes(userId);
  const perfumeData = perfumes.data;

  return renderPerfumeBookmarks(perfumeData);
}
