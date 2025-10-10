import { z } from "@hono/zod-openapi";
import { PostSchema, UserSchema } from "@zod/modelSchema";
import { CursorPaginationSchema } from "./common.schema";
import { PostCategory } from "@prisma/client";

const BrandForPerfumeSchema = z.object({
  nameEn: z.string(),
  nameKo: z.string().nullable(),
});

const PerfumeImageForPerfumeSchema = z.object({
  imageUrl: z.string(),
});

const PerfumeForPostSchema = z.object({
  id: z.string().uuid(),
  nameEn: z.string(),
  nameKo: z.string().nullable(),
  brand: BrandForPerfumeSchema,
  perfumeImage: PerfumeImageForPerfumeSchema.nullable(),
});

export const ApiPostResponseSchema = PostSchema.extend({
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

export const ApiPostDetailResponseSchema = ApiPostResponseSchema.extend({
  isAuthor: z.boolean(),
  perfumes: z.array(PerfumeForPostSchema),
}).openapi("ApiPostDetailResponse");

export const ApiPostStatusResponseSchema = PostSchema.pick({
  viewCount: true,
  likeCount: true,
  commentCount: true,
}).extend({
  isLiked: z.boolean(),
  isBookmarked: z.boolean(),
});

export const PaginatedApiPostResponseSchema = z.object({
  data: z.array(ApiPostResponseSchema),
  totalCount: z.number().int(),
  nextCursor: z.string().uuid().nullable(),
});

export const GetPostsQuerySchema = CursorPaginationSchema.extend({
  q: z.string().optional(),
  category: z.nativeEnum(PostCategory).optional(),
  sortBy: z.enum(["createdAt", "popular"]).default("createdAt"),
});

export const CreatePostInputSchema = PostSchema.pick({
  title: true,
  content: true,
  contentText: true,
  category: true,
  thumbnailUrl: true,
}).extend({
  perfumeIds: z.array(z.string().uuid()).optional(),
});

export const CreatePostBodySchema = z.object({
  title: PostSchema.shape.title.min(1, "제목을 입력해주세요."),
  content: PostSchema.shape.content.min(10, "내용을 10자 이상 입력해주세요."),
  category: PostSchema.shape.category,
  perfumeIds: z.array(z.string().uuid()).optional(),
});

export const CreatePostPayloadSchema = CreatePostInputSchema.extend({
  authorId: z.string().uuid(),
});

export const UpdatePostInputSchema = CreatePostInputSchema.partial();

export const PostIdParamSchema = z.object({
  id: PostSchema.shape.id,
});

export type ApiPostResponse = z.infer<typeof ApiPostResponseSchema>;
export type ApiPostDetailResponse = z.infer<typeof ApiPostDetailResponseSchema>;
export type ApiPostStatusResponse = z.infer<typeof ApiPostStatusResponseSchema>;
export type PaginatedApiPostResponse = z.infer<
  typeof PaginatedApiPostResponseSchema
>;
export type GetPostsQuery = z.infer<typeof GetPostsQuerySchema>;
export type CreatePostInput = z.infer<typeof CreatePostInputSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostInputSchema>;
