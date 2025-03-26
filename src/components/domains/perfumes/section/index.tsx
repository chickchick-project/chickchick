import React from "react";
import Link from "next/link";
import { PerfumeCard } from "@/components/commons/perfumeCard";
import { Perfume } from "@/app/api/search/route";

interface PerfumeSectionProps {
  perfumes: Perfume[];
  isLoading: boolean;
  hasMore: boolean;
  moreRef: React.RefObject<HTMLDivElement>;
}

export const PerfumeSection = ({
  perfumes,
  isLoading,
  hasMore,
  moreRef,
}: PerfumeSectionProps) => {
  return (
    <main className="mt-10 px-4">
      <h3 className="text-headline-3 font-semibold">향수</h3>

      {perfumes.length === 0 && !isLoading ? (
        <div className="flex justify-center items-center h-40">
          검색 결과가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-x-[52px] gap-y-10 mt-5">
          {perfumes.map((item) => (
            <Link key={item.perfume_id} href={`/perfumes/${item.perfume_id}`}>
              <PerfumeCard
                perfumeImage={item.image_url}
                brandName={item.brand_name.en}
                perfumeName={item.perfume_name.en}
              />
            </Link>
          ))}
        </div>
      )}

      {/* 로딩 및 더 보기 표시 */}
      <div ref={moreRef} className="py-10 text-center">
        {isLoading && <p className="text-gray-500">불러오는 중...</p>}
        {!hasMore && perfumes.length > 0 && (
          <p className="text-gray-500">모든 결과를 확인했습니다.</p>
        )}
      </div>
    </main>
  );
};
