import { z } from "@hono/zod-openapi";
import { PostCategorySchema } from "@prisma-zod/index";

export const PaginatedPostListQuerySchema = z.object({
  q: z.string().default("").optional(),
  category: PostCategorySchema.optional(),
  sortBy: z.enum(["createdAt", "popular"]).default("createdAt").optional(),
  cursor: z.string().uuid("유효하지 않은 커서 ID입니다.").optional(),
  limit: z.string().optional().default("12").transform(Number),
});

const PostListItemSchema = z.object({
  id: z.string().uuid(),
  category: PostCategorySchema,
  title: z.string(),
  content: z.string(),
  thumbnailUrl: z.string().nullable(),
  author: z.object({
    nickname: z.string(),
    imageUrl: z.string().nullable(),
  }),
  likeCount: z.number().int(),
  commentCount: z.number().int(),
  viewCount: z.number().int(),
  createdAt: z.string(),
});

export const PaginatedPostListResponseSchema = z.object({
  data: z.array(PostListItemSchema),
  nextCursor: z.string().uuid().nullable(),
  totalCount: z.number().optional(),
});

export type GetPostListParams = z.infer<typeof PaginatedPostListQuerySchema>;
export type PostListResponse = z.infer<typeof PaginatedPostListResponseSchema>;
