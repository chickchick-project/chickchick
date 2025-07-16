import { z } from "@hono/zod-openapi";
import { CommentSchema, UserSchema } from "@zod/modelSchema";

export const CreateCommentRequestSchema = CommentSchema.pick({
  content: true,
  parentId: true,
}).openapi({
  example: {
    content: "이건 첫 번째 레슨",
    parentId: null,
  },
});

export const CommentResponseSchema = CommentSchema.extend({
  author: UserSchema.pick({
    id: true,
    nickname: true,
    imageUrl: true,
  }),
}).omit({
  authorId: true,
});

export const CommentListResponseSchema = z
  .object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(CommentResponseSchema),
  })
  .openapi("CommentListResponse", {
    description: "댓글 목록",
  });

export const CommentPostIdParamSchema = z.object({
  postId: z.string().uuid("유효하지 않은 게시글 ID입니다."),
});

export type CreateCommentService = z.infer<typeof CreateCommentRequestSchema>;
