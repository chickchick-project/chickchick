import { ApiReviewResponse } from "@/lib/hono/schemas/review.schema";
import { createHttpClient } from "@/lib/utils/core-request";

interface RawApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const apiClient = createHttpClient({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
});
export async function fetchPopularReviews() {
  const reviews = await apiClient.get<RawApiResponse<ApiReviewResponse>>(
    "/reviews/popular"
  );
  return reviews;
}
