import { z } from "@hono/zod-openapi";
import {
  ApiPerfumeSimpleResponse,
  ApiPerfumeSimpleResponseSchema,
} from "./perfume.schema";
import {
  CursorPaginationSchema,
  PaginatedResponse,
  PaginatedResponseSchema,
} from "./common.schema";

/**
 * 검색 GET 요청 쿼리 파라미터 스키마
 * @description 기본 검색 요청 시 사용되는 쿼리 파라미터 (검색어, 페이지네이션)
 */
export const GenderSortSchema = z
  .enum(["MASCULINE", "UNISEX", "FEMININE"])
  .default("UNISEX");

export type GenderSort = z.infer<typeof GenderSortSchema>;

export const SearchGetQuerySchema = CursorPaginationSchema.extend({
  searchText: z.string().optional().default(""),
  // 커서 형식: "{gender_count}:{priority}:{perfume_id}"
  cursor: z
    .string()
    .regex(
      /^\d+:\d+:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      "유효하지 않은 커서 형식입니다."
    )
    .optional(),
  genderSort: GenderSortSchema.optional(),
});

/**
 * 검색 POST 요청 바디 스키마
 * @description 필터링이 포함된 향수 검색 요청 시 사용되는 바디 파라미터
 */
export const SearchPostBodySchema = SearchGetQuerySchema.extend({
  brandFilter: z.array(z.string().uuid()).optional(),
  notesFilter: z.array(z.string().uuid()).optional(),
  accordsFilter: z.array(z.string().uuid()).optional(),
});

/**
 * 페이지네이션된 검색 결과 응답 스키마
 * @description 커서 기반 페이지네이션이 적용된 향수 검색 결과 응답
 */
export const PaginatedSearchResponseSchema = PaginatedResponseSchema(
  ApiPerfumeSimpleResponseSchema
).openapi("PaginatedSearchResponse");

/**
 * Supabase 향수 스키마
 * @description Supabase에서 반환되는 향수 검색 결과의 원시 데이터 형식
 */
export const SupabasePerfumeSchema = z.object({
  perfume_id: z.string().uuid(),
  perfume_name_en: z.string(),
  perfume_name_ko: z.string(),
  brand_id: z.string().uuid(),
  brand_name_en: z.string(),
  brand_name_ko: z.string(),
  brand_url: z.string().nullable(),
  image_url: z.string(),
  priority: z.number().int(),
  gender_vote_count: z.number().int(),
});

export type SearchGetQuery = z.infer<typeof SearchGetQuerySchema>;
export type SearchPostBody = z.infer<typeof SearchPostBodySchema>;
export type PaginatedSearchResponse =
  PaginatedResponse<ApiPerfumeSimpleResponse>;

export type SupabasePerfume = z.infer<typeof SupabasePerfumeSchema>;
