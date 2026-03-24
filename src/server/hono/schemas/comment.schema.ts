import { z } from "@hono/zod-openapi";
import { CommentSchema, UserSchema } from "@zod/modelSchema";
import {
  CursorPaginationSchema,
  PaginatedResponse,
  PaginatedResponseSchema,
} from "./common.schema";

/**
 * 답글 응답 스키마
 * @description 댓글에 대한 답글의 응답 형식
 */
const ReplyResponseSchema = CommentSchema.extend({
  author: UserSchema.pick({
    id: true,
    nickname: true,
    imageUrl: true,
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable(),
}).omit({ authorId: true });

/**
 * 댓글 응답 스키마
 * @description 댓글 조회 시 사용되는 응답 형식 (답글 목록 포함)
 */
export const CommentResponseSchema = ReplyResponseSchema.extend({
  replies: z.array(ReplyResponseSchema),
});

/**
 * 댓글 생성 요청 바디 스키마
 * @description 새로운 댓글을 생성할 때 필요한 데이터
 */
export const CreateCommentBodySchema = CommentSchema.pick({
  content: true,
}).extend({
  parentId: z.string().uuid().nullable().optional(),
});

/**
 * 댓글 생성 페이로드 스키마
 * @description 서비스 레이어에서 사용되는 댓글 생성 데이터 (작성자 ID, 게시글 ID 포함)
 */
export const CreateCommentPayloadSchema = CreateCommentBodySchema.extend({
  authorId: z.string().uuid(),
  postId: z.string().uuid(),
});

/**
 * 댓글 수정 요청 바디 스키마
 * @description 기존 댓글을 수정할 때 필요한 데이터
 */
export const UpdateCommentBodySchema = CommentSchema.pick({
  content: true,
}).extend({
  parentId: z.string().uuid().nullable().optional(),
});

/**
 * 댓글 수정 페이로드 스키마
 * @description 서비스 레이어에서 사용되는 댓글 수정 데이터 (댓글 ID, 작성자 ID 포함)
 */
export const UpdateCommentPayloadSchema = UpdateCommentBodySchema.extend({
  id: z.string().uuid(),
  authorId: z.string().uuid(),
});

/**
 * 게시글 ID 파라미터 스키마
 * @description URL 경로에서 사용되는 게시글 ID 검증
 */
export const PostIdParamSchema = z.object({
  postId: z.string().uuid("유효하지 않은 게시글 ID입니다."),
});

/**
 * 댓글 목록 조회 쿼리 파라미터 스키마
 * @description 커서 기반 페이지네이션 파라미터
 */
export const GetCommentQuerySchema = CursorPaginationSchema;

/**
 * 페이지네이션된 댓글 목록 응답 스키마
 * @description 커서 기반 페이지네이션이 적용된 댓글 목록 응답
 */
export const PaginatedCommentResponseSchema = PaginatedResponseSchema(
  CommentResponseSchema
);

/**
 * 댓글 삭제 페이로드 스키마
 * @description 서비스 레이어에서 사용되는 댓글 삭제 데이터
 */
export const DeleteCommentPayloadSchema = CommentSchema.pick({
  id: true,
  authorId: true,
});

export const DELETED_COMMENT_MESSAGE_BY_USER = "삭제된 댓글입니다.";

/**
 * 댓글 삭제 응답 스키마
 * @description 댓글 삭제 후 반환되는 응답 형식 (소프트 삭제)
 */
export const DeleteCommentResponseSchema = CommentResponseSchema.extend({
  published: z.literal(false),
  content: z.literal(DELETED_COMMENT_MESSAGE_BY_USER),
});

/**
 * 댓글 ID 파라미터 스키마
 * @description URL 경로에서 사용되는 댓글 ID 검증
 */
export const CommentIdParamSchema = z.object({
  commentId: z.string().uuid("유효하지 않은 댓글 ID입니다."),
});

export type GetCommentQuery = z.infer<typeof GetCommentQuerySchema>;
export type CommentReplyResponse = z.infer<typeof ReplyResponseSchema>;
export type CommentResponse = z.infer<typeof CommentResponseSchema>;
export type PaginatedCommentResponse = PaginatedResponse<CommentResponse>;
export type CreateCommentBody = z.infer<typeof CreateCommentBodySchema>;
export type CreateCommentPayload = z.infer<typeof CreateCommentPayloadSchema>;

export type UpdateCommentBody = z.infer<typeof UpdateCommentBodySchema>;
export type UpdateCommentPayload = z.infer<typeof UpdateCommentPayloadSchema>;

export type DeleteCommentPayload = z.infer<typeof DeleteCommentPayloadSchema>;
export type DeleteCommentResponse = z.infer<typeof DeleteCommentResponseSchema>;
