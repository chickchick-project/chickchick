import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import * as PerfumeServices from "@/lib/hono/services/perfume.service";
import PerfumeSchema from "@zod/modelSchema/PerfumeSchema";
import { createStandardApiResponses } from "@/lib/hono/utils/createStandardApiResponses";

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
  responses: createStandardApiResponses(
    {
      schema: z.array(PerfumeSchema),
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
  responses: createStandardApiResponses(
    {
      schema: PerfumeSchema,
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

export default perfumesApi;
