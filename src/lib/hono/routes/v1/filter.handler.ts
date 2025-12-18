import { createRoute } from "@hono/zod-openapi";
import * as FilterSchemas from "@/lib/hono/schemas/filter.schema";
import {
  getAvailableFiltersService,
  getAvailableFiltersTotalService,
} from "@/lib/hono/services/filter.service";
import { apiInternalError, apiSuccess } from "@/lib/hono/utils/api.utils";
import { createStandardApiResponses } from "@/lib/hono/utils/openapi.schema";
import { createDomainRouters } from "@/lib/hono/utils/router";

const routers = createDomainRouters();

/**
 * @method POST
 * @path /filters/available
 * @summary 선택 가능한 상세 필터 목록 조회
 */
const postAvailableFiltersRoute = createRoute({
  method: "post",
  path: "/available",
  summary: "선택 가능한 상세 필터 목록 조회",
  request: {
    body: {
      content: {
        "application/json": { schema: FilterSchemas.FilterRequestBodySchema },
      },
    },
  },
  responses: createStandardApiResponses({
    schema: FilterSchemas.AvailableFiltersResponseSchema,
  }),
  tags: ["Filter"],
});

routers.public.openapi(postAvailableFiltersRoute, async (c) => {
  const bodyParams = c.req.valid("json");
  const result = await getAvailableFiltersService(bodyParams);

  if (!result.success) {
    return apiInternalError(c, result.message);
  }
  return apiSuccess(c, result.data, "선택 가능한 필터 목록을 조회했습니다.");
});

/**
 * @method POST
 * @path /filters/total
 * @summary 필터 카테고리별 총 개수 조회
 */
const postAvailableFiltersTotalRoute = createRoute({
  method: "post",
  path: "/total",
  summary: "필터 카테고리별 총 개수 조회",
  request: {
    body: {
      content: {
        "application/json": { schema: FilterSchemas.FilterRequestBodySchema },
      },
    },
  },
  responses: createStandardApiResponses({
    schema: FilterSchemas.AvailableFiltersTotalResponseSchema,
  }),
  tags: ["Filter"],
});

routers.public.openapi(postAvailableFiltersTotalRoute, async (c) => {
  const bodyParams = c.req.valid("json");
  const result = await getAvailableFiltersTotalService(bodyParams);

  if (!result.success) {
    return apiInternalError(c, result.message);
  }
  return apiSuccess(c, result.data, "필터별 총 개수를 조회했습니다.");
});

export default routers.merge();
