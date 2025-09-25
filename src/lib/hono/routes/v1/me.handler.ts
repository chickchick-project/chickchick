import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
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

export default meApi;
