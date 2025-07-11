import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import * as CommonSchemas from "@/lib/hono/schemas/common.schema";
import * as SearchSchemas from "@/lib/hono/schemas/search.schema";
import { getPaginatedPerfumesService } from "@/lib/hono/services/search.service";

const searchApi = new OpenAPIHono();

/**
 * @method GET
 * @path /search/perfumes
 * @summary 향수 검색 페이지네이션으로 가져오기
 */
const getSearchPerfumeListRoute = createRoute({
  method: "get",
  path: "/perfumes",
  summary: "향수 검색 페이지네이션으로 가져오기",
  description: "요청된 검색어에 해당하는 향수 정보 조회",
  request: {
    query: SearchSchemas.SearchGetQuerySchema,
  },
  responses: {
    200: {
      description: "성공적으로 향수 목록을 반환함",
      content: {
        "application/json": {
          schema: CommonSchemas.SuccessResponseSchema(
            SearchSchemas.PaginatedPerfumeResponseSchema
          ),
        },
      },
    },
    400: {
      description: "잘못된 요청 데이터",
      content: {
        "application/json": {
          schema: CommonSchemas.ErrorResponseSchema,
        },
      },
    },
  },
  tags: ["Search"],
});

searchApi.openapi(getSearchPerfumeListRoute, async (c) => {
  const queryParams = c.req.valid("query");
  const result = await getPaginatedPerfumesService(queryParams);
  return c.json({
    success: true,
    message: "향수 목록을 성공적으로 불러왔습니다.",
    ...result,
  } as const);
});

/**
 * @method POST
 * @path /search/perfumes
 * @summary 필터가 적용된 향수 검색 페이지네이션으로 가져오기
 */
const postSearchPerfumeListRoute = createRoute({
  method: "post",
  path: "/perfumes",
  summary: "필터가 적용된 향수 검색 페이지네이션으로 가져오기",
  description: "요청된 검색어 및 필터에 해당하는 향수 정보 조회",
  request: {
    body: {
      content: {
        "application/json": {
          schema: SearchSchemas.SearchPostBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "성공적으로 향수 목록을 반환함",
      content: {
        "application/json": {
          schema: CommonSchemas.SuccessResponseSchema(
            SearchSchemas.PaginatedPerfumeResponseSchema
          ),
        },
      },
    },
  },
  tags: ["Search"],
});

searchApi.openapi(postSearchPerfumeListRoute, async (c) => {
  const bodyParams = c.req.valid("json");
  const result = await getPaginatedPerfumesService(bodyParams);

  return c.json({
    success: true,
    message: "필터가 적용된 향수 목록을 성공적으로 불러왔습니다.",
    ...result,
  } as const);
});

export default searchApi;
