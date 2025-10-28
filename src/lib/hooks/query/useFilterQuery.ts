import { useQuery } from "@tanstack/react-query";
import { brandApi } from "@/lib/utils/api/brands.api";
import { perfumeApi } from "@/lib/utils/api/perfumes.api";
import { filterApi } from "@/lib/utils/api/filter.api";
import type { FilterRequestBody } from "@/lib/hono/schemas/filter.schema";

const FILTER_STALE_TIME = {
  brands: 1000 * 60 * 30,
  notes: 1000 * 60 * 30,
  accords: 1000 * 60 * 30,
  dynamic: 1000 * 60 * 5, // 동적 필터는 5분 캐싱 (검색어+필터 조합이 같으면 재사용)
} as const;

/**
 * 브랜드 필터 데이터 조회
 */
export function useBrandFilter(enabled?: boolean) {
  return useQuery({
    queryKey: ["brand", "list"],
    queryFn: () => brandApi.list(),
    select: (response) => response?.data ?? [],
    staleTime: FILTER_STALE_TIME.brands,
    enabled: enabled ?? true,
  });
}

/**
 * 향수 노트 필터 데이터 조회
 */
export function usePerfumeNoteFilter(enabled?: boolean) {
  return useQuery({
    queryKey: ["perfume", "notes"],
    queryFn: () => perfumeApi.notes(),
    select: (response) => response?.data ?? [],
    staleTime: FILTER_STALE_TIME.notes,
    enabled: enabled ?? true,
  });
}

/**
 * 향수 어코드 필터 데이터 조회
 */
export function usePerfumeAccordFilter(enabled?: boolean) {
  return useQuery({
    queryKey: ["perfume", "accords"],
    queryFn: () => perfumeApi.accords(),
    select: (response) => response?.data ?? [],
    staleTime: FILTER_STALE_TIME.accords,
    enabled: enabled ?? true,
  });
}

/**
 * 동적 필터 옵션 조회
 * 현재 검색 조건에서 실제로 존재하는 필터만 반환
 */
export function useAvailableFilters(
  params: FilterRequestBody,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["filter", "available", params],
    queryFn: () => filterApi.getAvailable(params),
    select: (response) =>
      response?.data ?? { notes: [], accords: [], brands: [] },
    staleTime: FILTER_STALE_TIME.dynamic,
    enabled,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * 필터 카테고리별 총 개수 조회
 */
export function useAvailableFiltersTotal(
  params: FilterRequestBody,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["filter", "total", params],
    queryFn: () => filterApi.getTotal(params),
    select: (response) => response?.data ?? [],
    staleTime: FILTER_STALE_TIME.dynamic,
    enabled,
    placeholderData: (previousData) => previousData,
  });
}
