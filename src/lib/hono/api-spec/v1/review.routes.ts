import {
  ErrorResponseSchema,
  SuccessResponseSchema,
} from "@/lib/hono/schemas/common.schema";
import {
  CreateReviewSchema,
  ReviewSchema,
} from "@/lib/hono/schemas/review.schema";
import { createRoute, z } from "@hono/zod-openapi";

export const createReviewRoute = createRoute({
  method: "post",
  path: "/perfumes/{perfumeId}",
  summary: "새로운 리뷰 생성",
  description: "새로운 리뷰를 생성함",
  request: {
    body: {
      content: { "application/json": { schema: CreateReviewSchema } },
      description: "생성할 리뷰 정보",
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: SuccessResponseSchema(ReviewSchema),
        },
      },
      description: "성공적으로 리뷰를 생성함",
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
  tags: ["Review"],
});

export const getReviewRoute = createRoute({
  method: "get",
  path: "perfumes/{id}",
  summary: "향수 리뷰 조회",
  description: "등록된 향수의 모든 리뷰 데이터를 조회합니다.",
  request: {
    params: z.object({
      id: z
        .string()
        .uuid()
        .openapi({
          param: { name: "id", in: "path" },
          example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        }),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessResponseSchema(z.array(ReviewSchema)),
        },
      },
      description: "성공적으로 향수 리뷰를 조회함",
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
  tags: ["Review"],
});
