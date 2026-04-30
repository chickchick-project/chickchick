import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  CommentReplyResponse,
  CommentResponse,
  CreateCommentBody,
  GetCommentQuery,
  PaginatedCommentResponse,
  UpdateCommentBody,
} from "@/server/hono/schemas/comment.schema";
import { ApiSuccessResponse } from "@/server/hono/schemas/common.schema";
import { commentApi } from "../../utils/api/comment.api";
import { queryKeys } from "../../utils/queryKeys";

// 댓글 목록 조회
export const useComments = (postId: string) => {
  return useQuery({
    queryKey: queryKeys.community.comments(postId),
    queryFn: () => commentApi.list(postId),
    enabled: !!postId,
    select: (response) => {
      if (!response || !response.success) return null;
      return response.data;
    },
  });
};

// 댓글 목록 조회 (커서 기반)
export const useCommentsWithCursor = (
  postId: string,
  params?: GetCommentQuery
) => {
  return useQuery({
    queryKey: [...queryKeys.community.comments(postId), "cursor", params],
    queryFn: () => commentApi.listWithCursor(postId, params),
    enabled: !!postId,
    select: (response) => {
      if (!response || !response.success) return null;
      return response.data;
    },
  });
};

// 댓글 목록 무한 스크롤 조회
export const useInfiniteComments = (postId: string, limit: number = 7) => {
  return useInfiniteQuery({
    queryKey: [...queryKeys.community.comments(postId), "infinite"],
    queryFn: ({ pageParam }) =>
      commentApi.listWithCursor(postId, {
        cursor: pageParam ?? undefined,
        limit,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextCursor || undefined;
    },
    enabled: !!postId,
  });
};

type CommentsInfiniteData = InfiniteData<
  ApiSuccessResponse<PaginatedCommentResponse>
>;

/**
 * 댓글 생성
 */
export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentData: CreateCommentBody) =>
      commentApi.create(postId, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.comments(postId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.postStatus(postId),
      });
    },
  });
};

/**
 * 댓글 수정 (Optimistic Update)
 */
export const useUpdateComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      commentData,
    }: {
      commentId: string;
      commentData: UpdateCommentBody;
    }) => commentApi.update(commentId, commentData),

    onMutate: async ({ commentId, commentData }) => {
      const infiniteQueryKey = [
        ...queryKeys.community.comments(postId),
        "infinite",
      ];
      await queryClient.cancelQueries({ queryKey: infiniteQueryKey });

      const previousData =
        queryClient.getQueryData<CommentsInfiniteData>(infiniteQueryKey);

      // Optimistic update
      queryClient.setQueryData<CommentsInfiniteData>(
        infiniteQueryKey,
        (oldData) => {
          if (!oldData?.pages) return oldData;

          const { content, parentId } = commentData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                data: page.data.data.map((comment: CommentResponse) => {
                  // 대댓글 수정
                  if (parentId && comment.id === parentId) {
                    return {
                      ...comment,
                      replies: comment.replies.map(
                        (reply: CommentReplyResponse) =>
                          reply.id === commentId ? { ...reply, content } : reply
                      ),
                    };
                  }

                  // 일반 댓글 수정
                  if (!parentId && comment.id === commentId) {
                    return { ...comment, content };
                  }

                  return comment;
                }),
              },
            })),
          };
        }
      );

      return { previousData };
    },

    onError: (error, _, context) => {
      if (context?.previousData) {
        const infiniteQueryKey = [
          ...queryKeys.community.comments(postId),
          "infinite",
        ];
        queryClient.setQueryData(infiniteQueryKey, context.previousData);
      }
      console.error(error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.comments(postId),
      });
    },
  });
};

/**
 * 댓글 삭제
 */
export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentApi.delete(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.comments(postId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.postStatus(postId),
      });
    },
  });
};

/**
 * 기존 useCommentMutation 호환성 wrapper
 */
export const useCommentMutation = (postId: string) => {
  return {
    uploadMutation: useCreateComment(postId),
    editMutation: useUpdateComment(postId),
    deleteMutation: useDeleteComment(postId),
  };
};
