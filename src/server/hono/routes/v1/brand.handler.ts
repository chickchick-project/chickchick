import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import * as BrandSchemas from "@/server/hono/schemas/brand.schema";
import * as BrandServices from "@/server/hono/services/brand.service";
import {
  apiInternalError,
  apiNotFound,
  apiSuccess,
} from "@/server/hono/utils/api.utils";
import { createStandardApiResponses } from "@/server/hono/utils/openapi.schema";
import { createDomainRouters } from "@/server/hono/utils/router";

const routers = createDomainRouters();
const publicRouter = routers.public;

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

/**
 * @method GET
 * @path /stores/:name
 * @description 카카오 로컬 검색 API를 통해 브랜드 매장 목록을 조회합니다.
 * @summary 브랜드 매장 검색
 */
publicRouter.get("/stores/:name", async (c) => {
  const name = c.req.param("name");
  const { x, y } = c.req.query();

  const result = await BrandServices.getStoresByNameService(name, x, y);

  if (!result.success) {
    return apiInternalError(c, result.message);
  }

  return c.json(
    { success: true, stores: result.data.stores, total: result.data.total },
    200
  );
});

/**
 * @method GET
 * @path /location
 * @description 좌표를 지역 정보로 변환합니다.
 * @summary 좌표 → 지역 정보 변환
 */
publicRouter.get("/location", async (c) => {
  const { x, y } = c.req.query();

  const result = await BrandServices.getRegionByCoordService(x, y);

  if (!result.success) {
    return apiInternalError(c, result.message);
  }

  return c.json({ success: true, region: result.data }, 200);
});

export default routers.merge();
