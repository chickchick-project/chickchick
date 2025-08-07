import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

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
} from "../../utils/apiResponse.utils";

const communityApi = new OpenAPIHono<AppContext>();
const authenticatedApi = new OpenAPIHono<AppContext>();

authenticatedApi.use("*", authMiddleware);
communityApi.use("/posts/:id", optionalAuthMiddleware);
communityApi.use("/posts/:id/status", optionalAuthMiddleware);

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
  responses: createStandardApiResponses(
    {
      schema: CommunitySchemas.PaginatedPostListResponseSchema,
      description: "게시글 목록",
    },
    ["404"]
  ),
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
    params: CommunitySchemas.PostIdParamSchema,
  },
  responses: createStandardApiResponses(
    {
      schema: CommunitySchemas.PostResponseSchema,
      description: "게시글",
    },
    ["404"]
  ),
  tags: ["Community"],
});

communityApi.openapi(getPostRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = c.get("user");
  const post = await CommunityServices.getPostByIdService(id, user?.id);
  if (!post.success) {
    return apiNotFound(c, post.message);
  }
  return apiSuccess(c, post.data, "게시글을 성공적으로 불러왔습니다.");
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
    params: CommunitySchemas.PostIdParamSchema,
  },
  responses: createStandardApiResponses(
    {
      schema: CommunitySchemas.PostStatusResponseSchema,
      description: "게시글 상태 정보",
    },
    ["404"]
  ),
  tags: ["Community"],
});

communityApi.openapi(getPostStatusRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = c.get("user");
  const result = await CommunityServices.getPostStatusByIdService(id, user?.id);
  if (!result.success) {
    if (result.error === "NOT_FOUND") return apiNotFound(c, result.message);
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
          schema: CommunitySchemas.CreatePostBodySchema,
        },
      },
    },
  },

  responses: createStandardApiResponses(
    {
      schema: CommunitySchemas.PostResponseSchema,
      description: "게시글",
    },
    ["400", "401"]
  ),
  tags: ["Community"],
});

authenticatedApi.openapi(createPostRoute, async (c) => {
  const user = await getAuthenticatedUser(c);

  const body = c.req.valid("json");
  const payload: CommunitySchemas.CreatePostPayload = {
    ...body,
    authorId: user.id,
  };

  const result = await CommunityServices.createPostService(payload);

  if (!result.success) {
    if (result.error === "NOT_FOUND") return apiNotFound(c, result.message);
    return apiInternalError(c, result.message);
  }
  return apiCreated(c, result.data, "게시글을 성공적으로 생성했습니다.");
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
  request: { params: CommunitySchemas.PostIdParamSchema },
  responses: createStandardApiResponses(
    {
      schema: CommunitySchemas.PostResponseSchema,
      description: "게시글",
    },
    ["401", "404"]
  ),
  tags: ["Community"],
});

authenticatedApi.openapi(likePostRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = await getAuthenticatedUser(c);
  const result = await CommunityServices.togglePostLikeService(id, user.id);

  if (!result.success) {
    return apiNotFound(c, result.message);
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
  request: { params: CommunitySchemas.PostIdParamSchema },
  responses: createStandardApiResponses(
    {
      schema: CommunitySchemas.PostResponseSchema,
      description: "게시글",
    },
    ["401", "404"]
  ),
  tags: ["Community"],
});

authenticatedApi.openapi(bookmarkPostRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = await getAuthenticatedUser(c);
  const result = await CommunityServices.togglePostBookmarkService(id, user.id);

  if (!result.success) {
    return apiNotFound(c, result.message);
  }
  return apiSuccess(c, result.data, "게시글 북마크를 성공적으로 추가했습니다.");
});

communityApi.route("/", authenticatedApi);

export default communityApi;
