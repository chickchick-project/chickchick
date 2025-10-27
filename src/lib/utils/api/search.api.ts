import { ApiResponse } from "@/lib/hono/schemas/common.schema";
import { PaginatedSearchResponse } from "@/lib/hono/schemas/search.schema";
import { apiClient } from "./client";

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

export const searchApi = {
  /**
   * 향수 검색 (필터 없이)
   */
  perfumes: (params: SearchPerfumesParams) => {
    return apiClient.get<ApiResponse<PaginatedSearchResponse>>(
      "/search/perfumes",
      params as Record<string, unknown>
    );
  },

  /**
   * 향수 검색 (필터 포함)
   */
  perfumesWithFilters: (params: SearchPerfumesWithFiltersParams) => {
    return apiClient.post<
      SearchPerfumesWithFiltersParams,
      ApiResponse<PaginatedSearchResponse>
    >("/search/perfumes", params);
  },

  /**
   * 향수 목록을 검색하고 필터링하는 함수입니다.
   * 필터가 있으면 POST 요청, 없으면 GET 요청을 보냅니다.
   */
  fetchPerfumes: async (
    cursor: string | null,
    searchText: string,
    filters: Record<string, string[]>
  ): Promise<PaginatedSearchResponse> => {
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
        (typeof response === "object" &&
          "message" in response &&
          response.message) ||
          "향수 정보를 불러오는 데 실패했습니다."
      );
    } catch (error) {
      console.error("fetchPerfumes에서 오류 발생:", error);
      throw error;
    }
  },
};
