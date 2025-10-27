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
};
