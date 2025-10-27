import {
  useQuery,
  useInfiniteQuery,
  InfiniteData,
} from "@tanstack/react-query";
import { searchApi } from "../../utils/api/search.api";
import { PaginatedSearchResponse } from "@/lib/hono/schemas/search.schema";
import { queryKeys } from "@/lib/utils/queryKeys";

interface SearchPerfumesParams {
  searchText?: string;
  cursor?: string;
  limit?: number;
}

interface SearchPerfumesWithFiltersParams extends SearchPerfumesParams {
  brandFilter?: string[];
  notesFilter?: string[];
  accordsFilter?: string[];
}

// 향수 검색 (필터 없이)
export const useSearchPerfumes = (params: SearchPerfumesParams) => {
  return useQuery({
    queryKey: ["search", "perfumes", params],
    queryFn: () => searchApi.perfumes(params),
    enabled: !!params.searchText && params.searchText.trim().length > 0,
    select: (response) => {
      if (!response || !response.success) return null;
      return response.data;
    },
  });
};

// 향수 검색 (필터 포함)
export const useSearchPerfumesWithFilters = (
  params: SearchPerfumesWithFiltersParams
) => {
  return useQuery({
    queryKey: ["search", "perfumes", "filtered", params],
    queryFn: () => searchApi.perfumesWithFilters(params),
    select: (response) => {
      if (!response || !response.success) return null;
      return response.data;
    },
  });
};

type PerfumeListQueryKey = ReturnType<typeof queryKeys.perfume.list>;

/**
 * 무한 스크롤을 위한 향수 검색 쿼리
 *
 * @param searchKeyword 검색어
 * @param filters 필터 옵션 (브랜드, 노트, 어코드)
 */
export const useInfiniteSearchPerfumesQuery = (
  searchKeyword: string,
  filters: Record<string, string[]>
) => {
  return useInfiniteQuery<
    PaginatedSearchResponse,
    Error,
    InfiniteData<PaginatedSearchResponse>,
    PerfumeListQueryKey,
    string | null
  >({
    queryKey: queryKeys.perfume.list(searchKeyword, filters),
    queryFn: ({ pageParam }) =>
      searchApi.fetchPerfumes(pageParam, searchKeyword, filters),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
  });
};
