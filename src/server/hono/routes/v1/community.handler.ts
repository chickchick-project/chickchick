import { createRoute, z } from "@hono/zod-openapi";
import { PostCategory } from "@prisma/client";
import * as CommunitySchemas from "@/server/hono/schemas/community.schema";
import * as CommunityServices from "@/server/hono/services/community";
import {
  apiBadRequest,
  apiNotFound,
  apiSuccess,
  apiInternalError,
  apiCreated,
  apiForbidden,
} from "@/server/hono/utils/api.utils";
import { createStandardApiResponses } from "@/server/hono/utils/openapi.schema";
import { createDomainRouters } from "@/server/hono/utils/router";


const routers = createDomainRouters();

/**
 * @method GET
 * @path /posts
 * @summary 커뮤니티 게시글 목록 조회
 * @description 검색, 카테고리 필터, 정렬 옵션을 사용하여 게시글 목록을 조회합니다
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

routers.public.openapi(getPostListRoute, async (c) => {
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
 * @description 게시글 ID로 게시글 상세 정보를 조회합니다 (선택적 인증)
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
      schema: CommunitySchemas.ApiPostDetailResponseSchema,
      description: "게시글",
    },
    ["400", "403", "404"]
  ),
  tags: ["Community"],
});

routers.optionalAuth.openapi(getPostRoute, async (c) => {
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
 * @description 게시글의 조회수, 좋아요, 댓글 수 및 사용자의 좋아요/북마크 상태를 조회합니다 (선택적 인증)
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
      schema: CommunitySchemas.ApiPostStatusResponseSchema,
      description: "게시글 상태 정보",
    },
    ["400", "404"]
  ),
  tags: ["Community"],
});

/**
 * @method GET
 * @path /posts/{id}/category-posts
 * @summary 커뮤니티 게시글 카테고리 게시글 목록 조회
 * @description 해당 게시글과 같은 카테고리의 다른 게시글 목록을 조회합니다
 */

const getPostCategoryPostsRoute = createRoute({
  method: "get",
  path: "/posts/{id}/category-posts",
  summary: "커뮤니티 게시글 카테고리 게시글 목록 조회",
  description:
    "해당 게시글과 같은 카테고리의 게시글 목록을 조회합니다. 현재 게시글을 포함한 앞의 글 2개, 뒤의 글 12개를 가져옵니다. 최대(15개)",
  request: {
    params: CommunitySchemas.PostIdParamSchema,
  },
  responses: createStandardApiResponses(
    {
      schema: z.array(CommunitySchemas.ApiPostDetailCategoryPostResponseSchema),
      description: "상세페이지와 같은 카테고리 게시글 목록",
    },
    ["400", "404"]
  ),
  tags: ["Community"],
});

routers.public.openapi(getPostCategoryPostsRoute, async (c) => {
  const { id } = c.req.valid("param");
  const result = await CommunityServices.getPostDetailCategoryPostsService(id);

  if (!result.success) {
    if (result.error === "NOT_FOUND") return apiNotFound(c, result.message);
    if (result.error === "BAD_REQUEST") return apiBadRequest(c, result.message);
    return apiInternalError(c, result.message);
  }
  return apiSuccess(
    c,
    result.data,
    "상세페이지에 필요한 카테고리 게시글 목록을 성공적으로 불러왔습니다."
  );
});

routers.optionalAuth.openapi(getPostStatusRoute, async (c) => {
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
 * @description 새로운 커뮤니티 게시글을 생성합니다 (인증 필요)
 */
const createPostRoute = createRoute({
  method: "post",
  path: "/posts",
  summary: "커뮤니티 게시글 생성",
  description: "새로운 커뮤니티 게시글을 생성합니다",
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

routers.authenticated.openapi(createPostRoute, async (c) => {
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");
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

/**
 * @method PATCH
 * @path /posts/{id}
 * @summary 커뮤니티 게시글 수정
 * @description 기존 게시글을 수정합니다 (인증 필요, 작성자만 가능)
 */
const editPostRoute = createRoute({
  method: "patch",
  path: "/posts/{id}",
  summary: "커뮤니티 게시글 수정",
  description: "기존 게시글을 수정합니다",
  request: {
    params: CommunitySchemas.PostIdParamSchema,
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

routers.authenticated.openapi(editPostRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");

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

/**
 * @method DELETE
 * @path /posts/{id}
 * @summary 커뮤니티 게시글 삭제
 * @description 게시글을 소프트 삭제합니다 (인증 필요, 작성자만 가능)
 */
const deletePostRoute = createRoute({
  method: "delete",
  path: "/posts/{id}",
  summary: "커뮤니티 게시글 삭제",
  description: "게시글을 비공개 처리로 소프트 삭제합니다",
  request: {
    params: CommunitySchemas.PostIdParamSchema,
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

routers.authenticated.openapi(deletePostRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");
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
 * @description 게시글 좋아요를 토글합니다 (인증 필요)
 */
const likePostRoute = createRoute({
  method: "post",
  path: "/posts/{id}/like",
  summary: "게시글 좋아요",
  description: "게시글 좋아요 추가 한번 더 요청하면 자동으로 제거",
  request: { params: CommunitySchemas.PostIdParamSchema },
  responses: createStandardApiResponses(
    {
      schema: z.object({ liked: z.boolean(), likeCount: z.number() }),
    },
    ["400", "403", "404"]
  ),
  tags: ["Community"],
});

routers.authenticated.openapi(likePostRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");
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
 * @description 게시글 북마크를 토글합니다 (인증 필요)
 */
const bookmarkPostRoute = createRoute({
  method: "post",
  path: "/posts/{id}/bookmark",
  summary: "게시글 북마크",
  description: "게시글 북마크 추가 한번 더 요청하면 자동으로 제거",
  request: { params: CommunitySchemas.PostIdParamSchema },
  responses: createStandardApiResponses(
    {
      schema: z.object({ bookmarked: z.boolean() }),
    },
    ["400", "403", "404"]
  ),
  tags: ["Community"],
});

routers.authenticated.openapi(bookmarkPostRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");
  const result = await CommunityServices.togglePostBookmarkService(id, user.id);

  if (!result.success) {
    if (result.error === "NOT_FOUND") return apiNotFound(c, result.message);
    if (result.error === "FORBIDDEN") return apiForbidden(c, result.message);
    if (result.error === "BAD_REQUEST") return apiBadRequest(c, result.message);
    return apiInternalError(c, result.message);
  }

  return apiSuccess(c, result.data, "게시글 북마크를 성공적으로 추가했습니다.");
});

export default routers.merge();
