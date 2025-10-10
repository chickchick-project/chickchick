import {
  CommentResponse,
  CreateCommentBody,
  DeleteCommentResponse,
  UpdateCommentBody,
} from "@/lib/hono/schemas/comment.schema";
import { ApiSuccessResponse } from "@/lib/hono/utils/response.constants";
import { SearchResponse } from "@/lib/hooks/useInfinityScroll";
import { createHttpClient } from "@/lib/utils/core-request";

const API_BASE_URL = "http://localhost:3000/api/v1";

const apiClient = createHttpClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL,
});

export async function createNewComment(
  postId: string,
  commentData: CreateCommentBody
): Promise<CommentResponse | null> {
  return await apiClient.post(`/comments/${postId}`, commentData);
}

export async function getCommentsByPostId(
  postId: string,
  cursor?: string | null
) {
  const params = {
    cursor: cursor || undefined,
    limit: "7",
  };
  const result = await apiClient.get<
    ApiSuccessResponse<SearchResponse<CommentResponse>>
  >(`/comments/${postId}/cursor`, params);

  if (!result) {
    throw new Error("댓글을 불러오지 못했습니다.");
  }

  return result;
}
export async function editCommentById(
  commentId: string,
  commentData: UpdateCommentBody
): Promise<CommentResponse | null> {
  return await apiClient.patch(`/comments/${commentId}`, commentData);
}

export async function deleteCommentById(
  commentId: string
): Promise<DeleteCommentResponse | null> {
  return await apiClient.delete<DeleteCommentResponse>(
    `/comments/${commentId}`
  );
}
