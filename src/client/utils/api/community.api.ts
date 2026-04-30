import { apiClient } from "./client";
import { ApiSuccessResponse } from "@/server/hono/schemas/common.schema";
import {
  ApiPostResponse,
  ApiPostDetailResponse,
  ApiPostStatusResponse,
  ApiPostDetailCategoryPostResponse,
  PaginatedApiPostResponse,
  GetPostsQuery,
  CreatePostInput,
  UpdatePostInput,
} from "@/server/hono/schemas/community.schema";

export const COMMUNITY_URL = `/community`;

export const communityApi = {
  /**
   * 커뮤니티 게시글 목록 조회
   */
  list: (params?: GetPostsQuery) => {
    return apiClient.get<ApiSuccessResponse<PaginatedApiPostResponse>>(
      `${COMMUNITY_URL}/posts`,
      params
    );
  },

  /**
   * 커뮤니티 게시글 단일 조회
   */
  getById: (id: string, headers?: HeadersInit) => {
    return apiClient.get<ApiSuccessResponse<ApiPostDetailResponse>>(
      `${COMMUNITY_URL}/posts/${id}`,
      {},
      { headers }
    );
  },

  /**
   * 커뮤니티 게시글 상태 정보 조회
   */
  getStatus: (id: string, headers?: HeadersInit) => {
    return apiClient.get<ApiSuccessResponse<ApiPostStatusResponse>>(
      `${COMMUNITY_URL}/posts/${id}/status`,
      {},
      { headers }
    );
  },

  /**
   * 커뮤니티 게시글 카테고리 내 다른 게시글 조회
   */
  getCategoryPosts: (id: string) => {
    return apiClient.get<
      ApiSuccessResponse<ApiPostDetailCategoryPostResponse[]>
    >(`${COMMUNITY_URL}/posts/${id}/category-posts`);
  },

  /**
   * 커뮤니티 게시글 생성
   */
  create: (data: CreatePostInput) => {
    return apiClient.post<CreatePostInput, ApiSuccessResponse<ApiPostResponse>>(
      `${COMMUNITY_URL}/posts`,
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
    >(`${COMMUNITY_URL}/posts/${id}`, data);
  },

  /**
   * 커뮤니티 게시글 삭제
   */
  delete: (id: string) => {
    return apiClient.delete<ApiSuccessResponse<{ message: string }>>(
      `${COMMUNITY_URL}/posts/${id}`
    );
  },

  /**
   * 커뮤니티 게시글 좋아요 토글
   */
  toggleLike: (id: string) => {
    return apiClient.post<
      object,
      ApiSuccessResponse<{ liked: boolean; likeCount: number }>
    >(`${COMMUNITY_URL}/posts/${id}/like`, {});
  },

  /**
   * 커뮤니티 게시글 북마크 토글
   */
  toggleBookmark: (id: string) => {
    return apiClient.post<object, ApiSuccessResponse<{ bookmarked: boolean }>>(
      `${COMMUNITY_URL}/posts/${id}/bookmark`,
      {}
    );
  },
};
