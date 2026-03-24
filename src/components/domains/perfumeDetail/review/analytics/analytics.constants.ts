import { REVIEW_CONFIG } from "@/shared/constants/review";
import { ReviewCategory, ReviewOptionKey } from "@/shared/types/review.types";

const ANALYTICS_COLORS: {
  [K in ReviewCategory]?: { [P in ReviewOptionKey<K>]?: string };
} = {
  feeling: {
    BEST: "#6F4D3F", // 최고예요
    GOOD: "#A47764", // 좋아요
    NEUTRAL: "#CB9C88", // 괜찮아요
    BAD: "#DBC0B0", // 별로예요
    DISLIKE: "#EAD8C4", // 싫어요
  },
  longevity: {
    LONG_LASTING: "#6F4D3F", // 긴 지속력 (6시간 이상)
    MODERATE: "#A47764", // 중간 (3-6시간)
    WEAK: "#CB9C88", // 짧음 (1-3시간)
    VERY_WEAK: "#EAD8C4", // 매우 짧음 (1시간 미만)
  },
  pricePerception: {
    GOOD_VALUE: "#6F4D3F", // 가성비가 좋아요
    REASONABLE: "#A47764", // 적당해요
    EXPENSIVE: "#EAD8C4", // 비싸요
  },
  sillage: {
    STRONG: "#6F4D3F", // 멀리 퍼지는 향
    MODERATE: "#A47764", // 주변만 퍼지는 향
    INTIMATE: "#CB9C88", // 자기만 느끼는 향
  },
  genderTone: {
    MASCULINE: "#6F4D3F", // 남성적인
    UNISEX: "#A47764", // 중성적인
    FEMININE: "#EAD8C4", // 여성적인
  },
  season: {
    WINTER: "#6F4D3F", // 겨울
    SPRING: "#A47764", // 가을
    SUMMER: "#DBC0B0", // 여름
    AUTUMN: "#EAD8C4", // 봄
  },
  timeOfDay: {
    NIGHT: "#6F4D3F", // 밤
    DAY: "#EAD8C4", // 낮
  },
};

export const ATTRIBUTE_ID_MAP = Object.fromEntries(
  Object.entries(REVIEW_CONFIG).map(([category, config]) => [
    category,
    config.id,
  ])
) as Record<ReviewCategory, number>;

export const CATEGORY_LABEL_MAP = Object.fromEntries(
  Object.entries(REVIEW_CONFIG).map(([category, config]) => {
    const categoryKey = category as ReviewCategory;
    const colorsForCategory = ANALYTICS_COLORS[categoryKey];

    const newOptions = config.options.map((option) => ({
      key: option.key,
      label: option.label,
      color:
        colorsForCategory?.[option.key as keyof typeof colorsForCategory] ||
        "#cccccc",
    }));

    return [categoryKey, newOptions];
  })
) as Record<ReviewCategory, { key: string; label: string; color: string }[]>;
