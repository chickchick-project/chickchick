import { OpenAPIHono } from "@hono/zod-openapi";
import {
  getSearchPerfumeListRoute,
  postSearchPerfumeListRoute,
} from "@/lib/hono/api-spec/v1/search.routes";
import { getPaginatedPerfumesService } from "@/lib/hono/services/search.service";

const searchApi = new OpenAPIHono();

searchApi.openapi(getSearchPerfumeListRoute, async (c) => {
  const queryParams = c.req.valid("query");
  const result = await getPaginatedPerfumesService(queryParams);
  return c.json({
    success: true,
    message: "향수 목록을 성공적으로 불러왔습니다.",
    ...result,
  } as const);
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
