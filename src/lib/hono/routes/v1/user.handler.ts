import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createStandardApiResponses } from "../../utils/createStandardApiResponses";
import { authMiddleware } from "@/lib/hono/middleware/auth.middleware";
import type { AppContext } from "@/lib/hono/app";
import * as UserServices from "@/lib/hono/services/user.service";
import * as UserSchemas from "@/lib/hono/schemas/user.schema";
import {
  apiInternalError,
  apiNotFound,
  apiSuccess,
} from "../../utils/apiResponse.utils";
import { PerfumeBaseResponseSchema } from "@/lib/hono/schemas/perfume.schema";

const usersApi = new OpenAPIHono<AppContext>();

usersApi.use("*", authMiddleware);

/**
 * @method GET
 * @path /{userId}/bookmarks/perfumes
 * @description 요청된 사용자가 북마크한 모든 향수 목록을 조회합니다.
 * @summary 북마크 향수 목록 조회
 */
const getUserProfileRoute = createRoute({
  method: "get",
  path: "/{userId}",
  summary: "특정 사용자 프로필 조회",
  request: { params: UserSchemas.UserIdParamSchema },
  responses: createStandardApiResponses({
    schema: UserSchemas.UserProfileResponseSchema,
  }),
  tags: ["Users"],
});
usersApi.openapi(getUserProfileRoute, async (c) => {
  const { userId } = c.req.valid("param");
  const result = await UserServices.getUserProfileService(userId);

  if (!result.success) {
    if (result.error === "NOT_FOUND") return apiNotFound(c, result.message);
    return apiInternalError(c, result.message);
  }
  return apiSuccess(c, result.data, "사용자 프로필을 성공적으로 불러왔습니다.");
});

/**
 * @method GET
 * @path /{userId}/bookmarks/posts
 * @description 요청된 사용자가 북마크한 모든 게시글 목록을 조회합니다.
 * @summary 북마크 게시글 목록 조회
 */
const getUserPerfumeBookmarksRoute = createRoute({
  method: "get",
  path: "/{userId}/bookmarks/perfumes",
  summary: "사용자의 공개 북마크 향수 목록 조회",
  request: { params: UserSchemas.UserIdParamSchema },
  responses: createStandardApiResponses({
    schema: z.array(PerfumeBaseResponseSchema),
  }),
  tags: ["Users"],
});
usersApi.openapi(getUserPerfumeBookmarksRoute, async (c) => {
  const { userId } = c.req.valid("param");
  const result = await UserServices.getUserPublicBookmarkedPerfumesService(
    userId
  );

  if (!result.success) {
    if (result.error === "NOT_FOUND") return apiNotFound(c, result.message);
    return apiInternalError(c, result.message);
  }
  return apiSuccess(
    c,
    result.data,
    "사용자의 북마크 향수 목록을 성공적으로 불러왔습니다."
  );
});

export default usersApi;
