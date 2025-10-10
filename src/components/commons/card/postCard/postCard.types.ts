import { CATEGORY_TYPES, POST_CARD_TYPES } from "./postCard.constants";
import { BaseCardProps, PostForCard, CardTypeProps, CardImageProps } from "../card.types";

export type PostCardType =
  (typeof POST_CARD_TYPES)[keyof typeof POST_CARD_TYPES];

export type CategoryType = (typeof CATEGORY_TYPES)[keyof typeof CATEGORY_TYPES];

export interface ThumbnailProps extends Pick<CardImageProps, "thumbnail">, CardTypeProps<PostCardType> {
  isLoading?: boolean;
}

export interface PostCardProps extends BaseCardProps, Pick<CardImageProps, "thumbnail"> {
  post: PostForCard;
  isCategory?: boolean;
  cardType?: PostCardType;
  profileImage?: string | null;
}
