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

// GET 요청의 쿼리 파라미터 스키마
export const SearchGetQuerySchema = CursorPaginationSchema.extend({
  searchText: z.string().optional().default(""),
});

// POST 요청의 Body 스키마
export const SearchPostBodySchema = SearchGetQuerySchema.extend({
  brandFilter: z.array(z.string().uuid()).optional(),
  notesFilter: z.array(z.string().uuid()).optional(),
  accordsFilter: z.array(z.string().uuid()).optional(),
});

export const PaginatedSearchResponseSchema = PaginatedResponseSchema(
  ApiPerfumeSimpleResponseSchema
);

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
});

export type SearchGetQuery = z.infer<typeof SearchGetQuerySchema>;
export type SearchPostBody = z.infer<typeof SearchPostBodySchema>;
export type PaginatedSearchResponse =
  PaginatedResponse<ApiPerfumeSimpleResponse>;

export type SupabasePerfume = z.infer<typeof SupabasePerfumeSchema>;
