"use client";

import { useEffect, useMemo } from "react";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import { useTotalStore } from "@/lib/stores/useCountStore";
import { useInfiniteSearchPerfumesQuery } from "@/lib/hooks/query/useSearchQuery";

/**
 * 향수 검색 페이지용 커스텀 훅
 */
export const useInfinitePerfumes = (searchKeyword: string) => {
  const committedFilters = useFilterStore((state) => state.committedFilters);
  const setTotalCount = useTotalStore((state) => state.setTotalCount);

  const { data, ...rest } = useInfiniteSearchPerfumesQuery(
    searchKeyword,
    committedFilters
  );

  useEffect(() => {
    if (data?.pages[0]?.totalCount) {
      setTotalCount(data.pages[0].totalCount);
    }
  }, [data, setTotalCount]);

  const perfumes = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  return {
    perfumes,
    data,
    ...rest,
  };
};
