import { ApiReviewResponse } from "@/lib/hono/schemas/review.schema";
import { ATTRIBUTE_ID_MAP, CATEGORY_LABEL_MAP } from "./analytics.constants";
import { ReviewCategory } from "@/lib/types/review.types";

type AttributeId = number;
type OptionKey = string;
type Counts = Record<AttributeId, Record<OptionKey, number>>;

export const calculateReviewCounts = (data: ApiReviewResponse[]): Counts => {
  const counts: Counts = {};

  data.forEach((review) => {
    review.attributeSelections.forEach((selection) => {
      const { attributeId, value } = selection.option;
      if (!counts[attributeId]) {
        counts[attributeId] = {};
      }
      counts[attributeId][value] = (counts[attributeId][value] || 0) + 1;
    });
  });

  return counts;
};

export const countByCategory = (counts: Counts, category: ReviewCategory) => {
  const attributeId = ATTRIBUTE_ID_MAP[category];
  const categoryCounts = counts[attributeId] || {};

  return CATEGORY_LABEL_MAP[category].map(({ key, label, color }) => ({
    label,
    count: categoryCounts[key] || 0,
    color,
  }));
};
