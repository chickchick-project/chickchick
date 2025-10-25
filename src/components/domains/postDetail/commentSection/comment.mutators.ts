import { InfiniteData } from "@tanstack/react-query";
import {
  CommentReplyResponse,
  CommentResponse,
  UpdateCommentBody,
} from "@/lib/hono/schemas/comment.schema";
import { ApiSuccessResponse } from "@/lib/hono/schemas/common.schema";
import { SearchResponse } from "@/lib/hooks/useInfinityScroll";

export type CommentsQueryData = InfiniteData<
  ApiSuccessResponse<SearchResponse<CommentResponse>>
>;

export function updateCommentInCache(
  oldData: CommentsQueryData,
  commentId: string,
  commentData: UpdateCommentBody
): CommentsQueryData {
  const { content, parentId } = commentData;
  const newPages = oldData.pages.map((page) => ({
    ...page,
    data: {
      ...page.data,
      data: page.data.data.map((comment: CommentResponse) => {
        if (parentId && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply: CommentReplyResponse) =>
              reply.id === commentId ? { ...reply, content } : reply
            ),
          };
        }

        if (!parentId && comment.id === commentId) {
          return { ...comment, content };
        }
        return comment;
      }),
    },
  }));

  return { ...oldData, pages: newPages };
}
