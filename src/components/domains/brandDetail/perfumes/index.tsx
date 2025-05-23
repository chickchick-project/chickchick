"use client";

import SortDropdown from "@/components/commons/dropdown/SortDropdown";
import { PerfumeSection } from "../../perfumes/section/PerfumeSection";
import { perfume_accords, perfume_notes } from "@prisma/client";
import { useEffect, useMemo } from "react";
import {
  adaptedFetchPerfumes,
  createQueryKey,
  getUniquePerfumes,
} from "../../perfumes/perfumes.helpers";
import { useInfiniteScroll } from "@/lib/hooks/useInfinityScroll";
import { Perfume } from "@/app/api/search/route";
import { withCache } from "@/lib/utils/withCache";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import { useTotalStore } from "@/lib/stores/useCountStore";
import { SearchHeader } from "../../perfumes/search";

// TODO: 향수 리스트 페이지에서 사용되는 컴포넌트와 중복되는 부분이 많음, 공통 컴포넌트화 필요
export const BrandPerfumes = ({
  notes,
  accords,
}: {
  notes: perfume_notes[];
  accords: perfume_accords[];
}) => {
  const memoizedNotes = useMemo(() => notes, [notes]);
  const memoizedAccords = useMemo(() => accords, [accords]);

  const filters = useFilterStore((state) => state.filters);
  const setCount = useTotalStore((state) => state.setTotalCount);

  // 검색 파라미터 생성 (메모이제이션)
  const query: string = useMemo(() => createQueryKey("", filters), [filters]);

  // 무한 스크롤 훅 사용
  const fetcher = useMemo(
    () =>
      withCache((cursor: string | null) =>
        adaptedFetchPerfumes(cursor, "", filters)
      ),
    [filters]
  );

  const { data, totalCount, isLoading, moreRef, isIdle } =
    useInfiniteScroll<Perfume>(fetcher, query);

  const uniquePerfumes = useMemo(() => getUniquePerfumes(data), [data]);

  useEffect(() => {
    if (totalCount !== null && typeof totalCount === "number") {
      setCount(totalCount);
    }
  }, [totalCount, setCount]);

  return (
    <main className="w-full max-w-[1200px] px-4">
      <SearchHeader
        notes={memoizedNotes}
        accords={memoizedAccords}
        isSearch={false}
      />
      <div className="w-full flex justify-end items-center mb-5 px-4">
        <SortDropdown type="perfume" />
      </div>
      <PerfumeSection
        perfumes={uniquePerfumes}
        isLoading={isLoading}
        isIdle={isIdle}
        moreRef={moreRef}
      />
    </main>
  );
};
