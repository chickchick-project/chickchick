import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createStandardApiResponses } from "@/lib/hono/utils/createStandardApiResponses";
import { optionalAuthMiddleware } from "@/lib/hono/middleware/auth.middleware";
import type { AppContext } from "@/lib/hono/app";
import * as UserServices from "@/lib/hono/services/user.service";
import * as UserSchemas from "@/lib/hono/schemas/user.schema";
import {
  apiInternalError,
  apiNotFound,
  apiSuccess,
} from "@/lib/hono/utils/apiResponse.utils";
import { ApiPerfumeSimpleResponseSchema } from "@/lib/hono/schemas/perfume.schema";
import { UserCollectionSchema } from "@zod/modelSchema";

const usersApi = new OpenAPIHono<AppContext>();

usersApi.use("*", optionalAuthMiddleware);

const userIdParam = z.object({
  userId: z
    .string()
    .uuid()
    .openapi({
      param: { name: "userId", in: "path" },
      example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    }),
});

/**
 * @method GET
 * @path /{userId}
 * @description 특정 사용자의 프로필 정보를 조회합니다.
 * @summary 사용자 프로필 조회
 */
const getUserProfileRoute = createRoute({
  method: "get",
  path: "/{userId}",
  summary: "특정 사용자 프로필 조회",
  request: { params: userIdParam },
  responses: createStandardApiResponses({
    schema: UserSchemas.ApiUserProfileResponseSchema,
  }),
  tags: ["Users"],
});

usersApi.openapi(getUserProfileRoute, async (c) => {
  const { userId } = c.req.valid("param");
  const result = await UserServices.getUserProfileService(userId);

  if (!result.success) {
    switch (result.error) {
      case "NOT_FOUND":
        return apiNotFound(c, result.message);
      default:
        return apiInternalError(c, result.message);
    }
  }
  return apiSuccess(c, result.data, "사용자 프로필을 성공적으로 불러왔습니다.");
});

/**
 * @method GET
 * @path /{userId}/bookmarks/perfumes
 * @description 요청된 사용자가 북마크한 모든 향수 목록을 조회합니다.
 * @summary 북마크 향수 목록 조회
 */
const getUserPerfumeBookmarksRoute = createRoute({
  method: "get",
  path: "/{userId}/bookmarks/perfumes",
  summary: "사용자의 공개 북마크 향수 목록 조회",
  request: { params: userIdParam },
  responses: createStandardApiResponses({
    schema: z.array(ApiPerfumeSimpleResponseSchema),
  }),
  tags: ["Users"],
});
usersApi.openapi(getUserPerfumeBookmarksRoute, async (c) => {
  const { userId } = c.req.valid("param");
  const result = await UserServices.getUserPublicBookmarkedPerfumesService(
    userId
  );

  if (!result.success) {
    switch (result.error) {
      case "NOT_FOUND":
        return apiNotFound(c, result.message);
      default:
        return apiInternalError(c, result.message);
    }
  }
  return apiSuccess(
    c,
    result.data,
    "사용자의 북마크 향수 목록을 성공적으로 불러왔습니다."
  );
});

/**
 * @method GET
 * @path /{userId}/collections
 * @description 사용자의 컬렉션 목록을 조회합니다.
 * @summary 사용자의 컬렉션 목록 조회
 */
const getUserCollectionsRoute = createRoute({
  method: "get",
  path: "/{userId}/collections",
  summary: "사용자의 컬렉션 목록 조회",
  request: { params: userIdParam },
  responses: createStandardApiResponses({
    schema: z.array(UserCollectionSchema),
  }),
  tags: ["Users"],
});

usersApi.openapi(getUserCollectionsRoute, async (c) => {
  const { userId } = c.req.valid("param");
  const result = await UserServices.getUserCollectionsService(userId);

  if (!result.success) {
    return apiInternalError(c, result.message);
  }
  return apiSuccess(
    c,
    result.data,
    "사용자의 컬렉션 목록을 성공적으로 불러왔습니다."
  );
});

export default usersApi;
