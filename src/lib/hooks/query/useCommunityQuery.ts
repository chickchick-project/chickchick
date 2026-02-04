import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  CreatePostInput,
  GetPostsQuery,
  UpdatePostInput,
} from "@/lib/hono/schemas/community.schema";
import { communityApi } from "../../utils/api/community.api";
import { queryKeys } from "../../utils/queryKeys";

// 커뮤니티 게시글 목록 조회
export const useCommunityPosts = (params?: GetPostsQuery, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.community.posts({
      searchKeyword: params?.q || "",
      filters: {
        category: params?.category,
        sortBy: params?.sortBy,
      },
    }),
    queryFn: () => communityApi.list(params),
    enabled,
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

/**
 * 커뮤니티 게시글 생성
 */
export const useCreateCommunityPost = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (newPost: CreatePostInput) => communityApi.create(newPost),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.lists(),
      });
      if (response && response.success) {
        router.push(`/community/post/${response.data.id}`);
      }
    },
  });
};

/**
 * 커뮤니티 게시글 수정
 */
export const useUpdateCommunityPost = (postId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (updatedPost: UpdatePostInput) =>
      communityApi.update(postId, updatedPost),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.post(postId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.lists(),
      });
      router.push(`/community/post/${postId}`);
    },
  });
};

/**
 * 커뮤니티 게시글 삭제
 */
export const useDeleteCommunityPost = (postId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => communityApi.delete(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.lists(),
      });
      router.push("/community");
    },
  });
};

/**
 * 기존 usePostMutation 호환성 wrapper
 */
export const usePostMutation = (postId?: string) => {
  return {
    createMutation: useCreateCommunityPost(),
    editMutation: useUpdateCommunityPost(postId!),
    deleteMutation: useDeleteCommunityPost(postId!),
  };
};
