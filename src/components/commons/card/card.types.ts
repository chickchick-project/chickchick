import { Author } from "../author/author.types";
import { type Post } from "@zod/modelSchema";

// 기본 카드 공통 인터페이스
export interface BaseCardProps {
  author: Author;
  createdAt: Date | string;
  isAuthor: boolean;
}

export interface CardWithImageProps extends BaseCardProps {
  imageUrl?: string | null;
}

// 카드 공통 패턴들
export interface CardTypeProps<T extends string = string> {
  cardType: T;
}

export interface CardInteractionProps {
  onClick?: () => void;
  onClose?: () => void;
  className?: string;
}

export interface CardImageProps {
  imageUrl?: string | null;
  thumbnail?: string | null;
  perfumeImage?: string | null;
}

export interface SimpleCardProps extends CardTypeProps, CardInteractionProps {}

// Post 기반 공통 타입들
export type BasePost = Pick<Post, "id" | "title" | "content" | "userId"> & {
  createdAt: Date | string;
};
export type PostWithMeta = BasePost &
  Pick<Post, "viewCount" | "likeCount" | "commentCount">;
export type PostForCard = PostWithMeta &
  Pick<Post, "category" | "thumbnailUrl" | "published" | "contentText"> & {
    updatedAt: Date | string | null;
  };
export type PostDetail = Post;
