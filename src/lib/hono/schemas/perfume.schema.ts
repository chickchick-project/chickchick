import { z } from "@hono/zod-openapi";
import PerfumeSchema from "@zod/modelSchema/PerfumeSchema";
import BrandSchema from "@zod/modelSchema/BrandSchema";
import PerfumeImageSchema from "@zod/modelSchema/PerfumeImageSchema";
import AccordSchema from "@zod/modelSchema/PerfumeAccordSchema";
import NoteSchema from "@zod/modelSchema/PerfumeNoteSchema";
import ReviewSchema from "@zod/modelSchema/ReviewSchema";
import UserSchema from "@zod/modelSchema/UserSchema";

//API 응답용 스키마
export const PerfumeBaseResponseSchema = PerfumeSchema.extend({
  brand: BrandSchema.pick({ nameEn: true, nameKo: true }),
  perfumeImage: PerfumeImageSchema.pick({ imageUrl: true }).nullable(),
}).omit({
  brandId: true,
  officialUrl: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * 향수 상세 응답 스키마
 */
export const PerfumeDetailResponseSchema = PerfumeBaseResponseSchema.extend({
  accordMappings: z.array(z.object({ accord: AccordSchema })),
  noteMappings: z.array(z.object({ note: NoteSchema, noteStage: z.string() })),
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
});

/**
 * 향수 ID 파라미터 스키마
 */
export const PerfumeIdParamSchema = z.object({
  id: PerfumeSchema.shape.id.openapi({
    param: { name: "id", in: "path" },
    example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  }),
});

/**
 * 향수 테마 쿼리 스키마
 * TODO: 배너에서 사용할 향수 테마를 위한 쿼리 스키마
 */
export const PerfumeThemeQuerySchema = z.object({
  theme: z.string().openapi({
    param: { name: "theme", in: "query" },
    example: "spring_breeze",
  }),
});

export type PerfumeBaseResponse = z.infer<typeof PerfumeBaseResponseSchema>;
export type PerfumeDetailResponse = z.infer<typeof PerfumeDetailResponseSchema>;
