import { REVIEW_CONFIG, REVIEW_UI_DETAILS } from "./review.config";
import { ReviewCategory, ReviewOptionKey, ImageType } from "./review.type";

export const ATTRIBUTE_ID_TO_CATEGORY_MAP = Object.fromEntries(
  Object.entries(REVIEW_CONFIG).map(([category, config]) => [
    config.id,
    category,
  ])
) as Record<number, ReviewCategory>;

const statusOptions = [
  {
    key: "NOT_USED_YET" as const,
    label: "아직 안 써봤어요",
    tag: "🙅 아직 안 써봤어요",
  },
  {
    key: "CURRENTLY_USING" as const,
    label: "지금 쓰고 있어요",
    tag: "🤔 지금 쓰고 있어요",
  },
  {
    key: "USED_BEFORE" as const,
    label: "써봤어요",
    tag: "👌 써봤어요",
  },
];

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
  image?: ImageType;
  image_selected?: ImageType;
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
