import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import * as SearchSchemas from "@/lib/hono/schemas/search.schema";
import { searchPerfumesService } from "@/lib/hono/services/search.service";
import { createStandardApiResponses } from "../../utils/openapi.schema";
import { apiInternalError, apiSuccess } from "../../utils/api.utils";

const searchApi = new OpenAPIHono();

/**
 * @method GET
 * @path /search/perfumes
 * @summary 향수 검색 페이지네이션으로 가져오기
 */
const getSearchRoute = createRoute({
  method: "get",
  path: "/perfumes",
  summary: "향수 검색 (간단)",
  request: {
    query: SearchSchemas.SearchGetQuerySchema,
  },
  responses: createStandardApiResponses({
    schema: SearchSchemas.PaginatedSearchResponseSchema,
  }),
  tags: ["Search"],
});

searchApi.openapi(getSearchRoute, async (c) => {
  const queryParams = c.req.valid("query");
  const result = await searchPerfumesService(queryParams);

  if (!result.success) {
    return apiInternalError(c, result.message);
  }
  return apiSuccess(c, result.data, "검색 결과를 성공적으로 불러왔습니다.");
});

/**
 * @method POST
 * @path /search/perfumes
 * @summary 필터가 적용된 향수 검색 페이지네이션으로 가져오기
 */
const postSearchRoute = createRoute({
  method: "post",
  path: "/perfumes",
  summary: "향수 검색 (상세 필터)",
  request: {
    body: {
      content: {
        "application/json": { schema: SearchSchemas.SearchPostBodySchema },
      },
    },
  },
  responses: createStandardApiResponses({
    schema: SearchSchemas.PaginatedSearchResponseSchema,
  }),
  tags: ["Search"],
});

searchApi.openapi(postSearchRoute, async (c) => {
  const bodyParams = c.req.valid("json");
  const result = await searchPerfumesService(bodyParams);

  if (!result.success) {
    return apiInternalError(c, result.message);
  }
  return apiSuccess(
    c,
    result.data,
    "필터가 적용된 검색 결과를 성공적으로 불러왔습니다."
  );
});

export default searchApi;
