"use client";

import { renderPerfumeBookmarks } from "./bookmarkSection.helper";
import { usePerfumeBookmarks } from "./useUserBookmarks";

export default function PerfumeBookmarksLoader({ userId }: { userId: string }) {
  const { data: perfumes } = usePerfumeBookmarks(userId);

  return renderPerfumeBookmarks(perfumes || []);
}
