import ICONS from "@/lib/constants/icons";
import { REVIEW_STATUSES, SIZE_STATUSES } from "./author.constants";

interface Author {
  id: string;
  nickname: string;
  imageUrl: string | null;
}

export type ReviewStatusType =
  (typeof REVIEW_STATUSES)[keyof typeof REVIEW_STATUSES];
export type SizeStatusType = (typeof SIZE_STATUSES)[keyof typeof SIZE_STATUSES];

interface BaseInfo<T extends string, I = undefined> {
  type: T;
  item?: I;
}

export interface PostMetaItem {
  type: "Like" | "Comment" | "View";
  count: number;
}
type BasicInfo = BaseInfo<"basic", undefined>;
type PostInfo = BaseInfo<"post", PostMetaItem[]>;
type ReviewInfo = BaseInfo<"review", { status: ReviewStatusType }>;
type CommentInfo = BaseInfo<"comment", undefined>;

export type InfoType = PostInfo | ReviewInfo | CommentInfo | BasicInfo;

export interface AuthorInfoProps {
  size?: SizeStatusType;
  author: Author;
  createdAt: Date | string;
  isAuthor: boolean;
  info?: InfoType;
}

type AllowedIcons = Partial<Pick<typeof ICONS, "Like" | "Comment" | "View">>;

export interface PostMetaItem {
  type: keyof AllowedIcons;
  count: number;
}

export interface PostTimeProps {
  time: string;
  type: InfoType["type"];
  size: SizeStatusType;
}

export interface PostMetaProps {
  meta: PostMetaItem[];
}

export interface IconBadgeProps {
  iconSrc: string;
  altText: string;
  count: number;
}

export interface AuthorProfileProps {
  name: string;
  profileImage?: string | null;
  size?: number;
}
