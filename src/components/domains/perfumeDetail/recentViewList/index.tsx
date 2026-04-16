"use client";

import { useRecentPerfumesStore } from "@/client/stores/perfumeStore";
import PerfumeCard from "@/components/commons/card/perfumeCard";
import { SectionTitle } from "@/components/commons/sectionTitle";
import { redirect } from "next/navigation";

// PerfumeCard default(w-[180px], aspect-square 이미지 180px + 텍스트 ~50px)와
// 동일한 치수로 맞춰 하이드레이션 전후 레이아웃 시프트를 방지한다.
const RecentViewSkeleton = () => (
  <ul className="pl-5 pc:pl-0 flex pc:justify-between gap-4 overflow-x-auto pc:overflow-visible scrollbar-hide pr-5 pc:pr-0 pt-4 pc:pt-5">
    {Array.from({ length: 4 }).map((_, i) => (
      <li key={i} className="w-[180px] shrink-0 animate-pulse">
        <div className="aspect-square rounded-xl bg-gray-200" />
        <div className="mt-1 space-y-0.5">
          <div className="h-[14px] w-2/3 rounded bg-gray-200" />
          <div className="h-[16px] w-full rounded bg-gray-200" />
        </div>
      </li>
    ))}
  </ul>
);

export const PerfumeRecentViewList = () => {
  const recentPerfumeItems = useRecentPerfumesStore((s) => s.items);
  const hasHydrated = useRecentPerfumesStore((s) => s._hasHydrated);

  // 최근 본 향수가 없으면 섹션 자체를 렌더하지 않는다
  if (recentPerfumeItems.length === 0) return null;

  return (
    <section className="p-2">
      <SectionTitle>최근 본 향수</SectionTitle>
      {!hasHydrated ? (
        <RecentViewSkeleton />
      ) : (
        <ul className="pl-5 pc:pl-0 flex gap-4 overflow-x-auto pc:overflow-visible scrollbar-hide pr-5 pc:pr-0 pt-4 pc:pt-5">
          {recentPerfumeItems.slice(0, 4).map((perfume) => (
            <li key={perfume.id}>
              <PerfumeCard
                cardType="default"
                perfumeImage={perfume.item.imageUrl}
                brandName={perfume.item.brandName}
                perfumeName={perfume.item.perfumeName}
                onClick={() => redirect(`/perfumes/${perfume.id}`)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
