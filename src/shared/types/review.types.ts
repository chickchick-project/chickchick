import { REVIEW_CONFIG } from "@/shared/constants/review";

export type ReviewCategory = keyof typeof REVIEW_CONFIG;
export type ReviewOptionKey<T extends ReviewCategory> =
  (typeof REVIEW_CONFIG)[T]["options"][number]["key"];

export type ReviewImageType = {
  src: string;
  alt: string;
};
