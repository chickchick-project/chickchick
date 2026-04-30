import type { ApiReviewResponse } from "@/server/hono/schemas/review.schema";
export interface ReviewCardProps {
  review: ApiReviewResponse;
  isMyPage?: boolean;
  isAuthor?: boolean;
}
