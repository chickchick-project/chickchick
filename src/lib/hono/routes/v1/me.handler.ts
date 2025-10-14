import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { createStandardApiResponses } from "@/lib/hono/utils/createStandardApiResponses";
import * as MeServices from "@/lib/hono/services/me.service";
import * as MeSchemas from "@/lib/hono/schemas/me.schema";
import type { AppContext } from "@/lib/hono/app";
import { authMiddleware } from "@/lib/hono/middleware/auth.middleware";
import {
  apiInternalError,
  apiSuccess,
  apiNotFound,
  apiForbidden,
  apiBadRequest,
} from "@/lib/hono/utils/apiResponse.utils";
import { getAuthenticatedUser } from "@/lib/hono/utils/service.utils";

const meApi = new OpenAPIHono<AppContext>();

meApi.use("*", authMiddleware);

const collectionIdParam = z.object({
  collectionId: z
    .string()
    .uuid()
    .openapi({
      param: { name: "collectionId", in: "path" },
      example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    }),
});

/**
 * @method GET
 * @path /me/bookmarks/posts
 * @summary 내 북마크 게시글 목록 조회
 */
const getMyBookmarkedPostsRoute = createRoute({
  method: "get",
  path: "/bookmarks/posts",
  summary: "내 북마크 게시글 목록 조회",
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiMyBookmarkedPostsResponseSchema,
  }),
  tags: ["Me"],
});

meApi.openapi(getMyBookmarkedPostsRoute, async (c) => {
  const user = getAuthenticatedUser(c);
  const result = await MeServices.getMyBookmarkedPostsService(user.id);

  if (!result.success) {
    return apiInternalError(c, result.message);
  }
  return apiSuccess(
    c,
    result.data,
    "북마크한 게시글 목록을 성공적으로 불러왔습니다."
  );
});

/**
 * @method GET
 * @path /me/bookmarks/perfumes
 * @summary 내 북마크 향수 목록 조회
 */
const getMyBookmarkedPerfumesRoute = createRoute({
  method: "get",
  path: "/bookmarks/perfumes",
  summary: "내 북마크 향수 목록 조회",
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiMyBookmarkedPerfumesResponseSchema,
  }),
  tags: ["Me"],
});

meApi.openapi(getMyBookmarkedPerfumesRoute, async (c) => {
  const user = getAuthenticatedUser(c);

  const result = await MeServices.getMyBookmarkedPerfumesService(user.id);

  if (!result.success) {
    return apiInternalError(c, result.message);
  }
  return apiSuccess(
    c,
    result.data,
    "북마크한 향수 목록을 성공적으로 불러왔습니다."
  );
});

/**
 * @method POST
 * @path /me/collections
 * @summary 내 향수 컬렉션 등록
 */
const postPhotoCollectionRoute = createRoute({
  method: "post",
  path: "/collections",
  summary: "내 향수 컬렉션 등록",
  requestBody: {
    required: true,
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            perfumeId: { type: "string" },
            imageFile: { type: "string", format: "binary" },
            comment: { type: "string" },
          },
          required: ["perfumeId", "imageFile"],
        },
      },
    },
  },
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiMyBookmarkedPerfumesResponseSchema,
  }),
  tags: ["Me"],
});

meApi.openapi(postPhotoCollectionRoute, async (c) => {
  const user = getAuthenticatedUser(c);
  const formData = await c.req.formData();

  const perfumeId = formData.get("perfumeId");
  const imageFile = formData.get("imageFile");
  const comment = formData.get("comment");

  if (!perfumeId || typeof perfumeId !== "string") {
    return apiBadRequest(c, "올바른 perfumeId가 필요합니다.");
  }

  if (!imageFile || !(imageFile instanceof File)) {
    return apiBadRequest(c, "이미지 파일이 필요합니다.");
  }

  const commentString =
    comment && typeof comment === "string" ? comment : undefined;

  const data = {
    userId: user.id,
    perfumeId,
    imageFile,
    comment: commentString,
  };

  const result = await MeServices.postPhotoCollectionService(data);

  if (!result.success) {
    switch (result.error) {
      case "BAD_REQUEST":
        return apiBadRequest(c, result.message);
      default:
        return apiInternalError(c, result.message);
    }
  }
  return apiSuccess(c, result.data, "향수 컬렉션을 성공적으로 등록했습니다.");
});

/**
 * @method DELETE
 * @path /me/collections/:collectionId
 * @summary 내 향수 컬렉션 삭제
 */
