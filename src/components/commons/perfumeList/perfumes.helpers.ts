import { PerfumeBaseResponse } from "@/lib/hono/schemas/perfume.schema";
import { FILTER_LABELS } from "./filter/filter.constants";
import { createHttpClient } from "@/lib/utils/core-request";

export interface SearchResponse {
  data: PerfumeBaseResponse[];
  nextCursor: string | null;
  totalCount: number;
}

interface RawPerfumesApiResponse {
  success: boolean;
  message: string;
  data: SearchResponse;
}

// --- API 클라이언트 초기화 ---
const apiClient = createHttpClient({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
});

/**
 * 향수 목록을 검색하고 필터링하는 비동기 함수입니다.
 * 성공 시 SearchResponse 객체를 반환하고, 실패 시 에러를 던집니다.
 * @returns Promise<SearchResponse>
 */
export async function fetchPerfumes(
  cursor: string | null,
  searchText: string,
  filters: Record<string, string[]>
): Promise<SearchResponse> {
  try {
    const formattedFilters = formatFilters(filters);
    const hasFilters = Object.keys(formattedFilters).length > 0;

    let response: RawPerfumesApiResponse | null = null;

    if (hasFilters) {
      // 필터가 있을 경우 POST 요청
      const requestBody = {
        searchText: searchText || "",
        cursor: cursor || undefined,
        limit: 15,
        ...formattedFilters,
      };

      response = await apiClient.post<
        typeof requestBody,
        RawPerfumesApiResponse
      >("/search/perfumes", requestBody);
    } else {
      // 필터가 없을 경우 GET 요청
      const params = {
        q: searchText || undefined,
        cursor: cursor || undefined,
        limit: "15",
      };

      response = await apiClient.get<RawPerfumesApiResponse>(
        "/search/perfumes",
        params
      );
    }

    if (response && response.success) {
      return response.data;
    }
    throw new Error(
      response?.message || "향수 정보를 불러오는 데 실패했습니다."
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
export const getUniquePerfumes = (perfumes: PerfumeBaseResponse[]): PerfumeBaseResponse[] => {
  const uniqueMap = new Map<string, PerfumeBaseResponse>();

  perfumes.forEach(perfume => {
    if (!uniqueMap.has(perfume.id)) {
      uniqueMap.set(perfume.id, perfume);
    }
  });

  return Array.from(uniqueMap.values());
};
