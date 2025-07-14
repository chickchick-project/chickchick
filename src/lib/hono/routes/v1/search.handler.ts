import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import * as SearchSchemas from "@/lib/hono/schemas/search.schema";
import { getPaginatedPerfumesService } from "@/lib/hono/services/search.service";
import { createStandardApiResponses } from "@/lib/hono/utils/createStandardApiResponses";

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
  responses: createStandardApiResponses(
    {
      schema: SearchSchemas.PaginatedPerfumeResponseSchema,
      description: "향수 목록",
    },
    ["400"]
  ),
  tags: ["Search"],
});

searchApi.openapi(getSearchPerfumeListRoute, async (c) => {
  const queryParams = c.req.valid("query");
  const result = await getPaginatedPerfumesService(queryParams);

  if (!result) {
    return c.json(
      {
        success: false,
        message: "검색 결과를 가져오지 못했습니다.",
      },
      400
    );
  }

  return c.json(
    {
      success: true,
      message: "향수 목록을 성공적으로 불러왔습니다.",
      data: result,
    },
    200
  );
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
  responses: createStandardApiResponses(
    {
      schema: SearchSchemas.PaginatedPerfumeResponseSchema,
      description: "향수 목록",
    },
    ["404"]
  ),
  tags: ["Search"],
});

searchApi.openapi(postSearchPerfumeListRoute, async (c) => {
  const bodyParams = c.req.valid("json");
  const result = await getPaginatedPerfumesService(bodyParams);
  if (!result) {
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
      message: "필터가 적용된 향수 목록을 성공적으로 불러왔습니다.",
      data: result,
    },
    200
  );
});

export default searchApi;
