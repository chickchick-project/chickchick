"use client";

import { useEffect, useMemo } from "react";
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import { useTotalStore } from "@/lib/stores/useCountStore";
import { fetchPerfumes } from "@/components/commons/perfumeList/perfumes.helpers";
import { ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";

export interface SearchResponse<T> {
  data: T[];
  nextCursor: string | null;
  totalCount: number | null;
}

export type PerfumesApiResponse = SearchResponse<ApiPerfumeSimpleResponse>;

export const useInfinitePerfumes = (searchKeyword: string) => {
  const filters = useFilterStore((state) => state.filters);
  const setTotalCount = useTotalStore((state) => state.setTotalCount);

  const { data, ...rest } = useInfiniteQuery<
    PerfumesApiResponse,
    Error,
    InfiniteData<PerfumesApiResponse>,
    (string | typeof filters)[],
    string | null
  >({
    queryKey: ["perfumes", searchKeyword, filters],
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
