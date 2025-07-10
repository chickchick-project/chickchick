import { z } from "@hono/zod-openapi";
import { PerfumeSchema as basePerfumeSchema } from "@zod/modelSchema/PerfumeSchema";

/**
 * 향수 상세 정보
 */
export const PerfumeSchema = basePerfumeSchema.openapi("Perfume", {
  description: "향수 상세 정보",
});

/**
 * 향수 검색 결과 스키마
 */
export const PerfumeSearchResultSchema = z
  .object({
    id: z.string().uuid().openapi({
      description: "향수 ID",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    nameEn: z.string().openapi({
      description: "향수 영문명",
      example: "Chanel No. 5",
    }),
    nameKo: z.string().nullable().openapi({
      description: "향수 한글명",
      example: "샤넬 넘버 5",
    }),
    brandNameEn: z.string().openapi({
      description: "브랜드 영문명",
      example: "Chanel",
    }),
    brandNameKo: z.string().nullable().openapi({
      description: "브랜드 한글명",
      example: "샤넬",
    }),
    imageUrl: z.string().url().nullable().openapi({
      description: "향수 이미지 URL",
      example: "https://example.com/perfume.jpg",
    }),
    priority: z.number().int().min(0).openapi({
      description: "우선순위",
      example: 1,
    }),
  })
  .openapi("PerfumeSearchResult", {
    description: "향수 검색 결과 항목",
  });

/**
 * 향수 목록 응답 스키마
 */
export const PerfumeListResponseSchema = z
  .object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(PerfumeSchema),
  })
  .openapi("PerfumeListResponse");

/**
 * 향수 상세 응답 스키마
 */
export const PerfumeDetailResponseSchema = z
  .object({
    success: z.boolean(),
    message: z.string(),
    data: PerfumeSchema,
  })
  .openapi("PerfumeDetailResponse");

// 타입 추출
export type Perfume = z.infer<typeof PerfumeSchema>;
export type PerfumeSearchResult = z.infer<typeof PerfumeSearchResultSchema>;
export type PerfumeListResponse = z.infer<typeof PerfumeListResponseSchema>;
export type PerfumeDetailResponse = z.infer<typeof PerfumeDetailResponseSchema>;
