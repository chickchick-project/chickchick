import { apiClient } from "./client";
import { ApiSuccessResponse } from "@/lib/hono/schemas/common.schema";
import {
  AvailableFiltersResponse,
  AvailableFiltersTotalResponse,
  FilterRequestBody,
} from "@/lib/hono/schemas/filter.schema";

export const filterApi = {
  /**
   * 선택 가능한 상세 필터 목록 조회
   * 현재 검색 조건에서 실제로 존재하는 필터 옵션만 반환
   */
  getAvailable: (params: FilterRequestBody) => {
    return apiClient.post<
      FilterRequestBody,
      ApiSuccessResponse<AvailableFiltersResponse>
    >("/filters/available", params);
  },

  /**
   * 필터 카테고리별 총 개수 조회
   */
  getTotal: (params: FilterRequestBody) => {
    return apiClient.post<
      FilterRequestBody,
      ApiSuccessResponse<AvailableFiltersTotalResponse>
    >("/filters/total", params);
  },
};
