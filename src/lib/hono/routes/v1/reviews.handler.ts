import { createReviewRoute } from "@/lib/hono/api-spec/v1/review.routes";
import { createReviewService } from "@/lib/hono/services/review.service";
import { OpenAPIHono } from "@hono/zod-openapi";

const reviewsApi = new OpenAPIHono();

reviewsApi.openapi(
  createReviewRoute,
  async (c) => {
    const newReview = c.req.valid("json");
    const createdReview = await createReviewService(newReview);
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

export default reviewsApi;
