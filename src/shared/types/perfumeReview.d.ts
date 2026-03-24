export type UUID = string;

export type TUsageStatus = "CURRENTLY_USING" | "USED_BEFORE" | "NOT_USED_YET";

export type TFeeling = "BEST" | "GOOD" | "NEUTRAL" | "BAD" | "DISLIKE";
export type TLongevity = "VERY_WEAK" | "WEAK" | "MODERATE" | "LONG_LASTING";
export type TSillage = "INTIMATE" | "MODERATE" | "STRONG";
export type TGenderTone = "FEMININE" | "UNISEX" | "MASCULINE";
export type TSeason = "SPRING" | "SUMMER" | "AUTUMN" | "WINTER";
export type TTimeOfDay = "DAY" | "NIGHT";
export type TPricePerception = "EXPENSIVE" | "REASONABLE" | "GOOD_VALUE";

export interface IReviewAuthor {
  id: UUID;
  nickname: string;
  imageUrl: string | null;
}

export interface IReviewChips {
  feeling: TFeeling;
  longevity: TLongevity;
  sillage: TSillage;
  genderTone: TGenderTone;
  season: TSeason[];
  timeOfDay: TTimeOfDay;
  pricePerception: TPricePerception;
}

export interface IReviewItem {
  id: UUID;
  usageStatus: TUsageStatus;
  content: string;
  createdAt: string;
  author: IReviewAuthor;
  chips: IReviewChips;
}

export interface IReviewsResponse {
  success: boolean;
  message: string;
  data: IReviewItem[];
}
