import { z } from "@hono/zod-openapi";
import { CommentSchema, UserSchema } from "@zod/modelSchema";
import { CursorPaginationSchema } from "./common.schema";

const ReplyResponseSchema = CommentSchema.extend({
  author: UserSchema.pick({
    id: true,
    nickname: true,
    imageUrl: true,
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable(),
}).omit({ authorId: true });

export const CommentResponseSchema = ReplyResponseSchema.extend({
  replies: z.array(ReplyResponseSchema),
});

export const CreateCommentBodySchema = CommentSchema.pick({
  content: true,
}).extend({
  parentId: z.string().uuid().nullable().optional(),
});

export const CreateCommentPayloadSchema = CreateCommentBodySchema.extend({
  authorId: z.string().uuid(),
  postId: z.string().uuid(),
});

export const PostIdParamSchema = z.object({
  postId: z.string().uuid("유효하지 않은 게시글 ID입니다."),
});

export const GetCommentQuerySchema = CursorPaginationSchema;

export const PaginatedCommentResponseSchema = z.object({
  data: z.array(CommentResponseSchema),
  nextCursor: z.string().uuid().nullable(),
  totalCount: z.number().optional(),
});

export const DeleteCommentPayloadSchema = CommentSchema.pick({
  id: true,
  authorId: true,
});

export const DELETED_COMMENT_MESSAGE_BY_USER = "삭제된 댓글입니다.";

export const DeleteCommentResponseSchema = CommentResponseSchema.extend({
  published: z.literal(false),
  content: z.literal(DELETED_COMMENT_MESSAGE_BY_USER),
});

export const CommentIdParamSchema = z.object({
  commentId: z.string().uuid("유효하지 않은 댓글 ID입니다."),
});

export type GetCommentQuery = z.infer<typeof GetCommentQuerySchema>;
export type CommentReplyResponse = z.infer<typeof ReplyResponseSchema>;
export type CommentResponse = z.infer<typeof CommentResponseSchema>;
export type PaginatedCommentResponse = z.infer<
  typeof PaginatedCommentResponseSchema
>;
export type CreateCommentBody = z.infer<typeof CreateCommentBodySchema>;
export type CreateCommentPayload = z.infer<typeof CreateCommentPayloadSchema>;

export type DeleteCommentPayload = z.infer<typeof DeleteCommentPayloadSchema>;
export type DeleteCommentResponse = z.infer<typeof DeleteCommentResponseSchema>;
