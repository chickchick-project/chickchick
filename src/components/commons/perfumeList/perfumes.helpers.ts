import type { ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";
import { FILTER_LABELS } from "./filter/filter.constants";

/**
 * 필터 키(key)에 해당하는 한글 레이블을 반환합니다.
 */
export const getLabel = (key: string) =>
  FILTER_LABELS[key as keyof typeof FILTER_LABELS] || key;

/**
 * 중복된 향수를 ID 기준으로 제거하는 함수입니다.
 */
export const getUniquePerfumes = (
  perfumes: ApiPerfumeSimpleResponse[]
): ApiPerfumeSimpleResponse[] => {
  const uniqueMap = new Map<string, ApiPerfumeSimpleResponse>();

  perfumes.forEach((perfume) => {
    if (!uniqueMap.has(perfume.id)) {
      uniqueMap.set(perfume.id, perfume);
    }
  });

  return Array.from(uniqueMap.values());
};
