import { SuccessResponseSchema } from "@/lib/schemas/common.schema";
import {
  PaginatedPerfumeResponseSchema,
  SearchGetQuerySchema,
  SearchPostBodySchema,
} from "@/lib/schemas/search.schema";
import { createRoute } from "@hono/zod-openapi";

/**
 * @method GET
 * @path /search
 * @summary 향수 목록 페이지네이션으로 가져오기
 */
export const getSearchPerfumeListRoute = createRoute({
  method: "get",
  path: "/search",
  summary: "향수 목록 페이지네이션으로 가져오기",
  description: "요청된 검색어에 해당하는 향수 정보 조회",
  request: {
    query: SearchGetQuerySchema,
  },
  responses: {
    200: {
      description: "성공적으로 향수 목록을 반환함",
      content: {
        "application/json": {
          schema: SuccessResponseSchema(PaginatedPerfumeResponseSchema),
        },
      },
    },
  },
  tags: ["Search"],
});

/**
 * @method POST
 * @path /search
 * @summary 필터가 적용된 향수 목록 페이지네이션으로 가져오기
 */
export const postSearchPerfumeListRoute = createRoute({
  method: "post",
  path: "/search",
  summary: "필터가 적용된 향수 목록 페이지네이션으로 가져오기",
  description: "요청된 검색어 및 필터에 해당하는 향수 정보 조회",
  request: {
    body: {
      content: {
        "application/json": {
          schema: SearchPostBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "성공적으로 향수 목록을 반환함",
      content: {
        "application/json": {
          schema: SuccessResponseSchema(PaginatedPerfumeResponseSchema),
        },
      },
    },
  },
  tags: ["Search"],
});
