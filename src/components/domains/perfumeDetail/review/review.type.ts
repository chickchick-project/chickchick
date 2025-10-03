import { REVIEW_STATUSES } from "@/components/commons/author/author.constants";
import { ApiReviewResponse } from "@/lib/hono/schemas/review.schema";
import { REVIEW_CONFIG } from "./review.config";

export type ReviewCategory = keyof typeof REVIEW_CONFIG;
export type ReviewStatus = keyof typeof REVIEW_STATUSES;
export type ReviewOptionKey<T extends ReviewCategory> =
  (typeof REVIEW_CONFIG)[T]["options"][number]["key"];

export type ImageType = {
  src: string;
  alt: string;
};

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
