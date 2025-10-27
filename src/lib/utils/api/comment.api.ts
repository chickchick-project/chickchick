import { apiClient } from "./client";
import { ApiSuccessResponse } from "@/lib/hono/schemas/common.schema";
import {
  CommentResponse,
  PaginatedCommentResponse,
  GetCommentQuery,
  CreateCommentBody,
  UpdateCommentBody,
  DeleteCommentResponse,
} from "@/lib/hono/schemas/comment.schema";

export const commentApi = {
  /**
   * 댓글 목록 조회
   */
  list: (postId: string) => {
    return apiClient.get<ApiSuccessResponse<CommentResponse>>(
      `/${postId}`
    );
  },

  /**
   * 댓글 목록 조회 (커서 기반)
   */
  listWithCursor: (postId: string, params?: GetCommentQuery) => {
    return apiClient.get<ApiSuccessResponse<PaginatedCommentResponse>>(
      `/${postId}/cursor`,
      params
    );
  },

  /**
   * 댓글 생성
   */
  create: (postId: string, data: CreateCommentBody) => {
    return apiClient.post<CreateCommentBody, ApiSuccessResponse<CommentResponse>>(
      `/${postId}`,
      data
    );
  },

  /**
   * 댓글 수정
   */
  update: (commentId: string, data: UpdateCommentBody) => {
    return apiClient.patch<UpdateCommentBody, ApiSuccessResponse<CommentResponse>>(
      `/${commentId}`,
      data
    );
  },

  /**
   * 댓글 삭제 (Soft Delete)
   */
  delete: (commentId: string) => {
    return apiClient.delete<ApiSuccessResponse<DeleteCommentResponse>>(
      `/${commentId}`
    );
  },
};
