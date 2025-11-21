import { z } from "@hono/zod-openapi";
import { SearchPostBodySchema } from "./search.schema";

// DB 응답 스키마
export const FilterOptionSchema = z.object({
  id: z.string().uuid(),
  name_ko: z.string(),
  name_en: z.string(),
  count: z.number().int(),
  category: z.string(),
});

// API 응답에 사용될 단일 필터 옵션 스키마
export const ApiFilterOptionSchema = z.object({
  id: z.string().uuid(),
  nameKo: z.string(),
  nameEn: z.string(),
  count: z.number().int(),
});

// 최종 API 응답 스키마
export const AvailableFiltersResponseSchema = z.object({
  notes: z.array(ApiFilterOptionSchema),
  accords: z.array(ApiFilterOptionSchema),
  brands: z.array(ApiFilterOptionSchema),
});

// DB 응답 스키마
export const FilterTotalCountSchema = z.object({
  category: z.string(),
  total_count: z.number().int(),
});

// API 응답 스키마
export const ApiFilterTotalCountSchema = z.object({
  category: z.string(),
  totalCount: z.number().int(),
});

export const FilterRequestBodySchema = SearchPostBodySchema.omit({
  cursor: true,
  limit: true,
});

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
