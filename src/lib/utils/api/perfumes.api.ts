import { createHttpClient } from "@/lib/utils/core-request";
import { ApiSuccessResponse } from "@/lib/hono/schemas/common.schema";
import { ApiPerfumeDetailResponse } from "@/lib/hono/schemas/perfume.schema";

const apiClient = createHttpClient({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
});

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
