"use client";

import SortDropdown from "@/components/commons/dropdown/SortDropdown";
import { PerfumeAccord, PerfumeNote } from "@prisma/client";
import { useEffect, useMemo } from "react";

import { useInfiniteScroll } from "@/lib/hooks/useInfinityScroll";
import { Perfume } from "@/app/api/search/route";
import { withCache } from "@/lib/utils/withCache";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import { useTotalStore } from "@/lib/stores/useCountStore";
import { SearchHeader } from "../../../commons/perfumeList/search";
import { PerfumeSection } from "../../../commons/perfumeList/section/PerfumeSection";
import {
  adaptedFetchPerfumes,
  createQueryKey,
  // getUniquePerfumes,
} from "@/components/commons/perfumeList/perfumes.helpers";

export const PageClient = ({
  brandName,
  notes,
  accords,
}: {
  brandName: string;
  notes: PerfumeNote[];
  accords: PerfumeAccord[];
}) => {
  const memoizedNotes = useMemo(() => notes, [notes]);
  const memoizedAccords = useMemo(() => accords, [accords]);

  const filters = useFilterStore((state) => state.filters);
  const setCount = useTotalStore((state) => state.setTotalCount);

  // 검색 파라미터 생성 (메모이제이션)
  const query: string = useMemo(
    () => createQueryKey(brandName, filters),
    [filters, brandName]
  );

  // 무한 스크롤 훅 사용
  const fetcher = useMemo(
    () =>
      withCache((cursor: string | null) =>
        adaptedFetchPerfumes(cursor, brandName, filters)
      ),
    [filters, brandName]
  );

  const { data, totalCount, isLoading, moreRef, isIdle } =
    useInfiniteScroll<Perfume>(fetcher, query);

  useEffect(() => {
    if (totalCount !== null && typeof totalCount === "number") {
      setCount(totalCount);
    }
  }, [totalCount, setCount]);

  // const uniquePerfumes = useMemo(() => getUniquePerfumes(data), [data]);

  // 중복 아이디 제거
  const uniquePerfumes = useMemo(() => {
    const seen = new Set();
    return data.filter((item) => {
      if (seen.has(item.perfume_id)) return false;
      seen.add(item.perfume_id);
      return true;
    });
  }, [data]);

  return (
    <div className="flex flex-col items-center w-full h-full">
      <SearchHeader
        notes={memoizedNotes}
        accords={memoizedAccords}
        isSearch={false}
      />
      <main className="flex flex-col w-full max-w-[1200px] px-4">
        <div className="w-full flex justify-end items-center mb-5">
          <SortDropdown type="perfume" />
        </div>
        <PerfumeSection
          perfumes={uniquePerfumes}
          isLoading={isLoading}
          isIdle={isIdle}
          moreRef={moreRef}
          pageType="brandDetail"
        />
      </main>
    </div>
  );
};
