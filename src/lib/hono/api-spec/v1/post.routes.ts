import { createRoute } from "@hono/zod-openapi";
import {
  PaginatedPostListQuerySchema,
  PaginatedPostListResponseSchema,
} from "@/lib/hono/schemas/post.schema";
import {
  ErrorResponseSchema,
  SuccessResponseSchema,
} from "@/lib/hono/schemas/common.schema";

/**
 * @method GET
 * @path /post
 * @summary 게시글 목록 페이지네이션으로 가져오기
 */

export const getPostListRoute = createRoute({
  method: "get",
  path: "/posts",
  summary: "게시글 목록 페이지네이션으로 가져오기",
  description: "요청된 검색어 및 게시판, 정렬 옵션에 해당하는 게시글 목록 조회",
  request: {
    query: PaginatedPostListQuerySchema,
  },
  responses: {
    200: {
      description: "성공적으로 게시글 목록을 반환함",
      content: {
        "application/json": {
          schema: SuccessResponseSchema(PaginatedPostListResponseSchema),
        },
      },
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
  tags: ["Post"],
});
