import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import * as ReviewServices from "@/lib/hono/services/review.service";
import * as ReviewSchemas from "@/lib/hono/schemas/review.schema";
import { createStandardApiResponses } from "@/lib/hono/utils/createStandardApiResponses";

const reviewsApi = new OpenAPIHono();

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
  responses: createStandardApiResponses(
    {
      schema: z.array(ReviewSchemas.ReviewSchema),
      description: "리뷰 목록",
    },
    ["404"]
  ),
  tags: ["Review"],
});

reviewsApi.openapi(getReviewRoute, async (c) => {
  const { id } = c.req.param();
  const reviews = await ReviewServices.getReviewService(id);
  if (!reviews) {
    return c.json(
      {
        success: false,
        message: "리뷰를 찾을 수 없습니다.",
      },
      404
    );
  }
  return c.json(
    {
      success: true,
      message: "리뷰를 성공적으로 불러왔습니다.",
      data: reviews,
    },
    200
  );
});

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
  responses: createStandardApiResponses(
    {
      schema: ReviewSchemas.ReviewSchema,
      description: "리뷰",
    },
    ["400", "404"]
  ),
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
        message: "리뷰를 성공적으로 생성했습니다.",
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
          message: "리뷰 생성에 실패했습니다.",
          error: result.error,
        },
        400
      );
    }
  }
);

export default reviewsApi;
