import { fetchMockPerfumeBookmarksData } from "@/lib/mocks/fetchUser";
import { renderPerfumeBookmarks } from "./bookmarkSection.helper";

export default async function PerfumeBookmarksLoader({
  userId,
}: {
  userId: string;
}) {
  const data = await fetchMockPerfumeBookmarksData(userId);
  const perfumeData = data;

  return renderPerfumeBookmarks(perfumeData);
}
