import type { ApiReviewResponse } from "@/lib/hono/schemas/review.schema";
export interface ReviewCardProps {
  review: ApiReviewResponse;
  isMyPage?: boolean;
  isAuthor?: boolean;
}
