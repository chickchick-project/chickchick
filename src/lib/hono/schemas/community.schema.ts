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
  q: z.string().optional(),
  category: z.nativeEnum(PostCategory).default(PostCategory.FREEBOARD),
  sortBy: z.enum(["createdAt", "popular"]).default("createdAt"),
  cursor: z.string().uuid("유효하지 않은 커서 ID입니다.").optional(),
  limit: z.coerce.number().int().positive().default(12),
});

export const CreatePostBodySchema = PostSchema.pick({
  title: true,
  content: true,
  category: true,
  thumbnailUrl: true,
});

export const CreatePostPayloadSchema = CreatePostBodySchema.extend({
  authorId: z.string().uuid(),
});

export const UpdatePostSchema = PostSchema.pick({
  title: true,
  content: true,
  category: true,
  thumbnailUrl: true,
}).partial();

export const PostIdParamSchema = z.object({
  id: PostSchema.shape.id,
});

export const PaginatedPostListResponseSchema = z.object({
  data: z.array(PostResponseSchema),
  nextCursor: z.string().uuid().nullable(),
  totalCount: z.number().optional(),
});

// 타입 추론
export type GetPostsQuery = z.infer<typeof GetPostsQuerySchema>;
export type PostResponse = z.infer<typeof PostResponseSchema>;
export type CreatePost = z.infer<typeof CreatePostBodySchema>;
export type CreatePostPayload = z.infer<typeof CreatePostPayloadSchema>;
export type UpdatePost = z.infer<typeof UpdatePostSchema>;
export type PostIdParam = z.infer<typeof PostIdParamSchema>;
export type PaginatedPostListResponse = z.infer<
  typeof PaginatedPostListResponseSchema
>;
