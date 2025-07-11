import { z } from "@hono/zod-openapi";
import PerfumeSchema from "@zod/modelSchema/PerfumeSchema";
import BrandSchema from "@zod/modelSchema/BrandSchema";
import PerfumeImageSchema from "@zod/modelSchema/PerfumeImageSchema";

//API 응답용 스키마
export const PerfumeResponseSchema = PerfumeSchema.extend({
  brand: BrandSchema.pick({
    nameEn: true,
    nameKo: true,
  }),
  perfumeImage: PerfumeImageSchema.pick({
    imageUrl: true,
  }).nullable(),
})
  .omit({
    createdAt: true,
    updatedAt: true,
    brandId: true,
    officialUrl: true,
  })
  .openapi("PerfumeResponse", {
    description: "향수 상세 정보",
  });

/**
 * 향수 검색 결과 스키마
 */

export const GetPerfumeSearchResultSchema = PerfumeResponseSchema.extend({
  priority: z.number().int().min(0),
}).openapi("PerfumeSearchResult", {
  description: "향수 검색 결과 항목",
});

/**
 * 향수 목록 응답 스키마
 */
export const PerfumeListResponseSchema = z
  .object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(PerfumeResponseSchema),
  })
  .openapi("PerfumeListResponse");

/**
 * 향수 상세 응답 스키마
 */
export const PerfumeDetailResponseSchema = z
  .object({
    success: z.boolean(),
    message: z.string(),
    data: PerfumeResponseSchema,
  })
  .openapi("PerfumeDetailResponse");

// 타입 추출
export type PerfumeResponse = z.infer<typeof PerfumeResponseSchema>;
export type GetPerfumeSearchResult = z.infer<
  typeof GetPerfumeSearchResultSchema
>;
export type PerfumeListResponse = z.infer<typeof PerfumeListResponseSchema>;
export type PerfumeDetailResponse = z.infer<typeof PerfumeDetailResponseSchema>;
