import { createHttpClient } from "@/lib/utils/core-request";
import { ApiReviewResponse } from "@/lib/hono/schemas/review.schema";
import { ApiResponse } from "@/lib/hono/schemas/common.schema";

const apiClient = createHttpClient({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
});
export async function fetchPopularReviews() {
  const reviews = await apiClient.get<ApiResponse<ApiReviewResponse>>(
    "/reviews/popular"
  );
  return reviews;
}