const deletePhotoCollectionRoute = createRoute({
  method: "delete",
  path: "/collections/{collectionId}",
  summary: "내 향수 컬렉션 삭제",
  request: {
    params: collectionIdParam,
  },
  responses: createStandardApiResponses({
    schema: z.object({ message: z.string() }),
  }),
  tags: ["Me"],
});

meApi.openapi(deletePhotoCollectionRoute, async (c) => {
  const user = getAuthenticatedUser(c);
  const { collectionId } = c.req.valid("param");

  const result = await MeServices.deletePhotoCollectionService({
    userId: user.id,
    collectionId,
  });

  if (!result.success) {
    switch (result.error) {
      case "NOT_FOUND":
        return apiNotFound(c, result.message);
      case "FORBIDDEN":
        return apiForbidden(c, result.message);
      default:
        return apiInternalError(c, result.message);
    }
  }
  return apiSuccess(c, result.data, "향수 컬렉션을 성공적으로 삭제했습니다.");
});

/**
 * @method GET
 * @path /me/activity/reviews
 * @summary 내가 작성한 리뷰 목록 조회
 */
const getMyReviewsRoute = createRoute({
  method: "get",
  path: "/activity/reviews",
  summary: "내가 작성한 리뷰 목록 조회",
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiMyReviewsResponseSchema,
  }),
  tags: ["Me"],
});

meApi.openapi(getMyReviewsRoute, async (c) => {
  const user = getAuthenticatedUser(c);

  const result = await MeServices.getMyReviewsService(user.id);

  if (!result.success) {
    return apiInternalError(c, result.message);
  }
  return apiSuccess(
    c,
    result.data,
    "작성한 리뷰 목록을 성공적으로 불러왔습니다."
  );
});

/**
 * @method GET
 * @path /me/activity/posts
 * @summary 내가 작성한 게시글 목록 조회
 */
const getMyPostsRoute = createRoute({
  method: "get",
  path: "/activity/posts",
  summary: "내가 작성한 게시글 목록 조회",
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiMyPostsResponseSchema,
  }),
  tags: ["Me"],
});

meApi.openapi(getMyPostsRoute, async (c) => {
  const user = getAuthenticatedUser(c);

  const result = await MeServices.getMyPostsService(user.id);

  if (!result.success) {
    return apiInternalError(c, result.message);
  }
  return apiSuccess(
    c,
    result.data,
    "작성한 게시글 목록을 성공적으로 불러왔습니다."
  );
});

/**
 * @method GET
 * @path /me/activity/comments
 * @summary 내가 작성한 댓글 목록 조회
 */
const getMyCommentsRoute = createRoute({
  method: "get",
  path: "/activity/comments",
  summary: "내가 작성한 댓글 목록 조회",
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiMyCommentsResponseSchema,
  }),
  tags: ["Me"],
});

meApi.openapi(getMyCommentsRoute, async (c) => {
  const user = getAuthenticatedUser(c);

  const result = await MeServices.getMyCommentsService(user.id);

  if (!result.success) {
    return apiInternalError(c, result.message);
  }
  return apiSuccess(
    c,
    result.data,
    "작성한 댓글 목록을 성공적으로 불러왔습니다."
  );
});

/**
 * @method GET
 * @path /me/activity/liked-perfumes
 * @summary 내가 좋아요한 향수 목록 조회
 */
const getMyLikedPerfumesRoute = createRoute({
  method: "get",
  path: "/activity/liked-perfumes",
  summary: "내가 좋아요한 향수 목록 조회",
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiMyLikedPerfumesResponseSchema,
  }),
  tags: ["Me"],
});

meApi.openapi(getMyLikedPerfumesRoute, async (c) => {
  const user = getAuthenticatedUser(c);

  const result = await MeServices.getMyLikedPerfumesService(user.id);

  if (!result.success) {
    return apiInternalError(c, result.message);
  }
  return apiSuccess(
    c,
    result.data,
    "좋아요한 향수 목록을 성공적으로 불러왔습니다."
  );
});

/**
 * @method GET
 * @path /me/activity/liked-posts
 * @summary 내가 좋아요한 게시글 목록 조회
 */
const getMyLikedPostsRoute = createRoute({
  method: "get",
  path: "/activity/liked-posts",
  summary: "내가 좋아요한 게시글 목록 조회",
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiMyLikedPostsResponseSchema,
  }),
  tags: ["Me"],
});

