import { Post } from "@zod/modelSchema";
import { CATEGORY_TYPES, POST_CARD_TYPES } from "./postCard.constants";

export type PostCardType =
  (typeof POST_CARD_TYPES)[keyof typeof POST_CARD_TYPES];

export type CategoryType = (typeof CATEGORY_TYPES)[keyof typeof CATEGORY_TYPES];

export interface ThumbnailProps {
  thumbnail?: string | null;
  cardType: PostCardType;
  isLoading?: boolean;
}

interface Author {
  id: string;
  nickname: string;
  imageUrl: string | null;
}

export interface PostCardProps extends Omit<Post, "createdAt" | "updatedAt"> {
  author: Author;
  createdAt: Date | string;
  updatedAt: Date | string | null;
  thumbnail?: string | null;
  isCategory?: boolean;
  category: CategoryType;
  cardType?: PostCardType;
  profileImage?: string | null;
  isAuthor: boolean;
}
