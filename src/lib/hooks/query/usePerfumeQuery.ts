import {
  useQuery,
  useInfiniteQuery,
  InfiniteData,
} from "@tanstack/react-query";
import { queryKeys } from "../../utils/queryKeys";
import { perfumeApi } from "../../utils/api/perfumes.api";
import { searchApi } from "../../utils/api/search.api";
import { PaginatedSearchResponse } from "@/lib/hono/schemas/search.schema";

type BrandDetailQueryKey = ReturnType<typeof queryKeys.perfume.brandDetail>;

// 향수 목록 조회
export const usePerfumeList = () => {
  return useQuery({
    queryKey: queryKeys.perfume.lists(),
    queryFn: () => perfumeApi.list(),
    select: (response) => {
      if (!response || !response.success) return null;
      return response.data;
    },
  });
};

// 특정 향수 상세 조회
export const usePerfumeDetail = (perfumeId: string) => {
  return useQuery({
    queryKey: queryKeys.perfume.detail(perfumeId),
    queryFn: () => perfumeApi.detail(perfumeId),
    enabled: !!perfumeId, // perfumeId가 있을 때만 쿼리 실행
    select: (response) => {
      if (!response || !response.success) return null;
      return response.data;
    },
  });
};

export const usePerfumeByTheme = (themeName: string) => {
  return useQuery({
    queryKey: ["perfumes", "theme", themeName],
    queryFn: async () => {
      const response = await perfumeApi.byTheme(themeName);
      return response?.data || [];
    },
    staleTime: 60 * 1000, // 60초
  });
};

/**
 * 브랜드 상세 페이지의 향수 목록을 무한 스크롤로 조회하는 쿼리
 *
 * @param brandName 브랜드명
 * @param filters 필터 옵션 (노트, 어코드 등)
 */
export const useInfiniteBrandPerfumesQuery = (
  brandName: string,
  filters: Record<string, string[]>,
) => {
  return useInfiniteQuery<
    PaginatedSearchResponse,
    Error,
    InfiniteData<PaginatedSearchResponse>,
    BrandDetailQueryKey,
    string | null
  >({
    queryKey: queryKeys.perfume.brandDetail(brandName),
    queryFn: ({ pageParam }) =>
      searchApi.fetchPerfumes(pageParam, brandName, filters),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
  });
};
