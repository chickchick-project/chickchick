import type { ApiReviewResponse } from "@/server/hono/schemas/review.schema";
import { ATTRIBUTE_ID_MAP, CATEGORY_LABEL_MAP } from "./analytics.constants";
import type { ReviewCategory } from "@/shared/types/review.types";

export type AttributeId = number;
export type OptionKey = string;
export type Counts = Record<AttributeId, Record<OptionKey, number>>;

export const calculateReviewCounts = (data: ApiReviewResponse[]): Counts => {
  const counts: Counts = {};

  data.forEach((review) => {
    review.attributeSelections.forEach((selection) => {
      const attributeId = selection.option.attributeId as AttributeId;
      const optionKey = String(selection.option.value) as OptionKey;

      if (!counts[attributeId]) {
        counts[attributeId] = {};
      }
      counts[attributeId][optionKey] =
        (counts[attributeId][optionKey] || 0) + 1;
    });
  });

  return counts;
};

export const countByCategory = (
  counts: Counts,
  category: ReviewCategory
): Array<{ key: string; label: string; count: number; color?: string }> => {
  const attributeId = ATTRIBUTE_ID_MAP[category];
  const categoryCounts = counts[attributeId] || {};

  return CATEGORY_LABEL_MAP[category].map(({ key, label, color }) => ({
    key,
    label,
    count: categoryCounts[key] || 0,
    color,
  }));
};
