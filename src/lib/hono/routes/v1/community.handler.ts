import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import type { AppContext } from "@/lib/hono/app";
import {
  authMiddleware,
  optionalAuthMiddleware,
} from "@/lib/hono/middleware/auth.middleware";
import * as CommunityServices from "@/lib/hono/services/community.service";
import * as CommunitySchemas from "@/lib/hono/schemas/community.schema";
import { createStandardApiResponses } from "@/lib/hono/utils/createStandardApiResponses";
import { getAuthenticatedUser } from "@/lib/hono/utils/service.utils";
import {
  apiBadRequest,
  apiNotFound,
  apiSuccess,
  apiInternalError,
  apiCreated,
  apiForbidden,
} from "@/lib/hono/utils/apiResponse.utils";
import { PostCategory } from "@prisma/client";

const communityApi = new OpenAPIHono<AppContext>();
const authenticatedApi = new OpenAPIHono<AppContext>();

authenticatedApi.use("*", authMiddleware);
communityApi.use("/posts/:id", optionalAuthMiddleware);
communityApi.use("/posts/:id/status", optionalAuthMiddleware);

const postIdParam = z.object({
  id: z
    .string()
    .uuid()
    .openapi({
      param: { name: "id", in: "path" },
      example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    }),
});

/**
 * @method GET
 * @path /posts
 * @summary 커뮤니티 게시글 목록 조회
 */
const getPostListRoute = createRoute({
  method: "get",
  path: "/posts",
  summary: "커뮤니티 게시글 목록 조회",
  request: {
    query: CommunitySchemas.GetPostsQuerySchema,
  },
  responses: createStandardApiResponses({
    schema: CommunitySchemas.PaginatedApiPostResponseSchema,
    description: "게시글 목록",
  }),
  tags: ["Community"],
});

communityApi.openapi(getPostListRoute, async (c) => {
  const queryParams = c.req.valid("query");
  const result = await CommunityServices.getPaginatedPostListService(
    queryParams
  );
  if (!result.success) {
    return apiBadRequest(c, result.message);
  }
  return apiSuccess(c, result.data, "게시글 목록을 성공적으로 불러왔습니다.");
});

/**
 * @method GET
 * @path /posts/{id}
 * @summary 커뮤니티 게시글 단일 조회
 */
const getPostRoute = createRoute({
  method: "get",
  path: "/posts/{id}",
  summary: "커뮤니티 게시글 단일 조회",
  description: "요청된 게시글 ID에 해당하는 단일 게시글 정보 조회",
  request: {
    params: postIdParam,
  },
  responses: createStandardApiResponses(
    {
      schema: CommunitySchemas.ApiPostDetailResponseSchema,
      description: "게시글",
    },
    ["400", "403", "404"]
  ),
  tags: ["Community"],
});

communityApi.openapi(getPostRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = c.get("user");
  const result = await CommunityServices.getPostByIdService(id, user?.id);

  if (!result.success) {
    if (result.error === "NOT_FOUND") return apiNotFound(c, result.message);
    if (result.error === "FORBIDDEN") return apiForbidden(c, result.message);
    if (result.error === "BAD_REQUEST") return apiBadRequest(c, result.message);
    return apiInternalError(c, result.message);
  }
  return apiSuccess(c, result.data, "게시글을 성공적으로 불러왔습니다.");
});

/**
 * @method GET
 * @path /posts/{id}/status
 * @summary 커뮤니티 게시글 상태 정보 조회
 */
const getPostStatusRoute = createRoute({
  method: "get",
  path: "/posts/{id}/status",
  summary: "게시글 상태 정보 조회",
  description:
    "게시글의 카운트 정보(조회수, 좋아요, 댓글)와 현재 사용자의 좋아요/북마크 여부를 조회합니다.",
  request: {
    params: postIdParam,
  },
  responses: createStandardApiResponses(
    {
      schema: CommunitySchemas.ApiPostStatusResponseSchema,
      description: "게시글 상태 정보",
    },
    ["400", "404"]
  ),
  tags: ["Community"],
});

communityApi.openapi(getPostStatusRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = c.get("user");
  const result = await CommunityServices.getPostStatusByIdService(id, user?.id);

  if (!result.success) {
    if (result.error === "NOT_FOUND") return apiNotFound(c, result.message);
    if (result.error === "BAD_REQUEST") return apiBadRequest(c, result.message);
    return apiInternalError(c, result.message);
  }
  return apiSuccess(
    c,
    result.data,
    "게시글 상태 정보를 성공적으로 불러왔습니다."
  );
});

/**
 * @method POST
 * @path /posts
 * @summary 커뮤니티 게시글 생성
 */
const createPostRoute = createRoute({
  method: "post",
  path: "/posts",
  summary: "커뮤니티 게시글 생성",
  description: "커뮤니티 게시글 생성",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CommunitySchemas.CreatePostInputSchema,
        },
      },
    },
  },

  responses: createStandardApiResponses({
    schema: CommunitySchemas.ApiPostResponseSchema,
    description: "게시글",
  }),
  tags: ["Community"],
});

