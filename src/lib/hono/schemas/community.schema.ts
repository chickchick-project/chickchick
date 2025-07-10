import { z } from "@hono/zod-openapi";
import PostSchema from "@zod/modelSchema/PostSchema";
import UserSchema from "@zod/modelSchema/UserSchema";
import { PaginationSchema } from "./common.schema";
import { PostCategory } from "@prisma/client";

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

// 글 목록 조회 쿼리
export const GetPostsQuerySchema = PaginationSchema.extend({
  searchInput: z.string().optional(),
  category: PostSchema.shape.category.optional(),
});

// 게시글 생성 요청 본문 스키마
export const CreatePostRequestSchema = PostSchema.pick({
  title: true,
  content: true,
  category: true,
  thumbnailUrl: true,
}).openapi({
  example: {
    title: "이건 첫 번째 레슨",
    content: "좋은 건 너만 알기",
    category: PostCategory.FREEBOARD,
    thumbnailUrl: null,
  },
});

// 게시글 수정 요청 본문 스키마
export const UpdatePostRequestSchema =
  CreatePostRequestSchema.partial().openapi({
    example: {
      title: "이건 두 번째 레슨",
      content: "슬픔도 너만 알기",
      category: PostCategory.FREEBOARD,
      thumbnailUrl: null,
    },
  });

// 경로 파라미터 (ID)
export const PostIdParamSchema = z.object({
  id: PostSchema.shape.id,
});

// 타입 추론
export type PostResponse = z.infer<typeof PostResponseSchema>;
export type CreatePostRequest = z.infer<typeof CreatePostRequestSchema>;
