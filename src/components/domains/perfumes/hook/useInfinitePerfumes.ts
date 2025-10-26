"use client";

import { useEffect, useMemo } from "react";
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import { useTotalStore } from "@/lib/stores/useCountStore";
import { fetchPerfumes } from "@/components/commons/perfumeList/perfumes.helpers";
import { PaginatedSearchResponse } from "@/lib/hono/schemas/search.schema";
import { queryKeys } from "@/lib/utils/queryKeys";

type PerfumeListQueryKey = ReturnType<typeof queryKeys.perfume.list>;

export const useInfinitePerfumes = (searchKeyword: string) => {
  const filters = useFilterStore((state) => state.filters);
  const setTotalCount = useTotalStore((state) => state.setTotalCount);

  const { data, ...rest } = useInfiniteQuery<
    PaginatedSearchResponse,
    Error,
    InfiniteData<PaginatedSearchResponse>,
    PerfumeListQueryKey,
    string | null
  >({
    queryKey: queryKeys.perfume.list(searchKeyword, filters),
    queryFn: ({ pageParam }) =>
      fetchPerfumes(pageParam, searchKeyword, filters),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
  });

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
