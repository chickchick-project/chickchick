"use client";

import { PerfumeBookmarkList } from "../components";
import { usePerfumeBookmarks } from "@/client/hooks/query/useUserQuery";

export default function PerfumeBookmarksLoader({ userId }: { userId: string }) {
  const { data: perfumeData } = usePerfumeBookmarks(userId);

  return <PerfumeBookmarkList perfumes={perfumeData || []} />;
}
