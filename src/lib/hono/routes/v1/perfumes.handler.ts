import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import * as CommonSchemas from "@/lib/hono/schemas/common.schema";
import * as PerfumeServices from "@/lib/hono/services/perfume.service";
import PerfumeSchema from "@zod/modelSchema/PerfumeSchema";

const perfumesApi = new OpenAPIHono();
/**
 * @method GET
 * @path /perfumes
 * @summary 모든 향수 목록 조회
 */
const getPerfumesListRoute = createRoute({
  method: "get",
  path: "/",
  summary: "모든 향수 목록 조회",
  description: "등록된 모든 향수 데이터를 조회합니다. (확인용)",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: CommonSchemas.SuccessResponseSchema(z.array(PerfumeSchema)),
        },
      },
      description: "성공적으로 향수 목록을 조회함",
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
  tags: ["Perfume"],
});

perfumesApi.openapi(getPerfumesListRoute, async (c) => {
  const perfumes = await PerfumeServices.getPerfumesListService();
  return c.json({
    success: true,
    message: "Perfumes list retrieved successfully",
    data: perfumes,
  });
});

/**
 * @method GET
 * @path /perfumes/{id}
 * @summary 특정 향수 조회
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
  responses: {
    200: {
      content: {
        "application/json": {
          schema: CommonSchemas.SuccessResponseSchema(PerfumeSchema),
        },
      },
      description: "성공적으로 향수를 조회함",
    },
    404: {
      description: "향수를 찾을 수 없음",
      content: {
        "application/json": {
          schema: CommonSchemas.ErrorResponseSchema,
        },
      },
    },
  },
  tags: ["Perfume"],
});

perfumesApi.openapi(getPerfumeByIdRoute, async (c) => {
  const { id } = c.req.param();
  const perfume = await PerfumeServices.getPerfumeByIdService(id);
  if (!perfume) {
    return c.json(
      {
        success: false,
        message: "Perfume not found",
      },
      404
    );
  }
  return c.json(
    {
      success: true,
      message: "Perfume found",
      data: perfume,
    },
    200
  );
});

export default perfumesApi;
