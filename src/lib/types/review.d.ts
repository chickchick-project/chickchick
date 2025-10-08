import { REVIEW_CONFIG } from "@/lib/constants/review";

export type ReviewCategory = keyof typeof REVIEW_CONFIG;
export type ReviewOptionKey<T extends ReviewCategory> =
  (typeof REVIEW_CONFIG)[T]["options"][number]["key"];

export type ImageType = {
  src: string;
  alt: string;
};
