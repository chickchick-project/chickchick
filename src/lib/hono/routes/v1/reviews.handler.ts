import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import * as ReviewServices from "@/lib/hono/services/review.service";
import * as ReviewSchemas from "@/lib/hono/schemas/review.schema";
import * as CommonSchemas from "@/lib/hono/schemas/common.schema";

const reviewsApi = new OpenAPIHono();

const createReviewRoute = createRoute({
  method: "post",
  path: "/perfumes/{perfumeId}",
  summary: "새로운 리뷰 생성",
  description: "새로운 리뷰를 생성함",
  request: {
    body: {
      content: {
        "application/json": { schema: ReviewSchemas.CreateReviewSchema },
      },
      description: "생성할 리뷰 정보",
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: CommonSchemas.SuccessResponseSchema(
            ReviewSchemas.ReviewSchema
          ),
        },
      },
      description: "성공적으로 리뷰를 생성함",
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
  tags: ["Review"],
});

reviewsApi.openapi(
  createReviewRoute,
  async (c) => {
    const newReview = c.req.valid("json");
    const createdReview = await ReviewServices.createReviewService(newReview);
    return c.json(
      {
        success: true,
        message: "Review created successfully",
        data: createdReview,
      },
      201
    );
  },
  (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          message: "Review creation failed",
          error: result.error,
        },
        400
      );
    }
  }
);

const getReviewRoute = createRoute({
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
          schema: CommonSchemas.SuccessResponseSchema(
            z.array(ReviewSchemas.ReviewSchema)
          ),
        },
      },
      description: "성공적으로 향수 리뷰를 조회함",
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
  tags: ["Review"],
});

reviewsApi.openapi(getReviewRoute, async (c) => {
  const { id } = c.req.param();
  const reviews = await ReviewServices.getReviewService(id);
  return c.json({
    success: true,
    message: "Reviews retrieved successfully",
    data: reviews,
  });
});

export default reviewsApi;
