import { z } from "@hono/zod-openapi";
import { ApiPerfumeSimpleResponseSchema } from "./perfume.schema";

// GET 요청의 쿼리 파라미터 스키마
export const SearchGetQuerySchema = z.object({
  q: z.string().optional().default(""),
  limit: z.coerce.number().int().positive().default(15),
  cursor: z.string().uuid("유효하지 않은 커서 ID입니다.").optional(),
});

// POST 요청의 Body 스키마
export const SearchPostBodySchema = z.object({
  searchText: z.string().optional().default(""),
  brandFilter: z.array(z.string().uuid()).optional(),
  notesFilter: z.array(z.string().uuid()).optional(),
  accordsFilter: z.array(z.string().uuid()).optional(),
  cursor: z.string().uuid("유효하지 않은 커서 ID입니다.").optional(),
  limit: z.number().int().positive().optional().default(15),
});
export const PaginatedSearchResponseSchema = z.object({
  data: z.array(ApiPerfumeSimpleResponseSchema),
  totalCount: z.number().int(),
  nextCursor: z.string().uuid().nullable(),
});

export type SearchGetQuery = z.infer<typeof SearchGetQuerySchema>;
export type SearchPostBody = z.infer<typeof SearchPostBodySchema>;
export type PaginatedSearchResponse = z.infer<
  typeof PaginatedSearchResponseSchema
>;
