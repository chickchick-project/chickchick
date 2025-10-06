import React from "react";
import PerfumeCard from "@/components/commons/card/perfumeCard";
// import { mockPerfumeCardData } from "@/lib/mocks/perfumeCard";
import { ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";

export const LikePerfumeList = ({
  likedPerfumes,
}: {
  likedPerfumes: ApiPerfumeSimpleResponse[];
}) => {
  return likedPerfumes.length > 0 ? (
    <div className="grid grid-cols-5 gap-4">
      {likedPerfumes.map((item) => (
        <PerfumeCard
          key={item.id}
          perfumeImage={
            item.perfumeImage?.imageUrl ?? "/images/BlurShimmer.svg"
          }
          brandName={item.brand?.nameKo ?? item.brand?.nameEn ?? "브랜드 미정"}
          perfumeName={item.nameKo ?? item.nameEn ?? "이름 미정"}
        />
      ))}
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      좋아요 한 향수가 없습니다.
    </div>
  );
};
