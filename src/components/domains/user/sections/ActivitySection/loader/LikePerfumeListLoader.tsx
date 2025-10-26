"use client";

import { LikePerfumeList } from "../components";
import { useUserLikedPerfume } from "../hooks/useUserActivity";

export default function LikePerfumeListLoader() {
  const { data: likedPerfumes, error } = useUserLikedPerfume();

  if (error) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p>좋아요한 향수를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return <LikePerfumeList likedPerfumes={likedPerfumes || []} />;
}
