import { apiClient } from "./client";
import { ApiSuccessResponse } from "@/lib/hono/schemas/common.schema";
import {
  ApiBrandDetailResponse,
  ApiBrandSimpleResponse,
} from "@/lib/hono/schemas/brand.schema";

export const brandApi = {
  /**
   * 모든 브랜드 목록 조회
   */
  list: () => {
    return apiClient.get<
      ApiSuccessResponse<ApiBrandSimpleResponse[]>,
      ApiBrandSimpleResponse[]
    >(
      `/brands`,
      {},
      {
        transformResponse: (response: ApiSuccessResponse<ApiBrandSimpleResponse[]>) =>
          response.data,
      }
    );
  },
  /**
   * 특정 브랜드 상세 조회 (ID)
   */
  getById: (id: string) => {
    return apiClient.get<
      ApiSuccessResponse<ApiBrandDetailResponse>,
      ApiBrandDetailResponse
    >(
      `/brands/${id}`,
      {},
      {
        transformResponse: (response: ApiSuccessResponse<ApiBrandDetailResponse>) =>
          response.data,
      }
    );
  },
  /**
   * 특정 브랜드 상세 조회 (한글 이름)
   */
  getByName: (nameKo: string) => {
    return apiClient.get<
      ApiSuccessResponse<ApiBrandDetailResponse>,
      ApiBrandDetailResponse
    >(
      `/brands/name/${encodeURIComponent(nameKo)}`,
      {},
      {
        transformResponse: (response: ApiSuccessResponse<ApiBrandDetailResponse>) =>
          response.data,
      }
    );
  },
};
