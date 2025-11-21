import { useQuery } from "@tanstack/react-query";
import { communityApi } from "../../utils/api/community.api";
import { queryKeys } from "../../utils/queryKeys";
import { GetPostsQuery } from "@/lib/hono/schemas/community.schema";

// 커뮤니티 게시글 목록 조회
export const useCommunityPosts = (params?: GetPostsQuery) => {
  return useQuery({
    queryKey: queryKeys.community.posts({
      searchKeyword: params?.q || "",
      filters: {
        category: params?.category,
        sortBy: params?.sortBy,
      },
    }),
    queryFn: () => communityApi.list(params),
    select: (response) => {
      if (!response || !response.success) return null;
      return response.data;
    },
  });
};

// 커뮤니티 게시글 단일 조회
export const useCommunityPost = (id: string) => {
  return useQuery({
    queryKey: queryKeys.community.post(id),
    queryFn: () => communityApi.getById(id),
    enabled: !!id,
    select: (response) => {
      if (!response || !response.success) return null;
      return response.data;
    },
  });
};

export const useCommunityPostForEdit = (
  id: string | undefined,
  type: "edit" | "create"
) => {
  return useQuery({
    queryKey: queryKeys.community.post(id || ""),
    queryFn: () => communityApi.getById(id!),
    enabled: type === "edit" && !!id,
    select: (response) => {
      if (!response || !response.success) return null;
      return response.data;
    },
  });
};

// 커뮤니티 게시글 상태 정보 조회
export const useCommunityPostStatus = (id: string) => {
  return useQuery({
    queryKey: queryKeys.community.postStatus(id),
    queryFn: () => communityApi.getStatus(id),
    enabled: !!id,
    select: (response) => {
      if (!response || !response.success) return null;
      return response.data;
    },
  });
};

// 커뮤니티 게시글 카테고리 내 다른 게시글 조회
export const useCommunityPostCategoryPosts = (id: string) => {
  return useQuery({
    queryKey: queryKeys.community.postCategoryPosts(id),
    queryFn: () => communityApi.getCategoryPosts(id),
    enabled: !!id,
    select: (response) => {
      if (!response || !response.success) return null;
      return response.data;
    },
  });
};
