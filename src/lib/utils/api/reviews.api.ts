import { apiClient } from "./client";
import { ApiResponse, ApiSuccessResponse } from "@/lib/hono/schemas/common.schema";
import {
  ApiReviewResponse,
  CreateReviewInput,
} from "@/lib/hono/schemas/review.schema";

export const reviewApi = {
  /**
   * 특정 향수의 리뷰 목록 조회
   */
  list: (perfumeId: string) => {
    return apiClient.get<ApiSuccessResponse<ApiReviewResponse[]>>(
      `/reviews/${perfumeId}`
    );
  },

  /**
   * 리뷰 생성
   */
  create: (perfumeId: string, payload: CreateReviewInput) => {
    return apiClient.post<
      CreateReviewInput,
      ApiSuccessResponse<ApiReviewResponse>
    >(`/reviews/${perfumeId}`, payload);
  },

  /**
   * 인기 리뷰 목록 조회
   */
  popular: () => {
    return apiClient.get<ApiResponse<ApiReviewResponse>>("/reviews/popular");
  },
};
