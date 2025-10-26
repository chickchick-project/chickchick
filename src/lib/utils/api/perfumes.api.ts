import { apiClient } from "./client";
import { ApiSuccessResponse } from "@/lib/hono/schemas/common.schema";
import { ApiPerfumeDetailResponse } from "@/lib/hono/schemas/perfume.schema";

export const perfumeApi = {
  /**
   * 특정 향수 상세 조회
   */
  detail: (id: string) => {
    return apiClient.get<ApiSuccessResponse<ApiPerfumeDetailResponse>>(
      `/perfumes/${id}`
    );
  },
};
