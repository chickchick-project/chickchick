import { z } from "@hono/zod-openapi";
import { PostSchema, UserSchema } from "@zod/modelSchema";
import {
  CursorPaginationSchema,
  PaginatedResponse,
  PaginatedResponseSchema,
} from "./common.schema";
import { PostCategory } from "@prisma/client";

/**
 * 향수용 브랜드 스키마
 * @description 게시글에 포함된 향수의 브랜드 정보
 */
const BrandForPerfumeSchema = z.object({
  nameEn: z.string(),
  nameKo: z.string().nullable(),
  brandUrl: z.string().nullable(),
});

/**
 * 향수용 이미지 스키마
 * @description 게시글에 포함된 향수의 이미지 정보
 */
const PerfumeImageForPerfumeSchema = z.object({
  imageUrl: z.string(),
});

/**
 * 게시글용 향수 스키마
 * @description 게시글에 연결된 향수의 기본 정보 (브랜드, 이미지 포함)
 */
export const PerfumeForPostSchema = z.object({
  id: z.string().uuid(),
  nameEn: z.string(),
  nameKo: z.string().nullable(),
  brand: BrandForPerfumeSchema,
  perfumeImage: PerfumeImageForPerfumeSchema.nullable(),
});

/**
 * 커뮤니티 게시글 응답 스키마
 * @description 게시글 목록 조회 시 사용되는 기본 응답 형식
 */
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
});

/**
 * 커뮤니티 게시글 상세 응답 스키마
 * @description 게시글 상세 조회 시 사용되는 응답 형식 (작성자 여부, 향수 목록 포함)
 */
export const ApiPostDetailResponseSchema = ApiPostResponseSchema.extend({
  isAuthor: z.boolean(),
  perfumes: z.array(PerfumeForPostSchema),
}).openapi("ApiPostDetailResponse");

/**
 * 게시글 상태 응답 스키마
 * @description 게시글의 조회수, 좋아요, 댓글 수 및 사용자 상호작용 상태
 */
export const ApiPostStatusResponseSchema = PostSchema.pick({
  viewCount: true,
  likeCount: true,
  commentCount: true,
}).extend({
  isLiked: z.boolean(),
  isBookmarked: z.boolean(),
});

/**
 * 페이지네이션된 게시글 목록 응답 스키마
 * @description 커서 기반 페이지네이션이 적용된 게시글 목록 응답
 */
export const PaginatedApiPostResponseSchema = PaginatedResponseSchema(
  ApiPostResponseSchema
);

/**
 * 상세 게시글의 같은 카테고리 게시글 스키마
 * @description 게시글 상세 페이지에서 표시되는 같은 카테고리의 다른 게시글 정보
 */
export const ApiPostDetailCategoryPostResponseSchema = PostSchema.pick({
  id: true,
  title: true,
  commentCount: true,
  createdAt: true,
}).extend({
  author: UserSchema.pick({
    id: true,
    nickname: true,
  }),
});

/**
 * 게시글 목록 조회 쿼리 파라미터 스키마
 * @description 게시글 검색, 카테고리 필터, 정렬, 페이지네이션 옵션
 */
export const GetPostsQuerySchema = CursorPaginationSchema.extend({
  q: z.string().optional(),
  category: z.nativeEnum(PostCategory).optional(),
  sortBy: z.enum(["createdAt", "popular"]).default("createdAt"),
});

/**
 * 게시글 생성 입력 스키마
 * @description 서비스 레이어에서 사용되는 게시글 생성 데이터
 */
export const CreatePostInputSchema = PostSchema.pick({
  title: true,
  content: true,
  contentText: true,
  category: true,
  thumbnailUrl: true,
}).extend({
  perfumeIds: z.array(z.string().uuid()).optional(),
});

/**
 * 게시글 생성 요청 바디 스키마
 * @description API 요청 시 사용되는 게시글 생성 데이터 (유효성 검사 포함)
 */
export const CreatePostBodySchema = z.object({
  title: PostSchema.shape.title.min(1, "제목을 입력해주세요."),
  content: PostSchema.shape.content.min(10, "내용을 10자 이상 입력해주세요."),
  category: PostSchema.shape.category,
  perfumeIds: z.array(z.string().uuid()).optional(),
});

/**
 * 게시글 생성 페이로드 스키마
 * @description 서비스 레이어에서 사용되는 게시글 생성 데이터 (작성자 ID 포함)
 */
export const CreatePostPayloadSchema = CreatePostInputSchema.extend({
  authorId: z.string().uuid(),
});

/**
 * 게시글 수정 입력 스키마
 * @description 기존 게시글을 수정할 때 필요한 데이터 (모든 필드 선택적)
 */
export const UpdatePostInputSchema = CreatePostInputSchema.partial();

/**
 * 게시글 ID 파라미터 스키마
 * @description URL 경로에서 사용되는 게시글 ID 검증
 */
export const PostIdParamSchema = z.object({
  id: PostSchema.shape.id,
});

export type ApiPostResponse = z.infer<typeof ApiPostResponseSchema>;
export type ApiPostDetailResponse = z.infer<typeof ApiPostDetailResponseSchema>;
export type ApiPostStatusResponse = z.infer<typeof ApiPostStatusResponseSchema>;
export type ApiPostDetailCategoryPostResponse = z.infer<
  typeof ApiPostDetailCategoryPostResponseSchema
>;
export type PaginatedApiPostResponse = PaginatedResponse<ApiPostResponse>;
export type GetPostsQuery = z.infer<typeof GetPostsQuerySchema>;
export type CreatePostInput = z.infer<typeof CreatePostInputSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostInputSchema>;
export type PerfumeForPost = z.infer<typeof PerfumeForPostSchema>;

export { PostCategory } from "@prisma/client";
