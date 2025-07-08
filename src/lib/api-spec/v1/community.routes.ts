import { createRoute, z } from "@hono/zod-openapi";
import {
  GetPostsQuerySchema,
  PostResponseSchema,
} from "@/lib/schemas/community.schema";
import {
  SuccessResponseSchema,
  ErrorResponseSchema,
} from "@/lib/schemas/common.schema";

/**
 * @method GET
 * @path /posts
 * @summary 커뮤니티 게시글 목록 조회
 */
export const getPostsRoute = createRoute({
  method: "get",
  path: "/posts",
  summary: "커뮤니티 게시글 목록 조회",
  request: {
    query: GetPostsQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessResponseSchema(z.array(PostResponseSchema)),
        },
      },
      description: "게시글 목록",
    },
    404: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "게시글을 찾을 수 없음",
    },
  },
  tags: ["Community"],
});
