// import { createRoute, z } from "@hono/zod-openapi";
// import { PostCategory } from "@prisma/client";

// export const PaginatedPostListQuerySchema = z.object({
//   q: z.string().default("").optional(),
//   category: z.nativeEnum(PostCategory),
//   sortBy: z.enum(["createdAt", "popular"]).default("createdAt").optional(),
//   cursor: z.string().uuid("유효하지 않은 커서 ID입니다.").optional(),
//   limit: z.string().optional().default("12").transform(Number),
// });

// const PostListItemResultSchema = z.object({
//   id: z.string().uuid(),
//   category: z.nativeEnum(PostCategory),
//   title: z.string(),
//   content: z.string(),
//   thumbnailUrl: z.string().nullable(),
//   author: z.object({
//     nickname: z.string(),
//     imageUrl: z.string().nullable(),
//   }),
//   likeCount: z.number().int(),
//   commentCount: z.number().int(),
//   viewCount: z.number().int(),
//   createdAt: z.string(),
// });

// export const PaginatedPostListResponseSchema = z.object({
//   data: z.array(PostListItemResultSchema),
//   nextCursor: z.string().uuid().nullable(),
//   totalCount: z.number().optional(),
// });

// export const getPostListRoute = createRoute({
//   method: "get",
//   path: "/posts",
//   request: {
//     query: PaginatedPostListQuerySchema,
//   },
//   responses: {
//     200: {
//       content: {
//         "application/json": {
//           schema: PaginatedPostListResponseSchema,
//         },
//       },
//       description: "게시글 목록을 조회합니다.",
//     },
//   },
// });

// export type GetPostsQuery = z.infer<typeof PaginatedPostListQuerySchema>;
// export type PostResponse = z.infer<typeof PostListItemResultSchema>;
// export type PostListResponse = z.infer<typeof PaginatedPostListResponseSchema>;
