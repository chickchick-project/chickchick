"use client";

import { useEffect, useMemo, useRef } from "react";
import { PerfumeAccord, PerfumeNote } from "@prisma/client";
import SortDropdown from "@/components/commons/dropdown/SortDropdown";

import { useFilterStore } from "@/lib/stores/useFilterStore";
import { useTotalStore } from "@/lib/stores/useCountStore";
import { SearchHeader } from "../../../commons/perfumeList/search";
import { PerfumeSection } from "../../../commons/perfumeList/section/PerfumeSection";
import {
  fetchPerfumes,
  getUniquePerfumes,
} from "@/components/commons/perfumeList/perfumes.helpers";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";

interface SearchResponse<T> {
  data: T[]; // 검색된 목록
  nextCursor: string | null; // 다음 페이지를 위한 커서 (없으면 null)
  totalCount?: number | null;
}

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
  const moreRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useInfiniteQuery<
    SearchResponse<ApiPerfumeSimpleResponse>,
    Error,
    InfiniteData<SearchResponse<ApiPerfumeSimpleResponse>>,
    (string | typeof filters)[],
    string | null
  >({
    queryKey: ["brandDetail", brandName, filters],
    queryFn: ({ pageParam }) => fetchPerfumes(pageParam, brandName, filters),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
  });

  useEffect(() => {
    if (data?.pages[0]?.totalCount) {
      setCount(data.pages[0].totalCount);
    }
  }, [data, setCount]);

  // 중복 아이디 제거
  const uniquePerfumes = useMemo(() => {
    const allPerfumes = data?.pages.flatMap((page) => page.data) ?? [];
    return getUniquePerfumes(allPerfumes);
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
          <SortDropdown type="perfume" onSortChange={() => {}} />
        </div>
        <PerfumeSection
          perfumes={uniquePerfumes}
          isLoading={isLoading}
          isIdle={!isLoading && uniquePerfumes.length === 0}
          moreRef={moreRef}
        />
      </main>
    </div>
  );
};
