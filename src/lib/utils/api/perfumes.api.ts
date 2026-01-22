import { apiClient } from "./client";
import { ApiSuccessResponse } from "@/lib/hono/schemas/common.schema";
import { ApiPerfumeDetailResponse, ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";
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
   * 테마별 향수 목록 조회
   */
  byTheme: (themeName: string) => {
    return apiClient.get<ApiSuccessResponse<ApiPerfumeSimpleResponse[]>>(
      `/perfumes/theme?themeName=${themeName}`
    );
  },
  /**
   * 모든 향수 노트 목록 조회
   */
  notes: () => {
    return apiClient.get<ApiSuccessResponse<PerfumeNote[]>>(`/perfumes/notes`);
  },
  /**
   * 모든 향수 어코드 목록 조회
   */
  accords: () => {
    return apiClient.get<ApiSuccessResponse<PerfumeAccord[]>>(
      `/perfumes/accords`
    );
  },
};
