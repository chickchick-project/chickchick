import type { ApiPerfumeSimpleResponse } from "@/server/hono/schemas/perfume.schema";
import {
  ApiResponse,
  PaginatedResponse,
  UploadedImageInfo,
} from "@/server/hono/schemas/common.schema";
import { apiClient } from "./client";

type SearchResponse = PaginatedResponse<ApiPerfumeSimpleResponse>;
type RawApiResponse = ApiResponse<SearchResponse>;

export const collectionApi = {
  /**
   * 컬렉션 생성
   * @param perfumeId - 향수 ID
   * @param imageInfo - 업로드된 이미지 정보
   * @param comment - 컬렉션 코멘트 (선택)
   */
  create: async (
    perfumeId: string,
    imageInfo: UploadedImageInfo,
    comment?: string
  ) => {
    const collectionPayload = {
      perfumeId,
      comment: comment || undefined,
      imageInfo,
    };

    const response = await apiClient.post("/me/collections", collectionPayload);

    return response;
  },

  /**
   * 향수 검색 (컬렉션 추가 시 향수 태그 검색용)
   * @param query - 검색어
   */
  searchPerfumes: async (query: string): Promise<SearchResponse> => {
    const response = await apiClient.get<RawApiResponse>("/search/perfumes", {
      searchText: query,
    });

    if (!response?.success) {
      throw new Error(
        response?.message || "향수 정보를 불러오는 데 실패했습니다."
      );
    }

    return response.data;
  },
};
