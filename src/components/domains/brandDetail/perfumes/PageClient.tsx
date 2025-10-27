"use client";

import { useEffect, useMemo } from "react";
import SortDropdown from "@/components/commons/dropdown/SortDropdown";
import {
  usePerfumeNoteFilter,
  usePerfumeAccordFilter,
} from "@/lib/hooks/query/useFilters";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import { useTotalStore } from "@/lib/stores/useCountStore";
import { SearchHeader } from "../../../commons/perfumeList/search";
import { PerfumeSection } from "../../../commons/perfumeList/section/PerfumeSection";
import {
  fetchPerfumes,
  getUniquePerfumes,
} from "@/components/commons/perfumeList/perfumes.helpers";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useInfiniteScrollTrigger } from "@/lib/hooks/useInfiniteScrollTrigger";
import { queryKeys } from "@/lib/utils/queryKeys";
import { PaginatedSearchResponse } from "@/lib/hono/schemas/search.schema";

type BrandDetailQueryKey = ReturnType<typeof queryKeys.perfume.brandDetail>;

export const PageClient = ({ brandName }: { brandName: string }) => {
  const { data: notes } = usePerfumeNoteFilter();
  const { data: accords } = usePerfumeAccordFilter();

  const memoizedNotes = useMemo(() => notes ?? [], [notes]);
  const memoizedAccords = useMemo(() => accords ?? [], [accords]);

  const filters = useFilterStore((state) => state.filters);
  const setCount = useTotalStore((state) => state.setTotalCount);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<
      PaginatedSearchResponse,
      Error,
      InfiniteData<PaginatedSearchResponse>,
      BrandDetailQueryKey,
      string | null
    >({
      queryKey: queryKeys.perfume.brandDetail(brandName),
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

  const moreRef = useInfiniteScrollTrigger({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

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
