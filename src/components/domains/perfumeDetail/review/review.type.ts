import { REVIEW_STATUSES } from "@/components/commons/author/author.constants";
import type { ApiReviewResponse } from "@/lib/hono/schemas/review.schema";

export type ReviewStatus = keyof typeof REVIEW_STATUSES;

export interface PerfumeReviewsProps {
  data: ApiReviewResponse[];
}

export interface ReviewListProps {
  data: ApiReviewResponse[];
}

export interface ReviewItemProps {
  content: string;
  tags: string[];
  author: string;
  createdAt: string;
  profileImage: string;
  isMain: boolean;
  usageStatus: ReviewStatus;
}

export interface ReviewAnalyticsProps {
  data: ApiReviewResponse[];
}
