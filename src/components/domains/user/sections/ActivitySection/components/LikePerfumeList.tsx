import React from "react";
import PerfumeCard from "@/components/commons/card/perfumeCard";
import { mockPerfumeCardData } from "@/lib/mocks/perfumeCard";
import { PerfumeBaseResponse } from "@/lib/hono/schemas/perfume.schema";

export const LikePerfumeList = ({
  likedPerfumes,
}: {
  likedPerfumes: PerfumeBaseResponse[];
}) => {
  return likedPerfumes.length > 0 ? (
    <div className="grid grid-cols-5 gap-4">
      {likedPerfumes.map((item) => (
        <PerfumeCard key={item.id} {...mockPerfumeCardData} />
      ))}
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      좋아요 한 향수가 없습니다.
    </div>
  );
};
