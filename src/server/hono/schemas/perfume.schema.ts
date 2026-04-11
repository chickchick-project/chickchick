import { z } from "@hono/zod-openapi";
import {
  PerfumeSchema,
  PerfumeImageSchema,
  PerfumeAccordSchema,
  PerfumeNoteSchema,
  ReviewSchema,
  UserSchema,
} from "@zod/modelSchema";
import { ApiBrandForEmbeddingResponseSchema } from "./brand.schema";

/**
 * API 응답용 향수 노트 스키마
 */
export const ApiPerfumeNoteResponseSchema = PerfumeNoteSchema.pick({
  id: true,
  nameEn: true,
  nameKo: true,
}).openapi("ApiPerfumeNoteResponse");

/**
 * API 응답용 향수 어코드 스키마
 */
export const ApiPerfumeAccordResponseSchema = PerfumeAccordSchema.pick({
  id: true,
  nameEn: true,
  nameKo: true,
}).openapi("ApiPerfumeAccordResponse");

//API 응답용 스키마
const PerfumeBaseResponseSchema = PerfumeSchema.extend({
  brand: ApiBrandForEmbeddingResponseSchema,
  perfumeImage: PerfumeImageSchema.pick({ imageUrl: true }).nullable(),
}).omit({
  brandId: true,
  officialUrl: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * 향수 간단 응답 스키마
 */
export const ApiPerfumeSimpleResponseSchema = PerfumeBaseResponseSchema.pick({
  id: true,
  nameEn: true,
  nameKo: true,
  brand: true,
  perfumeImage: true,
});

/**
 * 향수 상세 응답 스키마
 */
export const ApiPerfumeDetailResponseSchema = PerfumeBaseResponseSchema.extend({
  accordMappings: z.array(z.object({ accord: ApiPerfumeAccordResponseSchema })),
  noteMappings: z.array(
    z.object({ note: ApiPerfumeNoteResponseSchema, noteStage: z.string() })
  ),
  reviews: z.array(
    ReviewSchema.pick({ id: true, content: true }).extend({
      author: UserSchema.pick({ id: true, nickname: true, imageUrl: true }),
    })
  ),
  _count: z.object({
    bookmarks: z.number().int(),
    reviews: z.number().int(),
    collectedByUsers: z.number().int(),
  }),
}).openapi("ApiPerfumeDetailResponse");

/**
 * 향수 테마 쿼리 스키마
 * TODO: 배너에서 사용할 향수 테마를 위한 쿼리 스키마
 */
export const PerfumeThemeQuerySchema = z.object({
  themeName: z.string().openapi({
    param: { name: "themeName", in: "query" },
    example: "spring_breeze",
  }),
});

export type ApiPerfumeSimpleResponse = z.infer<
  typeof ApiPerfumeSimpleResponseSchema
>;

export type ApiPerfumeDetailResponse = z.infer<
  typeof ApiPerfumeDetailResponseSchema
>;

export type ApiPerfumeNoteResponse = z.infer<
  typeof ApiPerfumeNoteResponseSchema
>;

export type ApiPerfumeAccordResponse = z.infer<
  typeof ApiPerfumeAccordResponseSchema
>;

export type { PerfumeNote, PerfumeAccord } from "@prisma/client";
