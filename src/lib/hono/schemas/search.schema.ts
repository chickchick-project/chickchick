import { z } from "@hono/zod-openapi";
import { PerfumeSchema } from "@zod/modelSchema/PerfumeSchema";

// GET 요청의 쿼리 파라미터 스키마
export const SearchGetQuerySchema = z.object({
  q: z.string().default(""),
  limit: z.string().optional().default("15").transform(Number),
  cursor: z.string().uuid("유효하지 않은 커서 ID입니다.").optional(),
});

// POST 요청의 Body 스키마
export const SearchPostBodySchema = z.object({
  search_text: z.string().default("").optional(),
  brand_filter: z.array(z.string().uuid()).nullable().optional(),
  notes_filter: z.array(z.string().uuid()).nullable().optional(),
  accords_filter: z.array(z.string().uuid()).nullable().optional(),
  last_seen_id: z.string().uuid("유효하지 않은 커서 ID입니다.").nullable(),
  result_limit: z.number().optional().default(15),
});

export const PaginatedPerfumeResponseSchema = z.object({
  data: z.array(PerfumeSchema),
  nextCursor: z.string().uuid().nullable(),
  totalCount: z.number().optional(),
});

export type GetSearchParams = z.infer<typeof SearchGetQuerySchema>;
export type PostSearchParams = z.infer<typeof SearchPostBodySchema>;
export type PaginatedPerfumeResponse = z.infer<
  typeof PaginatedPerfumeResponseSchema
>;
