import { FILTER_LABELS } from "../filter/filter.constants";

// 한글 → 영어 key 매핑 객체
export const LABELS_TO_KEY = Object.entries(FILTER_LABELS).reduce(
  (acc, [key, label]) => {
    acc[label] = key;
    return acc;
  },
  {} as Record<string, string>
);

// 합산 대상 key 배열 (list는 제외)
export const FILTER_KEYS = Object.keys(FILTER_LABELS).filter(
  (key) => key !== "list"
);

/**
 * 필터의 선택된 개수 반환
 * @param filters Record<string, string[]>
 * @param filterKey string (예: "gender", "list" 등)
 * @returns number
 */
export function getFilterCount(
  filters: Record<string, string[]>,
  filterKey: string
): number {
  if (filterKey === "list") {
    return FILTER_KEYS.reduce(
      (sum, key) => sum + (filters[key]?.length ?? 0),
      0
    );
  }
  return filters[filterKey]?.length ?? 0;
}
