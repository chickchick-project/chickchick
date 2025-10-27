import { apiClient } from "./client";
import { ApiSuccessResponse } from "@/lib/hono/schemas/common.schema";
import { ApiPerfumeDetailResponse } from "@/lib/hono/schemas/perfume.schema";
import { PerfumeNote, PerfumeAccord } from "@prisma/client";

export const perfumeApi = {
  /**
   * 향수 목록 조회
   */
  list: () => {
    return apiClient.get<ApiSuccessResponse<ApiPerfumeDetailResponse>>(
      `/perfumes`
    );
  },
  /**
   * 특정 향수 상세 조회
   */
  detail: (id: string) => {
    return apiClient.get<ApiSuccessResponse<ApiPerfumeDetailResponse>>(
      `/perfumes/${id}`
    );
  },
  /**
   * 모든 향수 노트 목록 조회
   */
  notes: () => {
    return apiClient.get<
      ApiSuccessResponse<PerfumeNote[]>,
      PerfumeNote[]
    >(
      `/perfumes/notes`,
      {},
      {
        transformResponse: (response: ApiSuccessResponse<PerfumeNote[]>) =>
          response.data,
      }
    );
  },
  /**
   * 모든 향수 어코드 목록 조회
   */
  accords: () => {
    return apiClient.get<
      ApiSuccessResponse<PerfumeAccord[]>,
      PerfumeAccord[]
    >(
      `/perfumes/accords`,
      {},
      {
        transformResponse: (response: ApiSuccessResponse<PerfumeAccord[]>) =>
          response.data,
      }
    );
  },
};
