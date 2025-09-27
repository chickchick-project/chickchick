"use client";

import { PerfumeBaseResponse } from "@/lib/hono/schemas/perfume.schema";
import { PerfumeBookmarkList } from "../components";
import { usePerfumeBookmarks } from "../hooks/useUserBookmarks";

export default function PerfumeBookmarksLoader({
  userId,
  initialData,
}: {
  userId: string;
  initialData?: PerfumeBaseResponse[];
}) {
  const { data: perfumes } = usePerfumeBookmarks(userId, initialData);

  return <PerfumeBookmarkList perfumes={perfumes || []} />;
}
