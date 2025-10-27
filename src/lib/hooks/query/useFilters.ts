import { useQuery } from "@tanstack/react-query";
import { brandApi } from "@/lib/utils/api/brands.api";
import { perfumeApi } from "@/lib/utils/api/perfumes.api";

const FILTER_STALE_TIME = {
  brands: 1000 * 60 * 30,
  notes: 1000 * 60 * 30,
  accords: 1000 * 60 * 30,
} as const;

/**
 * 브랜드 필터 데이터 조회
 */
export function useBrandFilter() {
  return useQuery({
    queryKey: ["brand", "list"],
    queryFn: async () => {
      const data = await brandApi.list();
      return data ?? [];
    },
    staleTime: FILTER_STALE_TIME.brands,
  });
}

/**
 * 향수 노트 필터 데이터 조회
 */
export function usePerfumeNoteFilter() {
  return useQuery({
    queryKey: ["perfume", "notes"],
    queryFn: async () => {
      const data = await perfumeApi.notes();
      return data ?? [];
    },
    staleTime: FILTER_STALE_TIME.notes,
  });
}

/**
 * 향수 어코드 필터 데이터 조회
 */
export function usePerfumeAccordFilter() {
  return useQuery({
    queryKey: ["perfume", "accords"],
    queryFn: async () => {
      const data = await perfumeApi.accords();
      return data ?? [];
    },
    staleTime: FILTER_STALE_TIME.accords,
  });
}
