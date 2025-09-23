import { PerfumeBaseResponse } from "@/lib/hono/schemas/perfume.schema";
import { FILTER_LABELS } from "./filter/filter.constants";
import { createHttpClient } from "@/lib/utils/core-request";

interface SearchResponse<T> {
  data: T[];
  nextCursor: string | null;
  totalCount: number | null;
}

interface RawPerfumeResponse {
  data: PerfumeBaseResponse[];
  nextCursor: string | null;
  totalCount: number;
}

const apiClient = createHttpClient({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
});

async function fetchPerfumes(
  cursor: string | null,
  searchText: string,
  filters: Record<string, string[]>
): Promise<SearchResponse<PerfumeBaseResponse>> {
  try {
    let result: SearchResponse<PerfumeBaseResponse> | null = null;

    const formattedFilters = formatFilters(filters);
    const hasFilters = Object.keys(formattedFilters).length > 0;

    const transformResponse = (
      response: RawPerfumeResponse
    ): SearchResponse<PerfumeBaseResponse> => {
      return {
        data: response.data || [],
        nextCursor: response.nextCursor || null,
        totalCount: response.totalCount || 0,
      };
    };

    if (hasFilters) {
      // 필터가 있을 경우 POST 요청
      const requestBody = {
        searchText: searchText || "",
        cursor: cursor || undefined,
        limit: 15,
        ...formattedFilters,
      };

      const response = await apiClient.post<
        typeof requestBody,
        RawPerfumeResponse,
        SearchResponse<PerfumeBaseResponse>
      >("/search/perfumes", requestBody, { transformResponse });

      result = response;
    } else {
      // 필터가 없을 경우 GET 요청
      const params = {
        q: searchText || undefined,
        cursor: cursor || undefined,
        limit: "15",
      };

      const response = await apiClient.get<
        RawPerfumeResponse,
        SearchResponse<PerfumeBaseResponse>
      >("/search/perfumes", params, { transformResponse });

      result = response;
    }
    return result ?? { data: [], nextCursor: null, totalCount: 0 };
  } catch (error) {
    console.error("fetchPerfumes 오류:", error);
    return { data: [], nextCursor: null, totalCount: 0 };
  }
}

// 필터를 서버 스키마에 맞게 변환
const formatFilters = (filters: Record<string, string[]>) => {
  const result: {
    brandFilter?: string[];
    notesFilter?: string[];
    accordsFilter?: string[];
  } = {};

  // 키 이름을 서버 스키마에 맞게 매핑
  if (filters.brand) result.brandFilter = filters.brand;
  if (filters.notes) result.notesFilter = filters.notes;
  if (filters.accords) result.accordsFilter = filters.accords;

  return result;
};
const getLabel = (key: string) =>
  FILTER_LABELS[key as keyof typeof FILTER_LABELS] || key;

// const getUniquePerfumes = (
//   perfumes: PerfumeBaseResponse[]
// ): PerfumeBaseResponse[] => {
//   const perfumeMap = new Map<string, PerfumeBaseResponse>();

//   perfumes.forEach((item) => {
//     const existing = perfumeMap.get(item.id);
//     if (!existing) {
//       perfumeMap.set(item.id, item);
//     }
//   });

//   return Array.from(perfumeMap.values());
// };

export { fetchPerfumes, getLabel };
