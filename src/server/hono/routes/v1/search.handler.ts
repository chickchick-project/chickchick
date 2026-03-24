import { createRoute } from "@hono/zod-openapi";
import * as SearchSchemas from "@/server/hono/schemas/search.schema";
import { searchPerfumesService } from "@/server/hono/services/search.service";
import { apiInternalError, apiSuccess } from "@/server/hono/utils/api.utils";
import { createStandardApiResponses } from "@/server/hono/utils/openapi.schema";
import { createDomainRouters } from "@/server/hono/utils/router";

const routers = createDomainRouters();

/**
 * @method GET
 * @path /search/perfumes
 * @summary 향수 검색 (간단)
 * @description 검색어를 사용하여 향수를 검색합니다 (필터 없음)
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

routers.public.openapi(getSearchRoute, async (c) => {
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
 * @summary 향수 검색 (상세 필터)
 * @description 브랜드, 노트, 어코드 필터를 적용하여 향수를 검색합니다
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

routers.public.openapi(postSearchRoute, async (c) => {
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

export default routers.merge();
