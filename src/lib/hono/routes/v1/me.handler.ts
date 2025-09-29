import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { createStandardApiResponses } from "../../utils/createStandardApiResponses";
import * as MeServices from "@/lib/hono/services/me.service";
import * as MeSchemas from "@/lib/hono/schemas/me.schema";
import type { AppContext } from "@/lib/hono/app";
import { authMiddleware } from "@/lib/hono/middleware/auth.middleware";
import { apiInternalError, apiSuccess } from "../../utils/apiResponse.utils";
import { getAuthenticatedUser } from "../../utils/service.utils";

const meApi = new OpenAPIHono<AppContext>();

meApi.use("*", authMiddleware);

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
    schema: MeSchemas.MyBookmarkedPostsResponseSchema,
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
    schema: MeSchemas.MyBookmarkedPerfumesResponseSchema,
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
    schema: MeSchemas.MyBookmarkedPerfumesResponseSchema,
  }),
  tags: ["Me"],
});

meApi.openapi(postPhotoCollectionRoute, async (c) => {
  const user = getAuthenticatedUser(c);
  const formData = await c.req.formData();

  const perfumeId = formData.get("perfumeId");
  const imageFile = formData.get("imageFile");
  const comment = formData.get("comment");

  const data = {
    userId: user.id,
    perfumeId,
    imageFile,
    comment,
  };

  const result = await MeServices.postPhotoCollectionService(data);

  if (!result.success) {
    return apiInternalError(c, result.message);
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
    schema: z.string(),
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
    return apiInternalError(c, result.message);
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
    schema: MeSchemas.MyReviewsResponseSchema,
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
    schema: MeSchemas.MyPostsResponseSchema,
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
    schema: MeSchemas.MyCommentsResponseSchema,
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
    schema: MeSchemas.MyLikedPerfumesResponseSchema,
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
    schema: MeSchemas.MyLikedPostsResponseSchema,
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

export default meApi;
