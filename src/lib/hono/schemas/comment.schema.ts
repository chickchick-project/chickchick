import { z } from "@hono/zod-openapi";
import { CommentSchema, UserSchema } from "@zod/modelSchema";

const ReplyResponseSchema = CommentSchema.extend({
  author: UserSchema.pick({
    id: true,
    nickname: true,
    imageUrl: true,
  }),
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

export type CommentResponse = z.infer<typeof CommentResponseSchema>;
export type CreateCommentBody = z.infer<typeof CreateCommentBodySchema>;
export type CreateCommentPayload = z.infer<typeof CreateCommentPayloadSchema>;
