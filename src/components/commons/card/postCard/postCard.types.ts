import { PostMetaItem } from "../../author/author.types";
import { CATEGORY_TYPES, POST_CARD_TYPES } from "./postCard.constants";

export type PostCardType =
  (typeof POST_CARD_TYPES)[keyof typeof POST_CARD_TYPES];

export type CategoryType = (typeof CATEGORY_TYPES)[keyof typeof CATEGORY_TYPES];

export interface ThumbnailProps {
  thumbnail?: string;
  cardType: PostCardType;
  isLoading?: boolean;
}

export interface PostCardProps {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  meta: PostMetaItem[];
  thumbnail?: string;
  isCategory?: boolean;
  categoryType: CategoryType;
  cardType?: PostCardType;
  profileImage?: string;
  isAuthor: boolean;
}
