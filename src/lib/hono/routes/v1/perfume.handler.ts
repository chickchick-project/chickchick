import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import * as PerfumeServices from "@/lib/hono/services/perfume.service";
import type { AppContext } from "@/lib/hono/app";
import { createStandardApiResponses } from "@/lib/hono/utils/createStandardApiResponses";
import { authMiddleware } from "@/lib/hono/middleware/auth.middleware";
import * as PerfumeSchemas from "@/lib/hono/schemas/perfume.schema";

import { getAuthenticatedUser } from "@/lib/hono/utils/service.utils";
import {
  apiInternalError,
  apiNotFound,
  apiSuccess,
} from "../../utils/apiResponse.utils";
import { PostResponseSchema } from "../../schemas/community.schema";

const perfumesApi = new OpenAPIHono();
const authenticatedApi = new OpenAPIHono<AppContext>();

authenticatedApi.use("*", authMiddleware);

/**
 * @method GET
 * @path /perfumes
 * @description 서버에 등록된 모든 향수 데이터를 조회합니다.
 * @summary (개발용) 전체 향수 목록 조회
 */
const getPerfumesListRoute = createRoute({
  method: "get",
  path: "/",
  summary: "모든 향수 목록 조회",
  responses: createStandardApiResponses({
    schema: z.array(PerfumeSchemas.PerfumeBaseResponseSchema),
  }),
  tags: ["Perfume"],
});
perfumesApi.openapi(getPerfumesListRoute, async (c) => {
  const result = await PerfumeServices.getPerfumesListService();
  if (!result.success) return apiInternalError(c, result.message);
  return apiSuccess(c, result.data, "향수 목록을 성공적으로 불러왔습니다.");
});

/**
 * @method GET
 * @path /perfumes/theme
 * @description 향수 목록을 테마별로 조회합니다.
 * @summary 향수 목록 테마별 조회
 */
const getPerfumesByThemeRoute = createRoute({
  method: "get",
  path: "/theme",
  summary: "테마별 향수 목록 조회",
  request: { query: PerfumeSchemas.PerfumeThemeQuerySchema },
  responses: createStandardApiResponses({
    schema: z.array(PerfumeSchemas.PerfumeBaseResponseSchema),
  }),
  tags: ["Perfume"],
});
perfumesApi.openapi(getPerfumesByThemeRoute, async (c) => {
  const { themeName } = c.req.valid("query");
  const result = await PerfumeServices.getPerfumesListByThemeService(themeName);
  if (!result.success) return apiInternalError(c, result.message);
  return apiSuccess(
    c,
    result.data,
    "테마별 향수 목록을 성공적으로 불러왔습니다."
  );
});

/**
 * @method GET
 * @path /perfumes/{id}
 * @description 요청된 향수 ID에 해당하는 단일 향수의 상세 정보를 조회합니다.
 * @summary 특정 향수 상세 조회
 */
const getPerfumeByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  summary: "특정 향수 상세 조회",
  request: { params: PerfumeSchemas.PerfumeIdParamSchema },
  responses: createStandardApiResponses({
    schema: PerfumeSchemas.PerfumeDetailResponseSchema,
  }),
  tags: ["Perfume"],
});
perfumesApi.openapi(getPerfumeByIdRoute, async (c) => {
  const { id } = c.req.valid("param");
  const result = await PerfumeServices.getPerfumeByIdService(id);
  if (!result.success) {
    if (result.error === "NOT_FOUND") return apiNotFound(c, result.message);
    return apiInternalError(c, result.message);
  }
  return apiSuccess(c, result.data, "향수 정보를 성공적으로 불러왔습니다.");
});

/**
 * @method GET
 * @path /perfumes/{id}/posts
 * @description 요청된 향수 ID에 해당하는 향수 태그된 게시글 목록을 페이지네이션하여 조회합니다.
 * @summary 향수 태그된 게시글 목록 조회
 */
const getPerfumePostsRoute = createRoute({
  method: "get",
  path: "/{id}/posts",
  summary: "특정 향수를 태그한 게시글 목록 조회",
  request: {
    params: PerfumeSchemas.PerfumeIdParamSchema,
  },
  responses: createStandardApiResponses({
    schema: z.array(PostResponseSchema),
  }),
  tags: ["Perfume"],
});

perfumesApi.openapi(getPerfumePostsRoute, async (c) => {
  const { id: perfumeId } = c.req.valid("param");

  const result = await PerfumeServices.getPostsTaggedWithPerfumeService(
    perfumeId
  );

  if (!result.success) {
    if (result.error === "NOT_FOUND") return apiNotFound(c, result.message);
    return apiInternalError(c, result.message);
  }

  return apiSuccess(
    c,
    result.data,
    "향수 관련 게시글을 성공적으로 불러왔습니다."
  );
});

/**
 * @method POST
 * @path /perfumes/{id}/bookmark
 * @description 특정 향수에 대한 북마크 상태를 토글(추가/제거)합니다. 인증이 필요합니다.
 * @summary 향수 북마크 토글
 */
const toggleBookmarkRoute = createRoute({
  method: "post",
  path: "/{id}/bookmark",
  summary: "향수 북마크 토글",
  request: { params: PerfumeSchemas.PerfumeIdParamSchema },
  responses: createStandardApiResponses({
    schema: z.object({ bookmarked: z.boolean() }),
  }),
  tags: ["Perfume"],
});
authenticatedApi.openapi(toggleBookmarkRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = await getAuthenticatedUser(c);

  const result = await PerfumeServices.togglePerfumeBookmarkService(
    id,
    user.id
  );
  if (!result.success) {
    if (result.error === "NOT_FOUND") return apiNotFound(c, result.message);
    return apiInternalError(c, result.message);
  }
  const message = result.data.bookmarked
    ? "북마크에 추가되었습니다."
    : "북마크에서 제거되었습니다.";
  return apiSuccess(c, result.data, message);
});

perfumesApi.route("/", authenticatedApi);

export default perfumesApi;
