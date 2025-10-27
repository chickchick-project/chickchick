import { apiClient } from "./client";
import { ApiSuccessResponse } from "@/lib/hono/schemas/common.schema";
import {
  ApiPostResponse,
  ApiPostDetailResponse,
  ApiPostStatusResponse,
  PaginatedApiPostResponse,
  GetPostsQuery,
  CreatePostInput,
  UpdatePostInput,
} from "@/lib/hono/schemas/community.schema";

export const communityApi = {
  /**
   * 커뮤니티 게시글 목록 조회
   */
  list: (params?: GetPostsQuery) => {
    return apiClient.get<ApiSuccessResponse<PaginatedApiPostResponse>>(
      `/posts`,
      params
    );
  },

  /**
   * 커뮤니티 게시글 단일 조회
   */
  getById: (id: string) => {
    return apiClient.get<ApiSuccessResponse<ApiPostDetailResponse>>(
      `/posts/${id}`
    );
  },

  /**
   * 커뮤니티 게시글 상태 정보 조회
   */
  getStatus: (id: string) => {
    return apiClient.get<ApiSuccessResponse<ApiPostStatusResponse>>(
      `/posts/${id}/status`
    );
  },

  /**
   * 커뮤니티 게시글 생성
   */
  create: (data: CreatePostInput) => {
    return apiClient.post<CreatePostInput, ApiSuccessResponse<ApiPostResponse>>(
      `/posts`,
      data
    );
  },

  /**
   * 커뮤니티 게시글 수정
   */
  update: (id: string, data: UpdatePostInput) => {
    return apiClient.patch<
      UpdatePostInput,
      ApiSuccessResponse<ApiPostResponse>
    >(`/posts/${id}`, data);
  },

  /**
   * 커뮤니티 게시글 삭제
   */
  delete: (id: string) => {
    return apiClient.delete<ApiSuccessResponse<{ message: string }>>(
      `/posts/${id}`
    );
  },

  /**
   * 커뮤니티 게시글 좋아요 토글
   */
  toggleLike: (id: string) => {
    return apiClient.post<
      object,
      ApiSuccessResponse<{ liked: boolean; likeCount: number }>
    >(`/posts/${id}/like`, {});
  },

  /**
   * 커뮤니티 게시글 북마크 토글
   */
  toggleBookmark: (id: string) => {
    return apiClient.post<object, ApiSuccessResponse<{ bookmarked: boolean }>>(
      `/posts/${id}/bookmark`,
      {}
    );
  },
};
