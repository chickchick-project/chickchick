import { z } from "@hono/zod-openapi";
import PostSchema from "@zod/modelSchema/PostSchema";
import UserSchema from "@zod/modelSchema/UserSchema";
import { PaginationSchema } from "./common.schema";

// API 응답용 스키마
export const PostResponseSchema = PostSchema.extend({
  author: UserSchema.pick({
    id: true,
    nickname: true,
    imageUrl: true,
  }),
}).omit({
  userId: true,
  published: true,
});

// 게시글 생성 요청 본문 스키마
export const CreatePostRequestSchema = PostSchema.pick({
  title: true,
  content: true,
  category: true,
}).extend({
  title: z.string().min(2, "제목은 2자 이상이어야 합니다."),
  content: z.string().min(10, "내용은 10자 이상 입력해주세요."),
});

// 게시글 수정 요청 본문 스키마
export const UpdatePostRequestSchema = CreatePostRequestSchema.partial();

// 경로 파라미터 (ID)
export const PostIdParamSchema = z.object({
  id: PostSchema.shape.id,
});

// 목록 조회 쿼리
export const GetPostsQuerySchema = PaginationSchema.extend({
  category: PostSchema.shape.category.optional(),
});

// 타입 추론
export type PostResponse = z.infer<typeof PostResponseSchema>;
export type CreatePostRequest = z.infer<typeof CreatePostRequestSchema>;
