import { z } from "@hono/zod-openapi";
import PostSchema from "@zod/modelSchema/PostSchema";
import UserSchema from "@zod/modelSchema/UserSchema";
import { CursorPaginationSchema } from "./common.schema";
import { PostCategory } from "@prisma/client";

// API 응답용 스키마 (목록용)
export const PostResponseSchema = PostSchema.extend({
  author: UserSchema.pick({
    id: true,
    nickname: true,
    imageUrl: true,
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable(),
}).omit({
  userId: true,
  published: true,
});

// 게시글 상세 조회 응답 스키마
export const PostDetailResponseSchema = PostResponseSchema.extend({
  isAuthor: z.boolean(),
});

// 게시글 상태 조회
export const PostStatusResponseSchema = PostSchema.pick({
  viewCount: true,
  likeCount: true,
  commentCount: true,
}).extend({
  isLiked: z.boolean(),
  isBookmarked: z.boolean(),
});

// 글 목록 조회 쿼리
export const GetPostsQuerySchema = CursorPaginationSchema.extend({
  q: z.string().optional(),
  category: z.nativeEnum(PostCategory).optional(),
  sortBy: z.enum(["createdAt", "popular"]).default("createdAt"),
});

export const CreatePostBodySchema = PostSchema.pick({
  title: true,
  content: true,
  category: true,
  thumbnailUrl: true,
}).extend({
  perfumeIds: z.array(z.string().uuid()).optional(),
});

export const CreatePostPayloadSchema = CreatePostBodySchema.extend({
  authorId: z.string().uuid(),
});

export const UpdatePostSchema = CreatePostBodySchema.partial();

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
export type PostDetailResponse = z.infer<typeof PostDetailResponseSchema>;
export type PostStatusResponse = z.infer<typeof PostStatusResponseSchema>;
export type CreatePost = z.infer<typeof CreatePostBodySchema>;
export type CreatePostPayload = z.infer<typeof CreatePostPayloadSchema>;
export type UpdatePost = z.infer<typeof UpdatePostSchema>;
export type PostIdParam = z.infer<typeof PostIdParamSchema>;
export type PaginatedPostListResponse = z.infer<
  typeof PaginatedPostListResponseSchema
>;