authenticatedApi.openapi(createPostRoute, async (c) => {
  const user = getAuthenticatedUser(c);
  const body = c.req.valid("json");

  const result = await CommunityServices.createPostService({
    ...body,
    authorId: user.id,
  });

  if (!result.success) {
    return result.error === "NOT_FOUND"
      ? apiNotFound(c, result.message)
      : apiInternalError(c, result.message);
  }
  return apiCreated(c, result.data, "게시글을 성공적으로 생성했습니다.");
});

const editPostRoute = createRoute({
  method: "patch",
  path: "/posts/{id}",
  summary: "커뮤니티 게시글 수정",
  description: "커뮤니티 게시글 수정",
  request: {
    params: postIdParam,
    body: {
      content: {
        "application/json": { schema: CommunitySchemas.UpdatePostInputSchema },
      },
    },
  },
  responses: createStandardApiResponses({
    schema: CommunitySchemas.ApiPostResponseSchema,
    description: "수정된 게시글",
  }),
  tags: ["Community"],
});

authenticatedApi.openapi(editPostRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = getAuthenticatedUser(c);

  const result = await CommunityServices.updatePostService(
    id,
    user.id,
    c.req.valid("json")
  );
  if (!result.success) {
    return result.error === "NOT_FOUND"
      ? apiNotFound(c, result.message)
      : result.error === "BAD_REQUEST"
      ? apiBadRequest(c, result.message)
      : result.error === "FORBIDDEN"
      ? apiForbidden(c, result.message)
      : apiInternalError(c, result.message);
  }
  return apiSuccess(c, result.data, "게시글을 성공적으로 수정했습니다.");
});

const deletePostRoute = createRoute({
  method: "delete",
  path: "/posts/{id}",
  summary: "커뮤니티 게시글 삭제",
  description: "커뮤니티 게시글 비공개 처리로 삭제",
  request: {
    params: postIdParam,
  },
  responses: createStandardApiResponses(
    {
      schema: z.object({ category: z.nativeEnum(PostCategory) }),
      description: "삭제된 게시글 정보",
    },
    ["400", "403", "404"]
  ),
  tags: ["Community"],
});

authenticatedApi.openapi(deletePostRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = await getAuthenticatedUser(c);
  const result = await CommunityServices.deletePostService(id, user.id);

  if (!result.success) {
    if (result.error === "NOT_FOUND") return apiNotFound(c, result.message);
    if (result.error === "FORBIDDEN") return apiForbidden(c, result.message);
    if (result.error === "BAD_REQUEST") return apiBadRequest(c, result.message);
    return apiInternalError(c, result.message);
  }
  return apiSuccess(c, result.data, "게시글을 성공적으로 삭제했습니다.");
});

/**
 * @method POST
 * @path /posts/{id}/like
 * @summary 커뮤니티 게시글 좋아요 추가 / 제거
 */
const likePostRoute = createRoute({
  method: "post",
  path: "/posts/{id}/like",
  summary: "게시글 좋아요",
  description: "게시글 좋아요 추가 한번 더 요청하면 자동으로 제거",
  request: { params: postIdParam },
  responses: createStandardApiResponses(
    {
      schema: z.object({ liked: z.boolean(), likeCount: z.number() }),
    },
    ["400", "403", "404"]
  ),
  tags: ["Community"],
});

authenticatedApi.openapi(likePostRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = await getAuthenticatedUser(c);
  const result = await CommunityServices.togglePostLikeService(id, user.id);

  if (!result.success) {
    if (result.error === "NOT_FOUND") return apiNotFound(c, result.message);
    if (result.error === "FORBIDDEN") return apiForbidden(c, result.message);
    if (result.error === "BAD_REQUEST") return apiBadRequest(c, result.message);
    return apiInternalError(c, result.message);
  }
  return apiSuccess(c, result.data, "게시글 좋아요를 성공적으로 추가했습니다.");
});

/**
 * @method POST
 * @path /posts/{id}/bookmark
 * @summary 커뮤니티 게시글 북마크 추가 / 제거
 */
const bookmarkPostRoute = createRoute({
  method: "post",
  path: "/posts/{id}/bookmark",
  summary: "게시글 북마크",
  description: "게시글 북마크 추가 한번 더 요청하면 자동으로 제거",
  request: { params: postIdParam },
  responses: createStandardApiResponses(
    {
      schema: z.object({ bookmarked: z.boolean() }),
    },
    ["400", "403", "404"]
  ),
  tags: ["Community"],
});

authenticatedApi.openapi(bookmarkPostRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = await getAuthenticatedUser(c);
  const result = await CommunityServices.togglePostBookmarkService(id, user.id);

  if (!result.success) {
    if (result.error === "NOT_FOUND") return apiNotFound(c, result.message);
    if (result.error === "FORBIDDEN") return apiForbidden(c, result.message);
    if (result.error === "BAD_REQUEST") return apiBadRequest(c, result.message);
    return apiInternalError(c, result.message);
  }

  return apiSuccess(c, result.data, "게시글 북마크를 성공적으로 추가했습니다.");
});

communityApi.route("/", authenticatedApi);

export default communityApi;
