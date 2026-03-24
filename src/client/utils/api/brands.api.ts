import { apiClient } from "./client";
import { ApiSuccessResponse } from "@/server/hono/schemas/common.schema";
import {
  ApiBrandDetailResponse,
  ApiBrandSimpleResponse,
} from "@/server/hono/schemas/brand.schema";

export const brandApi = {
  /**
   * 모든 브랜드 목록 조회
   */
  list: () => {
    return apiClient.get<ApiSuccessResponse<ApiBrandSimpleResponse[]>>(
      `/brands`
    );
  },
  /**
   * 특정 브랜드 상세 조회 (ID)
   */
  getById: (id: string) => {
    return apiClient.get<ApiSuccessResponse<ApiBrandDetailResponse>>(
      `/brands/${id}`
    );
  },
  /**
   * 특정 브랜드 상세 조회 (한글 이름)
   */
  getByName: (nameKo: string) => {
    return apiClient.get<ApiSuccessResponse<ApiBrandDetailResponse>>(
      `/brands/name/${encodeURIComponent(nameKo)}`
    );
  },
};
