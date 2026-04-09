import { createRoute, z } from "@hono/zod-openapi";
import * as MeSchemas from "@/server/hono/schemas/me.schema";
import * as MeServices from "@/server/hono/services/me";
import {
  apiBadRequest,
  apiForbidden,
  apiInternalError,
  apiNotFound,
  apiSuccess,
} from "@/server/hono/utils/api.utils";
import { createStandardApiResponses } from "@/server/hono/utils/openapi.schema";
import { createDomainRouters } from "@/server/hono/utils/router";


const routers = createDomainRouters();

// params moved to MeSchemas.DeleteCollectionParamSchema

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

routers.authenticated.openapi(getMyBookmarkedPostsRoute, async (c) => {
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");
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

routers.authenticated.openapi(getMyBookmarkedPerfumesRoute, async (c) => {
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");

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
  request: {
    body: {
      content: {
        "application/json": {
          schema: MeSchemas.PostCollectionRequestSchema,
        },
      },
    },
  },
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiMyCollectionResponseSchema,
  }),
  tags: ["Me"],
});

routers.authenticated.openapi(postPhotoCollectionRoute, async (c) => {
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");
  const body = c.req.valid("json");

  const data = {
    userId: user.id,
    ...body,
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
    params: MeSchemas.DeleteCollectionParamSchema,
  },
  responses: createStandardApiResponses({
    schema: z.object({ message: z.string() }),
  }),
  tags: ["Me"],
});

routers.authenticated.openapi(deletePhotoCollectionRoute, async (c) => {
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");
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
 * @path /me/reviews
 * @summary 내가 작성한 리뷰 목록 조회
 */
const getMyReviewsRoute = createRoute({
  method: "get",
  path: "/reviews",
  summary: "내가 작성한 리뷰 목록 조회",
  request: {
    query: z.object({
      cursor: z.string().uuid().optional(),
      limit: z.coerce.number().int().positive().default(12).optional(),
    }),
  },
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiMyReviewsResponseSchema,
  }),
  tags: ["Me"],
});

routers.authenticated.openapi(getMyReviewsRoute, async (c) => {
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");
  const options = c.req.valid("query");

  const result = await MeServices.getMyReviewsService(user.id, options);

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
 * @path /me/posts
 * @summary 내가 작성한 게시글 목록 조회
 */
const getMyPostsRoute = createRoute({
  method: "get",
  path: "/posts",
  summary: "내가 작성한 게시글 목록 조회",
  request: {
    query: z.object({
      cursor: z.string().uuid().optional(),
      limit: z.coerce.number().int().positive().default(12).optional(),
    }),
  },
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiMyPostsResponseSchema,
  }),
  tags: ["Me"],
});

routers.authenticated.openapi(getMyPostsRoute, async (c) => {
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");
  const options = c.req.valid("query");

  const result = await MeServices.getMyPostsService(user.id, options);

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
 * @path /me/comments
 * @summary 내가 작성한 댓글 목록 조회
 */
const getMyCommentsRoute = createRoute({
  method: "get",
  path: "/comments",
  summary: "내가 작성한 댓글 목록 조회",
  request: {
    query: z.object({
      cursor: z.string().uuid().optional(),
      limit: z.coerce.number().int().positive().default(12).optional(),
    }),
  },
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiMyCommentsResponseSchema,
  }),
  tags: ["Me"],
});

routers.authenticated.openapi(getMyCommentsRoute, async (c) => {
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");
  const options = c.req.valid("query");

  const result = await MeServices.getMyCommentsService(user.id, options);

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
 * @path /me/likes/perfumes
 * @summary 내가 좋아요한 향수 목록 조회
 */
const getMyLikedPerfumesRoute = createRoute({
  method: "get",
  path: "/likes/perfumes",
  summary: "내가 좋아요한 향수 목록 조회",
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiMyLikedPerfumesResponseSchema,
  }),
  tags: ["Me"],
});

routers.authenticated.openapi(getMyLikedPerfumesRoute, async (c) => {
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");

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
 * @path /me/likes/posts
 * @summary 내가 좋아요한 게시글 목록 조회
 */
const getMyLikedPostsRoute = createRoute({
  method: "get",
  path: "/likes/posts",
  summary: "내가 좋아요한 게시글 목록 조회",
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiMyLikedPostsResponseSchema,
  }),
  tags: ["Me"],
});

