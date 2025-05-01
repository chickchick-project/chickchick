import IMAGES from "@/lib/constants/images";

export const REVIEW_STATUSES = {
  NOW: "지금 쓰고 있어요",
  USED: "써 봤어요",
  WANT: "갖고 싶어요",
} as const;

export const SIZE_STATUSES = {
  DEFAULT: "default",
  LARGE: "large",
} as const;

export const DEFAULT_PROFILE_IMAGE = IMAGES.Profile.src;
