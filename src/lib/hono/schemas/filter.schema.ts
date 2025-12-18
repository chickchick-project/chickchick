import { z } from "@hono/zod-openapi";
import { SearchPostBodySchema } from "@/lib/hono/schemas/search.schema";

/**
 * 데이터베이스 필터 옵션 스키마
 * @description 데이터베이스에서 반환되는 필터 옵션의 원시 데이터 형식
 */
export const FilterOptionSchema = z.object({
  id: z.string().uuid(),
  name_ko: z.string(),
  name_en: z.string(),
  count: z.number().int(),
  category: z.string(),
});

/**
 * API 필터 옵션 스키마
 * @description API 응답에서 사용되는 단일 필터 옵션 형식 (camelCase 변환)
 */
export const ApiFilterOptionSchema = z.object({
  id: z.string().uuid(),
  nameKo: z.string(),
  nameEn: z.string(),
  count: z.number().int(),
});

/**
 * 선택 가능한 필터 목록 응답 스키마
 * @description 노트, 어코드, 브랜드별로 선택 가능한 필터 옵션 목록
 */
export const AvailableFiltersResponseSchema = z.object({
  notes: z.array(ApiFilterOptionSchema),
  accords: z.array(ApiFilterOptionSchema),
  brands: z.array(ApiFilterOptionSchema),
});

/**
 * 데이터베이스 필터 총 개수 스키마
 * @description 데이터베이스에서 반환되는 카테고리별 필터 개수
 */
export const FilterTotalCountSchema = z.object({
  category: z.string(),
  total_count: z.number().int(),
});

/**
 * API 필터 총 개수 스키마
 * @description API 응답에서 사용되는 카테고리별 필터 개수 (camelCase 변환)
 */
export const ApiFilterTotalCountSchema = z.object({
  category: z.string(),
  totalCount: z.number().int(),
});

/**
 * 필터 요청 바디 스키마
 * @description 필터 목록 조회 시 사용되는 요청 바디 (페이지네이션 제외)
 */
export const FilterRequestBodySchema = SearchPostBodySchema.omit({
  cursor: true,
  limit: true,
});

/**
 * 필터 총 개수 응답 스키마
 * @description 카테고리별 필터 총 개수 배열 응답
 */
export const AvailableFiltersTotalResponseSchema = z.array(
  ApiFilterTotalCountSchema
);

export type RawFilterOption = z.infer<typeof FilterOptionSchema>;
export type AvailableFiltersResponse = z.infer<
  typeof AvailableFiltersResponseSchema
>;
export type AvailableFiltersTotalResponse = z.infer<
  typeof AvailableFiltersTotalResponseSchema
>;

export type FilterRequestBody = z.infer<typeof FilterRequestBodySchema>;
