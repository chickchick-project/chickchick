import IMAGES from "@/lib/constants/images";

export const REVIEW_STATUSES = {
  CURRENTLY_USING: "지금 쓰고 있어요",
  USED_BEFORE: "써 봤어요",
  NOT_USED_YET: "갖고 싶어요",
} as const;

export const SIZE_STATUSES = {
  DEFAULT: "default",
  LARGE: "large",
} as const;

export const DEFAULT_PROFILE_IMAGE = IMAGES.Profile.src;
