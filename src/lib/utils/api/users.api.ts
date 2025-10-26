import { createHttpClient } from "@/lib/utils/core-request";
import { MyComment } from "@/lib/hono/services/me.service";
import {
  ApiResponse,
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

const apiClient = createHttpClient({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
});

export const userApi = {
  collections: (userId: string) => {
    return apiClient.get<ApiResponse<ApiMyCollectionResponse[]>>(
      `/users/${userId}/collections`
    );
  },
  bookmarks: {
    perfumes: (userId: string) => {
      return apiClient.get<ApiResponse<ApiMyBookmarkedPerfumesResponse>>(
        `/users/${userId}/bookmarks/perfumes`
      );
    },
  },
};

export const meApi = {
  profile: {
    get: () => {
      return apiClient.get<ApiResponse<ApiMyProfileResponse>>(`/me`);
    },
    update: (data: ApiUpdateMyProfileRequest) => {
      return apiClient.patch<
        ApiUpdateMyProfileRequest,
        ApiResponse<ApiMyProfileResponse>
      >(`/me`, data);
    },
  },

  collections: {
    create: (data: ApiMyCollectionResponse) => {
      return apiClient.post<
        ApiMyCollectionResponse,
        ApiResponse<ApiMyCollectionResponse>
      >(`/me/collections`, data);
    },
    delete: (collectionId: string) => {
      return apiClient.delete<ApiResponse<void>>(
        `/me/collections/${collectionId}`
      );
    },
  },

  bookmarks: {
    perfumes: () => {
      return apiClient.get<ApiResponse<ApiMyBookmarkedPerfumesResponse>>(
        `/me/bookmarks/perfumes`
      );
    },
    posts: () => {
      return apiClient.get<ApiResponse<ApiPostResponse[]>>(
        `/me/bookmarks/posts`
      );
    },
  },

  reviews: (cursor?: string, limit?: number) => {
    return apiClient.get<ApiResponse<PaginatedResponse<ApiReviewResponse>>>(
      `/me/reviews`,
      { cursor, limit }
    );
  },

  posts: (cursor?: string, limit?: number) => {
    return apiClient.get<ApiResponse<PaginatedResponse<ApiPostResponse>>>(
      `/me/posts`,
      { cursor, limit }
    );
  },

  comments: (cursor?: string, limit?: number) => {
    return apiClient.get<ApiResponse<PaginatedResponse<MyComment>>>(
      `/me/comments`,
      { cursor, limit }
    );
  },

  likes: {
    perfumes: () => {
      return apiClient.get<ApiResponse<ApiPerfumeSimpleResponse[]>>(
        `/me/likes/perfumes`
      );
    },
    posts: () => {
      return apiClient.get<ApiResponse<ApiPostResponse[]>>(`/me/likes/posts`);
    },
  },

  recents: {
    perfumes: {
      get: () => {
        return apiClient.get<ApiResponse<ApiPerfumeSimpleResponse[]>>(
          `/me/recents/perfumes`
        );
      },
      sync: (perfumeIds: string[]) => {
        return apiClient.post<
          { perfumeIds: string[] },
          ApiResponse<ApiPerfumeSimpleResponse[]>
        >(`/me/recents/perfumes`, { perfumeIds });
      },
    },
    posts: {
      get: () => {
        return apiClient.get<ApiResponse<ApiPostResponse[]>>(
          `/me/recents/posts`
        );
      },
      sync: (postIds: string[]) => {
        return apiClient.post<
          { postIds: string[] },
          ApiResponse<ApiPostResponse[]>
        >(`/me/recents/posts`, { postIds });
      },
    },
  },
};
