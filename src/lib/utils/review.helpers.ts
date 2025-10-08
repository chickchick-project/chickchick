import {
  ATTRIBUTE_ID_TO_CATEGORY_MAP,
  REVIEW_CONFIG,
  REVIEW_UI_DETAILS,
} from "../constants/review";
import { ReviewCategory } from "../types/review";

export function getCategoryById(id: number): ReviewCategory | undefined {
  return ATTRIBUTE_ID_TO_CATEGORY_MAP[id];
}

function getLabelByKey(category: ReviewCategory, key: string) {
  const option = REVIEW_CONFIG[category];
  if (!option) return key;
  const found = option.options.find((item) => item.key === key);
  return found ? found.label : key;
}

export function getTagByKey(category: ReviewCategory, key: string): string {
  const uiDetailsForCategory = REVIEW_UI_DETAILS[category];

  if (!uiDetailsForCategory) {
    return getLabelByKey(category, key);
  }
  const detailsObject = uiDetailsForCategory as Record<
    string,
    { tag?: string }
  >;

  const details = detailsObject[key];

  return details?.tag || getLabelByKey(category, key);
}
