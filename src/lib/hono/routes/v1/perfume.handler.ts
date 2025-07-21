import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import * as PerfumeServices from "@/lib/hono/services/perfume.service";
import type { AppContext } from "@/lib/hono/app";
import { createStandardApiResponses } from "@/lib/hono/utils/createStandardApiResponses";
import { authMiddleware } from "@/lib/hono/middleware/auth.middleware";
import * as PerfumeSchemas from "@/lib/hono/schemas/perfume.schema";
import { getAuthenticatedUser } from "@/lib/hono/utils/service.utils";

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
  description: "등록된 모든 향수 데이터를 조회합니다. (확인용)",
  responses: createStandardApiResponses(
    {
      schema: PerfumeSchemas.PerfumeListResponseSchema,
      description: "향수 목록",
    },
    ["404"]
  ),
  tags: ["Perfume"],
});

perfumesApi.openapi(getPerfumesListRoute, async (c) => {
  const perfumes = await PerfumeServices.getPerfumesListService();

  if (!perfumes) {
    return c.json(
      {
        success: false,
        message: "향수 목록을 찾을 수 없습니다.",
      },
      404
    );
  }
  return c.json(
    {
      success: true,
      message: "향수 목록을 성공적으로 불러왔습니다.",
      data: perfumes,
    },
    200
  );
});

/**
 * @method GET
 * @path /perfumes/theme
 * @description 향수 목록을 테마별로 조회합니다.
 * @summary 향수 목록 테마별 조회
 */
const getPerfumesListByThemeRoute = createRoute({
  method: "get",
  path: "/theme",
  summary: "향수 목록 테마별 조회",
  description: "향수 목록을 테마별로 조회합니다.",
  request: {
    query: z.object({
      q: z.string(),
    }),
  },
  responses: createStandardApiResponses(
    {
      schema: PerfumeSchemas.PerfumeListResponseSchema,
      description: "향수 목록",
    },
    ["404"]
  ),
  tags: ["Perfume"],
});

perfumesApi.openapi(getPerfumesListByThemeRoute, async (c) => {
  const theme = c.req.query("q") as string;
  const perfumes = await PerfumeServices.getPerfumesListByThemeService(theme);

  if (!perfumes) {
    return c.json(
      {
        success: false,
        message: "향수 목록을 찾을 수 없습니다.",
      },
      404
    );
  }
  return c.json(
    {
      success: true,
      message: "향수 목록을 성공적으로 불러왔습니다.",
      data: perfumes,
    },
    200
  );
});

/**
 * @method GET
 * @path /perfumes/{id}
 * @description 요청된 향수 ID에 해당하는 단일 향수의 상세 정보를 조회합니다.
 * @summary 특정 향수 상세 조회
 */
export const getPerfumeByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  summary: "특정 향수 조회",
  description: "요청된 향수 ID에 해당하는 단일 향수 정보 조회",
  request: {
    params: z.object({
      id: z
        .string()
        .uuid()
        .openapi({
          param: { name: "id", in: "path" },
          example: "24f3ea90-6c0b-4dc0-ad0f-1077bab6e61e",
        }),
    }),
  },
  responses: createStandardApiResponses(
    {
      schema: PerfumeSchemas.PerfumeDetailResponseSchema,
      description: "향수",
    },
    ["404"]
  ),
  tags: ["Perfume"],
});

perfumesApi.openapi(getPerfumeByIdRoute, async (c) => {
  const { id } = c.req.param();
  const perfume = await PerfumeServices.getPerfumeByIdService(id);
  if (!perfume) {
    return c.json(
      {
        success: false,
        message: "향수를 찾을 수 없습니다.",
      },
      404
    );
  }
  return c.json(
    {
      success: true,
      message: "향수를 성공적으로 불러왔습니다.",
      data: perfume,
    },
    200
  );
});

/**
 * @method POST
 * @path /perfumes/{id}/bookmark
 * @description 특정 향수에 대한 북마크 상태를 토글(추가/제거)합니다. 인증이 필요합니다.
 * @summary 향수 북마크 토글
 */
const bookmarkListRoute = createRoute({
  method: "post",
  path: "/{id}/bookmark",
  summary: "향수 북마크 추가 / 제거",
  request: { params: PerfumeSchemas.PerfumeIdParamSchema },
  responses: createStandardApiResponses(
    {
      schema: PerfumeSchemas.PerfumeListResponseSchema,
      description: "향수 목록",
    },
    ["401", "404"]
  ),
  tags: ["Perfume"],
});

authenticatedApi.openapi(bookmarkListRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = getAuthenticatedUser(c);
  const bookmarks = await PerfumeServices.togglePerfumeBookmarkService(
    id,
    user!.id
  );
  if (!bookmarks) {
    return c.json(
      {
        success: false,
        message: "북마크 목록을 찾을 수 없습니다.",
      },
      404
    );
  }
  return c.json(
    {
      success: true,
      message: "향수 북마크를 성공적으로 추가했습니다.",
      data: bookmarks,
    },
    200
  );
});

perfumesApi.route("/", authenticatedApi);

export default perfumesApi;
