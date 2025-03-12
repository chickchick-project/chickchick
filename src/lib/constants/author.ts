import ICONS from "./icons";

export const REVIEW_STATUSES = {
  NOW: "지금 쓰고 있어요",
  USED: "써 봤어요",
  WANT: "갖고 싶어요",
} as const;

export const SIZE_STATUSES = {
  DEFAULT: "default",
  LARGE: "large",
} as const;

export const DEFAULT_PROFILE_IMAGE = "/images/Profile.svg";

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
  author: string;
  createdAt: string;
  profileImage?: string;
  isAuthor: boolean;
  info?: InfoType;
}

type AllowedIcons = Partial<Pick<typeof ICONS, "Like" | "Comment" | "View">>;

export interface PostMetaItem {
  type: keyof AllowedIcons;
  count: number;
}
