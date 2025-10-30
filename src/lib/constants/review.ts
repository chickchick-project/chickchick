import ICONS from "@/lib/constants/icons";
import {
  ReviewImageType,
  ReviewCategory,
  ReviewOptionKey,
} from "../types/review.types";

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
      image?: ReviewImageType;
      image_selected?: ReviewImageType;
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

export const ATTRIBUTE_ID_TO_CATEGORY_MAP = Object.fromEntries(
  Object.entries(REVIEW_CONFIG).map(([category, config]) => [
    config.id,
    category,
  ])
) as Record<number, ReviewCategory>;

export const DEFAULT_POPULAR_REVIEW = {
  id: "NO_REVIEW_PLACEHOLDER",
  content: "가장 먼저 리뷰를 남겨주시면 다른 사용자에게 큰 도움이 됩니다.",
  usageStatus: "NOT_USED_YET" as const,
  createdAt: new Date("2025-01-01T00:00:00"),
  updatedAt: new Date("2025-01-01T00:00:00"),
  authorId: "admin",
  perfumeId: "",

  author: {
    id: "admin",
    nickname: "CHICKCHICK",
    imageUrl: "",
  },
  perfume: {
    id: "",
    nameKo: "인기 리뷰를 준비 중입니다",
    nameEn: "Review is being prepared",
    perfumeImage: {
      id: "placeholder",
      imageUrl: "/images/PlaceHolder.png",
      createdAt: new Date("2024-01-01T00:00:00"),
      perfumeId: "",
    },
    brand: {
      nameKo: "소중한 리뷰를 기다리고 있어요",
      nameEn: "Waiting for your precious review",
      brandUrl: null,
    },
  },
  attributeSelections: [],
};

const statusOptions = [
  {
    key: "NOT_USED_YET",
    label: "아직 안 써봤어요",
    tag: "🙅 아직 안 써봤어요",
  },
  {
    key: "CURRENTLY_USING",
    label: "지금 쓰고 있어요",
    tag: "🤔 지금 쓰고 있어요",
  },
  {
    key: "USED_BEFORE",
    label: "써봤어요",
    tag: "👌 써봤어요",
  },
] as const;

export const REVIEW_OPTIONS = {
  status: statusOptions,
  feeling: createCategoryOptions("feeling"),
  longevity: createCategoryOptions("longevity"),
  sillage: createCategoryOptions("sillage"),
  genderTone: createCategoryOptions("genderTone"),
  season: createCategoryOptions("season"),
  timeOfDay: createCategoryOptions("timeOfDay"),
  pricePerception: createCategoryOptions("pricePerception"),
} as const;

// 특정 카테고리의 옵션 생성
function createCategoryOptions<K extends ReviewCategory>(
  category: K
): Array<{
  key: ReviewOptionKey<K>;
  label: string;
  tag?: string;
  image?: ReviewImageType;
  image_selected?: ReviewImageType;
}> {
  const categoryConfig = REVIEW_CONFIG[category];
  const uiDetails = REVIEW_UI_DETAILS[category];

  return categoryConfig.options.map((option) => {
    const uiDetail = uiDetails?.[option.key as ReviewOptionKey<K>];

    return {
      key: option.key,
      label: option.label,
      ...(uiDetail?.tag && { tag: uiDetail.tag }),
      ...(uiDetail?.image && { image: uiDetail.image }),
      ...(uiDetail?.image_selected && {
        image_selected: uiDetail.image_selected,
      }),
    };
  });
}
