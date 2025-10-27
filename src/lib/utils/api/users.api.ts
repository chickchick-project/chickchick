import { apiClient } from "./client";
import { MyComment } from "@/lib/hono/services/me.service";
import {
  ApiResponse,
  ApiSuccessResponse,
  PaginatedResponse,
} from "@/lib/hono/schemas/common.schema";
import { ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";
import { ApiReviewResponse } from "@/lib/hono/schemas/review.schema";
import { ApiPostResponse } from "@/lib/hono/schemas/community.schema";
import {
  ApiMyCollectionResponse,
  ApiMyBookmarkedPerfumesResponse,
  ApiMyProfileResponse,
  ApiUpdateMyProfileRequest,
} from "@/lib/hono/schemas/me.schema";

const USER_ID_REGEX = /^[0-9a-fA-F-]{36}$/;

export const userApi = {
  /**
   * 특정 사용자 프로필 조회
   */
  getById: (userId: string) => {
    return apiClient.get<
      ApiSuccessResponse<ApiMyProfileResponse>,
      ApiMyProfileResponse
    >(
      `/users/${userId}`,
      {},
      {
        transformResponse: (
          response: ApiSuccessResponse<ApiMyProfileResponse>
        ) => {
          const user = response.data;
          if (typeof user.id !== "string" || !USER_ID_REGEX.test(user.id)) {
            throw new Error(
              "서버로부터 받은 사용자 ID 형식이 올바르지 않습니다."
            );
          }
          return user;
        },
      }
    );
  },
  /**
   * 특정 사용자의 컬렉션 목록 조회
   */
  collections: (userId: string) => {
    return apiClient.get<ApiResponse<ApiMyCollectionResponse[]>>(
      `/users/${userId}/collections`
    );
  },
  bookmarks: {
    /**
     * 특정 사용자가 북마크한 향수 목록 조회
     */
    perfumes: (userId: string) => {
      return apiClient.get<ApiResponse<ApiMyBookmarkedPerfumesResponse>>(
        `/users/${userId}/bookmarks/perfumes`
      );
    },
  },
};

export const meApi = {
  profile: {
    /**
     * 내 프로필 정보 조회
     */
    get: () => {
      return apiClient.get<
        ApiSuccessResponse<ApiMyProfileResponse>,
        ApiMyProfileResponse
      >(
        `/me`,
        {},
        {
          transformResponse: (
            response: ApiSuccessResponse<ApiMyProfileResponse>
          ) => response.data,
        }
      );
    },
    /**
     * 내 프로필 정보 수정
     */
    update: (data: ApiUpdateMyProfileRequest) => {
      return apiClient.patch<
        ApiUpdateMyProfileRequest,
        ApiResponse<ApiMyProfileResponse>
      >(`/me`, data);
    },
  },

  collections: {
    /**
     * 내 컬렉션 생성
     */
    create: (data: ApiMyCollectionResponse) => {
      return apiClient.post<
        ApiMyCollectionResponse,
        ApiResponse<ApiMyCollectionResponse>
      >(`/me/collections`, data);
    },
    /**
     * 내 컬렉션 삭제
     */
    delete: (collectionId: string) => {
      return apiClient.delete<ApiResponse<void>>(
        `/me/collections/${collectionId}`
      );
    },
  },

  bookmarks: {
    /**
     * 내가 북마크한 향수 목록 조회
     */
    perfumes: () => {
      return apiClient.get<ApiResponse<ApiMyBookmarkedPerfumesResponse>>(
        `/me/bookmarks/perfumes`
      );
    },
    /**
     * 내가 북마크한 게시글 목록 조회
     */
    posts: () => {
      return apiClient.get<ApiResponse<ApiPostResponse[]>>(
        `/me/bookmarks/posts`
      );
    },
  },

  /**
   * 내 리뷰 목록 조회 (페이지네이션)
   */
  reviews: (cursor?: string, limit?: number) => {
    return apiClient.get<ApiResponse<PaginatedResponse<ApiReviewResponse>>>(
      `/me/reviews`,
      { cursor, limit }
    );
  },

  /**
   * 내 게시글 목록 조회 (페이지네이션)
   */
  posts: (cursor?: string, limit?: number) => {
    return apiClient.get<ApiResponse<PaginatedResponse<ApiPostResponse>>>(
      `/me/posts`,
      { cursor, limit }
    );
  },

  /**
   * 내 댓글 목록 조회 (페이지네이션)
   */
  comments: (cursor?: string, limit?: number) => {
    return apiClient.get<ApiResponse<PaginatedResponse<MyComment>>>(
      `/me/comments`,
      { cursor, limit }
    );
  },

  likes: {
    /**
     * 내가 좋아요한 향수 목록 조회
     */
    perfumes: () => {
      return apiClient.get<ApiResponse<ApiPerfumeSimpleResponse[]>>(
        `/me/likes/perfumes`
      );
    },
    /**
     * 내가 좋아요한 게시글 목록 조회
     */
    posts: () => {
      return apiClient.get<ApiResponse<ApiPostResponse[]>>(`/me/likes/posts`);
    },
  },

  recents: {
    perfumes: {
      /**
       * 최근 본 향수 목록 조회
       */
      get: () => {
        return apiClient.get<ApiResponse<ApiPerfumeSimpleResponse[]>>(
          `/me/recents/perfumes`
        );
      },
      /**
       * 최근 본 향수 동기화
       */
      sync: (perfumeIds: string[]) => {
        return apiClient.post<
          { perfumeIds: string[] },
          ApiResponse<ApiPerfumeSimpleResponse[]>
        >(`/me/recents/perfumes`, { perfumeIds });
      },
    },
    posts: {
      /**
       * 최근 본 게시글 목록 조회
       */
      get: () => {
        return apiClient.get<ApiResponse<ApiPostResponse[]>>(
          `/me/recents/posts`
        );
      },
      /**
       * 최근 본 게시글 동기화
       */
      sync: (postIds: string[]) => {
        return apiClient.post<
          { postIds: string[] },
          ApiResponse<ApiPostResponse[]>
        >(`/me/recents/posts`, { postIds });
      },
    },
  },
};
