import { createRoute, z } from "@hono/zod-openapi";
import { PerfumeSchema } from "@/lib/schemas/perfume.schema";
import {
  SuccessResponseSchema,
  ErrorResponseSchema,
} from "@/lib/schemas/common.schema";

/**
 * @method GET
 * @path /perfumes
 * @summary 모든 향수 목록 조회
 */
export const getPerfumesListRoute = createRoute({
  method: "get",
  path: "/perfumes",
  summary: "모든 향수 목록 조회",
  description: "등록된 모든 향수 데이터를 조회합니다. (확인용)",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessResponseSchema(z.array(PerfumeSchema)),
        },
      },
      description: "성공적으로 향수 목록을 조회함",
    },
    400: {
      description: "잘못된 요청 데이터",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
  tags: ["Perfume"],
});

/**
 * @method GET
 * @path /perfumes/{id}
 * @summary 특정 향수 조회
 */
export const getPerfumeByIdRoute = createRoute({
  method: "get",
  path: "/perfumes/{id}",
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
          schema: SuccessResponseSchema(PerfumeSchema),
        },
      },
      description: "성공적으로 향수를 조회함",
    },
    404: {
      description: "향수를 찾을 수 없음",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
  tags: ["Perfume"],
});
