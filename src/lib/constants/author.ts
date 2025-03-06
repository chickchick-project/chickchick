export const REVIEW_STATUSES = {
  NOW: "지금 쓰고 있어요",
  USED: "써 봤어요",
  WANT: "갖고 싶어요",
} as const;

export const SIZE_STATUSES = {
  DEFAULT: "default",
  LARGE: "large",
} as const;

export const DEFAULT_PROFILE_IMAGE = "/images/profile.png";

export const META_ICONS = {
  likes: "/icons/meta/Like.svg",
  comments: "/icons/meta/Comment.svg",
  views: "/icons/meta/View.svg",
} as const;

export type ReviewStatusType =
  (typeof REVIEW_STATUSES)[keyof typeof REVIEW_STATUSES];
export type SizeStatusType = (typeof SIZE_STATUSES)[keyof typeof SIZE_STATUSES];
export type MetaType = keyof typeof META_ICONS;
