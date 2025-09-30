"use client";

import { LikePerfumeList } from "../components";
import { useUserLikedPerfume } from "../hooks/useUserActivity";
import { PerfumeBaseResponse } from "@/lib/hono/schemas/perfume.schema";

export default function LikePerfumeListLoader({
  initialData,
}: {
  initialData?: PerfumeBaseResponse[];
}) {
  const { data: likedPerfumes, error } = useUserLikedPerfume(initialData);

  if (error) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p>좋아요한 향수를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return <LikePerfumeList likedPerfumes={likedPerfumes || []} />;
}
