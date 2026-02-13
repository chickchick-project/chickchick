import { POST_CARD_TYPES, CATEGORY_TYPES } from "@/lib/constants/post";
import type { ApiPostResponse } from "@/lib/hono/schemas/community.schema";

export type PostCardType =
  (typeof POST_CARD_TYPES)[keyof typeof POST_CARD_TYPES];

export type CategoryType = (typeof CATEGORY_TYPES)[keyof typeof CATEGORY_TYPES];

export interface ThumbnailProps {
  thumbnail?: string | null;
  cardType: PostCardType;
  isLoading?: boolean;
}

export type PostCardProps = {
  post?: ApiPostResponse;
  cardType?: PostCardType;
  isCategoryVisible?: boolean;
};
