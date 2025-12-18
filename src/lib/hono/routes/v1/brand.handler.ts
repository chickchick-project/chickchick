import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import * as BrandSchemas from "@/lib/hono/schemas/brand.schema";
import * as BrandServices from "@/lib/hono/services/brand.service";
import {
  apiInternalError,
  apiNotFound,
  apiSuccess,
} from "@/lib/hono/utils/api.utils";
import { createStandardApiResponses } from "@/lib/hono/utils/openapi.schema";
import { createDomainRouters } from "@/lib/hono/utils/router";

const routers = createDomainRouters();

/**
 * @method GET
 * @path /
 * @description 모든 브랜드 목록을 조회합니다.
 * @summary 브랜드 목록 조회
 */
const getAllBrandsRoute = createRoute({
  method: "get",
  path: "/",
  summary: "모든 브랜드 목록 조회",
  responses: createStandardApiResponses({
    schema: z.array(BrandSchemas.ApiBrandSimpleResponseSchema),
  }),
  tags: ["Brands"],
});

routers.optionalAuth.openapi(getAllBrandsRoute, async (c) => {
  const result = await BrandServices.getAllBrandsService();

  if (!result.success) {
    return apiInternalError(c, result.message);
  }

  return apiSuccess(c, result.data, "브랜드 목록을 성공적으로 불러왔습니다.");
});

/**
 * @method GET
 * @path /{id}
 * @description 특정 브랜드의 상세 정보를 ID로 조회합니다.
 * @summary 브랜드 상세 조회 (ID)
 */
const getBrandByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  summary: "브랜드 상세 조회 (ID)",
  request: { params: BrandSchemas.BrandIdParamSchema },
  responses: createStandardApiResponses({
    schema: BrandSchemas.ApiBrandDetailResponseSchema,
  }),
  tags: ["Brands"],
});

routers.optionalAuth.openapi(getBrandByIdRoute, async (c) => {
  const { id } = c.req.valid("param");
  const result = await BrandServices.getBrandByIdService(id);

  if (!result.success) {
    switch (result.error) {
      case "NOT_FOUND":
        return apiNotFound(c, result.message);
      default:
        return apiInternalError(c, result.message);
    }
  }

  return apiSuccess(c, result.data, "브랜드 정보를 성공적으로 불러왔습니다.");
});

/**
 * @method GET
 * @path /name/{nameKo}
 * @description 특정 브랜드의 상세 정보를 한글 이름으로 조회합니다.
 * @summary 브랜드 상세 조회 (한글 이름)
 */
const getBrandByNameRoute = createRoute({
  method: "get",
  path: "/name/{nameKo}",
  summary: "브랜드 상세 조회 (한글 이름)",
  request: { params: BrandSchemas.BrandNameParamSchema },
  responses: createStandardApiResponses({
    schema: BrandSchemas.ApiBrandDetailResponseSchema,
  }),
  tags: ["Brands"],
});

routers.optionalAuth.openapi(getBrandByNameRoute, async (c) => {
  const { nameKo } = c.req.valid("param");
  const result = await BrandServices.getBrandByNameService(nameKo);

  if (!result.success) {
    switch (result.error) {
      case "NOT_FOUND":
        return apiNotFound(c, result.message);
      default:
        return apiInternalError(c, result.message);
    }
  }

  return apiSuccess(c, result.data, "브랜드 정보를 성공적으로 불러왔습니다.");
});

export default routers.merge();
