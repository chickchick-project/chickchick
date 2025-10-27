import { ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";
import { FILTER_LABELS } from "./filter/filter.constants";
import { PaginatedSearchResponse } from "@/lib/hono/schemas/search.schema";
import { searchApi } from "@/lib/utils/api/search.api";

/**
 * 향수 목록을 검색하고 필터링하는 비동기 함수입니다.
 */
export async function fetchPerfumes(
  cursor: string | null,
  searchText: string,
  filters: Record<string, string[]>
): Promise<PaginatedSearchResponse> {
  try {
    const formattedFilters = formatFilters(filters);
    const hasFilters = Object.keys(formattedFilters).length > 0;

    const response = hasFilters
      ? await searchApi.perfumesWithFilters({
          searchText: searchText || "",
          cursor: cursor || undefined,
          limit: 15,
          ...formattedFilters,
        })
      : await searchApi.perfumes({
          searchText: searchText || undefined,
          cursor: cursor || undefined,
          limit: 15,
        });

    if (!response) {
      throw new Error("향수 정보를 불러오는 데 실패했습니다.");
    }

    if (
      typeof response === "object" &&
      "success" in response &&
      response.success &&
      "data" in response
    ) {
      return response.data;
    }

    throw new Error(
      (typeof response === "object" && "message" in response && response.message) ||
        "향수 정보를 불러오는 데 실패했습니다."
    );
  } catch (error) {
    console.error("fetchPerfumes에서 오류 발생:", error);

    throw error;
  }
}

/**
 * 프론트엔드 필터 상태를 백엔드 API 스키마에 맞게 변환합니다.
 */
const formatFilters = (filters: Record<string, string[]>) => {
  const result: {
    brandFilter?: string[];
    notesFilter?: string[];
    accordsFilter?: string[];
  } = {};

  if (filters.brand?.length) result.brandFilter = filters.brand;
  if (filters.notes?.length) result.notesFilter = filters.notes;
  if (filters.accords?.length) result.accordsFilter = filters.accords;

  return result;
};

/**
 * 필터 키(key)에 해당하는 한글 레이블을 반환합니다.
 */
export const getLabel = (key: string) =>
  FILTER_LABELS[key as keyof typeof FILTER_LABELS] || key;

/**
 * 중복된 향수를 ID 기준으로 제거하는 함수입니다.
 */
export const getUniquePerfumes = (
  perfumes: ApiPerfumeSimpleResponse[]
): ApiPerfumeSimpleResponse[] => {
  const uniqueMap = new Map<string, ApiPerfumeSimpleResponse>();

  perfumes.forEach((perfume) => {
    if (!uniqueMap.has(perfume.id)) {
      uniqueMap.set(perfume.id, perfume);
    }
  });

  return Array.from(uniqueMap.values());
};