meApi.openapi(getMyLikedPostsRoute, async (c) => {
  const user = getAuthenticatedUser(c);

  const result = await MeServices.getMyLikedPostsService(user.id);

  if (!result.success) {
    return apiInternalError(c, result.message);
  }
  return apiSuccess(
    c,
    result.data,
    "좋아요한 게시글 목록을 성공적으로 불러왔습니다."
  );
});

/**
 * @method get
 * @path /me/profile
 * @summary 내 정보 조회
 */
const getMyProfileRoute = createRoute({
  method: "get",
  path: "/profile",
  summary: "내 정보 조회",
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiMyProfileResponseSchema,
  }),
  tags: ["Me"],
});

meApi.openapi(getMyProfileRoute, async (c) => {
  const user = getAuthenticatedUser(c);

  const result = await MeServices.getMyProfileService(user.id);

  if (!result.success) {
    if (result.error === "NOT_FOUND") {
      return apiNotFound(c, result.message);
    }
    return apiInternalError(c, result.message);
  }
  return apiSuccess(c, result.data, "내 정보를 성공적으로 불러왔습니다.");
});

/**
 * @method patch
 * @path /me/profile
 * @summary 내 정보 수정
 */
const patchMyProfileRoute = createRoute({
  method: "patch",
  path: "/profile",
  summary: "내 정보 수정",
  request: {
    body: {
      content: {
        "application/json": {
          schema: MeSchemas.ApiUpdateMyProfileRequestSchema,
        },
      },
    },
  },
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiMyProfileResponseSchema,
  }),
  tags: ["Me"],
});

meApi.openapi(patchMyProfileRoute, async (c) => {
  const user = getAuthenticatedUser(c);
  const formData = c.req.valid("json");
  console.log(user, formData);
  if (user.id !== formData.id)
    return apiForbidden(c, "프로필 수정을 할 수 없습니다.");
  const result = await MeServices.updateMyProfileService(formData);

  if (!result.success) {
    return apiInternalError(c, result.message);
  }
  return apiSuccess(c, result.data, "내 정보를 성공적으로 수정했습니다.");
});

/**
 * @method post
 * @path /me/recent-perfumes
 * @summary 최근 본 향수 목록 동기화
 * @request
 * @responses
 * @tags
 */
const postRecentPerfumesRoute = createRoute({
  method: "post",
  path: "/recent-perfumes",
  summary: "최근 본 향수 목록 동기화",
  request: {
    body: {
      content: {
        "application/json": {
          schema: MeSchemas.ApiSyncRecentPerfumesRequestSchema,
        },
      },
    },
  },
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiSyncRecentPerfumesResponseSchema,
  }),
  tags: ["Me"],
});

meApi.openapi(postRecentPerfumesRoute, async (c) => {
  const user = getAuthenticatedUser(c);
  const formData = c.req.valid("json");
  // DB에 최근 본 향수 기록 동기화
  const result = await MeServices.syncRecentPerfumesService({
    userId: user.id,
    perfumeIds: formData.perfumeIds,
  });
  if (!result.success) {
    return apiInternalError(c, result.message);
  }
  return apiSuccess(
    c,
    { receivedPerfumeIds: formData.perfumeIds },
    "최근 본 향수 목록을 성공적으로 동기화했습니다."
  );
});

/**
 * @method post
 * @path /me/recent-posts
 * @summary 최근 본 게시글 목록 동기화
 * @request
 * @responses
 * @tags
 */
const postRecentPostsRoute = createRoute({
  method: "post",
  path: "/recent-posts",
  summary: "최근 본 게시글 목록 동기화",
  request: {
    body: {
      content: {
        "application/json": {
          schema: MeSchemas.ApiSyncRecentPostsRequestSchema,
        },
      },
    },
  },
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiSyncRecentPostsResponseSchema,
  }),
  tags: ["Me"],
});

meApi.openapi(postRecentPostsRoute, async (c) => {
  const user = getAuthenticatedUser(c);
  const formData = c.req.valid("json");
  const result = await MeServices.syncRecentPostsService({
    userId: user.id,
    postIds: formData.postIds,
  });
  if (!result.success) {
    return apiInternalError(c, result.message);
  }
  return apiSuccess(
    c,
    { receivedPostIds: formData.postIds },
    "최근 본 게시글 목록을 성공적으로 동기화했습니다."
  );
});

export default meApi;
