import { createRoute, z } from "@hono/zod-openapi";

import { ApiPostResponseSchema } from "@/server/hono/schemas/community.schema";
import * as CommonSchemas from "@/server/hono/schemas/common.schema";
import * as PerfumeSchemas from "@/server/hono/schemas/perfume.schema";

import * as PerfumeServices from "@/server/hono/services/perfume.service";

import {
  apiInternalError,
  apiNotFound,
  apiSuccess,
} from "@/server/hono/utils/api.utils";
import { createStandardApiResponses } from "@/server/hono/utils/openapi.schema";
import { createDomainRouters } from "@/server/hono/utils/router";
import { getAuthenticatedUser } from "@/server/hono/utils/service.utils";

const routers = createDomainRouters();

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
    schema: z.array(PerfumeSchemas.ApiPerfumeSimpleResponseSchema),
  }),
  tags: ["Perfume"],
});
routers.public.openapi(getPerfumesListRoute, async (c) => {
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
    schema: z.array(PerfumeSchemas.ApiPerfumeSimpleResponseSchema),
  }),
  tags: ["Perfume"],
});

routers.public.openapi(getPerfumesByThemeRoute, async (c) => {
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
 * @path /perfumes/notes
 * @description 모든 향수 노트 목록을 조회합니다.
 * @summary 향수 노트 목록 조회
 */
const getAllNotesRoute = createRoute({
  method: "get",
  path: "/notes",
  summary: "모든 향수 노트 목록 조회",
  responses: createStandardApiResponses({
    schema: z.array(PerfumeSchemas.ApiPerfumeNoteResponseSchema),
  }),
  tags: ["Perfume"],
});

routers.public.openapi(getAllNotesRoute, async (c) => {
  const result = await PerfumeServices.getAllNotesService();
  if (!result.success) return apiInternalError(c, result.message);
  return apiSuccess(
    c,
    result.data,
    "향수 노트 목록을 성공적으로 불러왔습니다."
  );
});

/**
 * @method GET
 * @path /perfumes/accords
 * @description 모든 향수 어코드 목록을 조회합니다.
 * @summary 향수 어코드 목록 조회
 */
const getAllAccordsRoute = createRoute({
  method: "get",
  path: "/accords",
  summary: "모든 향수 어코드 목록 조회",
  responses: createStandardApiResponses({
    schema: z.array(PerfumeSchemas.ApiPerfumeAccordResponseSchema),
  }),
  tags: ["Perfume"],
});

routers.public.openapi(getAllAccordsRoute, async (c) => {
  const result = await PerfumeServices.getAllAccordsService();
  if (!result.success) return apiInternalError(c, result.message);
  return apiSuccess(
    c,
    result.data,
    "향수 어코드 목록을 성공적으로 불러왔습니다."
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
  request: { params: CommonSchemas.PerfumeIdParamSchema },
  responses: createStandardApiResponses({
    schema: PerfumeSchemas.ApiPerfumeDetailResponseSchema,
  }),
  tags: ["Perfume"],
});

routers.public.openapi(getPerfumeByIdRoute, async (c) => {
  const { id } = c.req.valid("param");
  const result = await PerfumeServices.getPerfumeByIdService(id);

  if (!result.success) {
    return result.error === "NOT_FOUND"
      ? apiNotFound(c, result.message)
      : apiInternalError(c, result.message);
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
    params: CommonSchemas.PerfumeIdParamSchema,
    query: z.object({
      take: z.string().optional().default("10").transform(Number),
      cursor: z.string().uuid("유효하지 않은 커서 ID입니다.").optional(),
    }),
  },
  responses: createStandardApiResponses({
    schema: z.array(ApiPostResponseSchema),
  }),
  tags: ["Perfume"],
});

routers.public.openapi(getPerfumePostsRoute, async (c) => {
  const { id: perfumeId } = c.req.valid("param");
  const { take, cursor } = c.req.valid("query");

  const result = await PerfumeServices.getPostsTaggedWithPerfumeService(
    perfumeId,
    { limit: take, cursor }
  );

  if (!result.success) {
    return result.error === "NOT_FOUND"
      ? apiNotFound(c, result.message)
      : apiInternalError(c, result.message);
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
  request: { params: CommonSchemas.PerfumeIdParamSchema },
  responses: createStandardApiResponses({
    schema: z.object({ bookmarked: z.boolean() }),
  }),
  tags: ["Perfume"],
});

routers.authenticated.openapi(toggleBookmarkRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = getAuthenticatedUser(c);
  const result = await PerfumeServices.togglePerfumeBookmarkService(
    id,
    user.id
  );

  if (!result.success) {
    return result.error === "NOT_FOUND"
      ? apiNotFound(c, result.message)
      : apiInternalError(c, result.message);
  }

  const message = result.data.bookmarked
    ? "북마크에 추가되었습니다."
    : "북마크에서 제거되었습니다.";
  return apiSuccess(c, result.data, message);
});

/**
 * @method POST
 * @path /perfumes/{id}/like
 * @description 특정 향수에 대한 좋아요 상태를 토글(추가/제거)합니다. 인증이 필요합니다.
 * @summary 향수 좋아요 토글
 */

const toggleLikeRoute = createRoute({
  method: "post",
  path: "/{id}/like",
  summary: "향수 좋아요 토글",
  request: { params: CommonSchemas.PerfumeIdParamSchema },
  responses: createStandardApiResponses({
    schema: z.object({ liked: z.boolean() }),
  }),
  tags: ["Perfume"],
});

routers.authenticated.openapi(toggleLikeRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = getAuthenticatedUser(c);
  const result = await PerfumeServices.togglePerfumeLikeService(id, user.id);

  if (!result.success) {
    return result.error === "NOT_FOUND"
      ? apiNotFound(c, result.message)
      : apiInternalError(c, result.message);
  }
  const message = result.data.liked
    ? "좋아요에 추가되었습니다."
    : "좋아요에서 제거되었습니다.";
  return apiSuccess(c, result.data, message);
});

export default routers.merge();
