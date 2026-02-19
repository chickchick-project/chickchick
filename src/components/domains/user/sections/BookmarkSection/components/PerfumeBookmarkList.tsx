import PerfumeCard from "@/components/commons/card/perfumeCard";
import type { ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";

import Link from "next/link";

export const PerfumeBookmarkList = ({
  perfumes,
}: {
  perfumes: ApiPerfumeSimpleResponse[];
}) => {
  if (perfumes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        북마크한 향수가 없습니다.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-5 gap-[52px]">
      {perfumes.map((item, idx) => (
        <Link key={item.id || idx} href={`/perfumes/${item.id}`} passHref>
          <PerfumeCard
            perfumeImage={item.perfumeImage?.imageUrl || null}
            brandName={item.brand.nameKo || item.brand.nameEn}
            perfumeName={item.nameKo || item.nameEn}
          />
        </Link>
      ))}
    </div>
  );
};
