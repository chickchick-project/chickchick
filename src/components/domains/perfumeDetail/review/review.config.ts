import ICONS from "@/lib/constants/icons";
import { ImageType, ReviewCategory, ReviewOptionKey } from "./review.type";

export const REVIEW_CONFIG = {
  feeling: {
    id: 1,
    label: "만족도",
    options: [
      { key: "BEST", label: "최고에요!" },
      { key: "GOOD", label: "좋아요" },
      { key: "NEUTRAL", label: "괜찮아요" },
      { key: "BAD", label: "별로에요" },
      { key: "DISLIKE", label: "싫어요" },
    ],
  },
  longevity: {
    id: 2,
    label: "지속력",
    options: [
      { key: "LONG_LASTING", label: "긴 지속력 (6시간 이상)" },
      { key: "MODERATE", label: "중간 (3-6시간)" },
      { key: "WEAK", label: "짧음 (1-3시간)" },
      { key: "VERY_WEAK", label: "매우 짧음 (1시간 미만)" },
    ],
  },
  sillage: {
    id: 3,
    label: "잔향",
    options: [
      { key: "STRONG", label: "주변 사람들이 쉽게 느낄 수 있는 정도" },
      { key: "MODERATE", label: "가까이 있는 사람이 느낄 수 있는 정도" },
      { key: "INTIMATE", label: "자신만 느낄 수 있는 정도" },
    ],
  },
  genderTone: {
    id: 4,
    label: "이미지",
    options: [
      { key: "MASCULINE", label: "남성적인" },
      { key: "UNISEX", label: "중성적인" },
      { key: "FEMININE", label: "여성적인" },
    ],
  },
  season: {
    id: 5,
    label: "계절",
    options: [
      { key: "WINTER", label: "겨울" },
      { key: "AUTUMN", label: "가을" },
      { key: "SUMMER", label: "여름" },
      { key: "SPRING", label: "봄" },
    ],
  },
  timeOfDay: {
    id: 6,
    label: "시간",
    options: [
      { key: "NIGHT", label: "밤" },
      { key: "DAY", label: "낮" },
    ],
  },
  pricePerception: {
    id: 7,
    label: "가격",
    options: [
      { key: "GOOD_VALUE", label: "가성비가 좋아요" },
      { key: "REASONABLE", label: "적당해요" },
      { key: "EXPENSIVE", label: "비싸요" },
    ],
  },
} as const;

export const REVIEW_UI_DETAILS: {
  [K in ReviewCategory]?: {
    [P in ReviewOptionKey<K>]?: {
      tag?: string;
      image?: ImageType;
      image_selected?: ImageType;
    };
  };
} = {
  feeling: {
    DISLIKE: {
      tag: "😞 싫어요",
      image: { src: ICONS.DislikeGray.src, alt: ICONS.DislikeGray.alt },
      image_selected: {
        src: ICONS.DislikePrimary.src,
        alt: ICONS.DislikePrimary.alt,
      },
    },
    BAD: {
      tag: "😕 별로에요",
      image: { src: ICONS.BadGray.src, alt: ICONS.BadGray.alt },
      image_selected: { src: ICONS.BadPrimary.src, alt: ICONS.BadPrimary.alt },
    },
    NEUTRAL: {
      tag: "😐 괜찮아요",
      image: { src: ICONS.NeutralGray.src, alt: ICONS.NeutralGray.alt },
      image_selected: {
        src: ICONS.NeutralPrimary.src,
        alt: ICONS.NeutralPrimary.alt,
      },
    },
    GOOD: {
      tag: "🙂 좋아요",
      image: { src: ICONS.GoodGray.src, alt: ICONS.GoodGray.alt },
      image_selected: {
        src: ICONS.GoodPrimary.src,
        alt: ICONS.GoodPrimary.alt,
      },
    },
    BEST: {
      tag: "😍 최고에요!",
      image: { src: ICONS.BestGray.src, alt: ICONS.BestGray.alt },
      image_selected: {
        src: ICONS.BestPrimary.src,
        alt: ICONS.BestPrimary.alt,
      },
    },
  },
  longevity: {
    VERY_WEAK: { tag: "⏱️ 매우 짧음" },
    WEAK: { tag: "⏱️ 짧음 (1-3시간)" },
    MODERATE: { tag: "⏱️ 중간 (3-6시간)" },
    LONG_LASTING: { tag: "⏱️ 긴 지속력 (6시간 이상)" },
  },
  sillage: {
    INTIMATE: { tag: "👤 자신만 느낄 수 있는 정도" },
    MODERATE: { tag: "👥 가까이 있는 사람이 느낄 수 있는 정도" },
    STRONG: { tag: "🍃 주변 사람들이 쉽게 느낄 수 있는 정도" },
  },
  genderTone: {
    FEMININE: { tag: "👩 여성적인" },
    UNISEX: { tag: "⚖️ 중성적인" },
    MASCULINE: { tag: "👨 남성적인" },
  },
  season: {
    SPRING: { tag: "🌸 봄" },
    SUMMER: { tag: "☀️ 여름" },
    AUTUMN: { tag: "🍂 가을" },
    WINTER: { tag: "❄️ 겨울" },
  },
  timeOfDay: {
    DAY: { tag: "🌞 낮" },
    NIGHT: { tag: "🌜 밤" },
  },
  pricePerception: {
    EXPENSIVE: { tag: "💸 비싸요" },
    REASONABLE: { tag: "💰 적당해요" },
    GOOD_VALUE: { tag: "💵 가성비가 좋아요" },
  },
};