routers.authenticated.openapi(getMyLikedPostsRoute, async (c) => {
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");

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
 * @path /me
 * @summary 내 정보 조회
 */
const getMyProfileRoute = createRoute({
  method: "get",
  path: "/",
  summary: "내 정보 조회",
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiMyProfileResponseSchema,
  }),
  tags: ["Me"],
});

routers.authenticated.openapi(getMyProfileRoute, async (c) => {
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");

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
 * @path /me
 * @summary 내 정보 수정
 */
const patchMyProfileRoute = createRoute({
  method: "patch",
  path: "/",
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

routers.authenticated.openapi(patchMyProfileRoute, async (c) => {
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");
  const formData = c.req.valid("json");
  const result = await MeServices.updateMyProfileService({
    id: user.id,
    ...formData,
  });

  if (!result.success) {
    return apiInternalError(c, result.message);
  }
  return apiSuccess(c, result.data, "내 정보를 성공적으로 수정했습니다.");
});

/**
 * @method post
 * @path /me/recents/perfumes
 * @summary 최근 본 향수 목록 동기화
 * @request
 * @responses
 * @tags
 */
const postRecentPerfumesRoute = createRoute({
  method: "post",
  path: "/recents/perfumes",
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

routers.authenticated.openapi(postRecentPerfumesRoute, async (c) => {
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");
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
 * @method get
 * @path /me/recents/perfumes
 * @summary 최근 본 향수 목록 조회 (하이드레이션)
 */
const getRecentPerfumesRoute = createRoute({
  method: "get",
  path: "/recents/perfumes",
  summary: "최근 본 향수 목록 조회",
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiGetRecentPerfumesResponseSchema,
  }),
  tags: ["Me"],
});

routers.authenticated.openapi(getRecentPerfumesRoute, async (c) => {
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");
  const result = await MeServices.getRecentPerfumesService(user.id);
  if (!result.success) {
    return apiInternalError(c, result.message);
  }
  return apiSuccess(
    c,
    result.data,
    "최근 본 향수 목록을 성공적으로 조회했습니다."
  );
});

/**
 * @method post
 * @path /me/recents/posts
 * @summary 최근 본 게시글 목록 동기화
 * @request
 * @responses
 * @tags
 */
const postRecentPostsRoute = createRoute({
  method: "post",
  path: "/recents/posts",
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

routers.authenticated.openapi(postRecentPostsRoute, async (c) => {
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");
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

/**
 * @method get
 * @path /me/recents/posts
 * @summary 최근 본 게시글 목록 조회 (하이드레이션)
 */
const getRecentPostsRoute = createRoute({
  method: "get",
  path: "/recents/posts",
  summary: "최근 본 게시글 목록 조회",
  responses: createStandardApiResponses({
    schema: MeSchemas.ApiGetRecentPostsResponseSchema,
  }),
  tags: ["Me"],
});

routers.authenticated.openapi(getRecentPostsRoute, async (c) => {
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");
  const result = await MeServices.getRecentPostsService(user.id);
  if (!result.success) {
    return apiInternalError(c, result.message);
  }
  return apiSuccess(
    c,
    result.data,
    "최근 본 게시글 목록을 성공적으로 조회했습니다."
  );
});

/**
 * @method delete
 * @path /me
 * @summary 회원 탈퇴
 */
const deleteMyAccountRoute = createRoute({
  method: "delete",
  path: "/",
  summary: "회원 탈퇴",
  responses: createStandardApiResponses({
    schema: z.object({ message: z.string() }),
  }),
  tags: ["Me"],
});

routers.authenticated.openapi(deleteMyAccountRoute, async (c) => {
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");

  const result = await MeServices.deleteMyAccountService(user.id);

  if (!result.success) {
    switch (result.error) {
      case "NOT_FOUND":
        return apiNotFound(c, result.message);
      case "BAD_REQUEST":
        return apiBadRequest(c, result.message);
      default:
        return apiInternalError(c, result.message);
    }
  }
  return apiSuccess(c, result.data, result.data.message);
});

export default routers.merge();
