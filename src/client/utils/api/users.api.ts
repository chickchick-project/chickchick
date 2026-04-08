import { apiClient } from "./client";
import { fileApi } from "./files.api";
import { MyComment } from "@/server/hono/services/me";
import {
  ApiResponse,
  ApiSuccessResponse,
  PaginatedResponse,
} from "@/server/hono/schemas/common.schema";
import { ApiPerfumeSimpleResponse } from "@/server/hono/schemas/perfume.schema";
import { ApiReviewResponse } from "@/server/hono/schemas/review.schema";
import { ApiPostResponse } from "@/server/hono/schemas/community.schema";
import {
  ApiMyCollectionResponse,
  ApiMyBookmarkedPerfumesResponse,
  ApiMyProfileResponse,
  ApiUpdateMyProfileRequest,
} from "@/server/hono/schemas/me.schema";

export const USER_ID_REGEX = /^[0-9a-fA-F-]{36}$/;

export const userApi = {
  /**
   * 특정 사용자 프로필 조회
   */
  getById: (userId: string) => {
    return apiClient.get<ApiSuccessResponse<ApiMyProfileResponse>>(
      `/users/${userId}`
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
      return apiClient.get<ApiSuccessResponse<ApiMyProfileResponse>>(`/me`);
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
    /**
     * 프로필 이미지 업로드
     */
    uploadImage: (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      return apiClient.post<FormData, ApiResponse<ApiMyProfileResponse>>(
        `/me/profile/image`,
        formData
      );
    },
    /**
     * 프로필 이미지 업로드 및 프로필 업데이트 (통합 함수)
     * 파일 업로드 후 프로필 정보를 자동으로 업데이트합니다.
     */
    uploadAndUpdateImage: async (file: File, bucketName: string) => {
      // 파일 업로드
      const uploadResponse = await fileApi.upload(file, bucketName);

      if (!uploadResponse?.success) {
        throw new Error("파일 업로드에 실패했습니다.");
      }

      const profilePayload = {
        imageUrl: uploadResponse.data.imageUrl,
      };

      // 프로필 이미지 URL 업데이트
      const response = await meApi.profile.update(profilePayload);

      if (!response?.success) {
        throw new Error("프로필 이미지 업데이트에 실패했습니다.");
      }

      return response;
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
