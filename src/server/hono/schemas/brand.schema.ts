import { z } from "@hono/zod-openapi";
import { BrandSchema } from "@zod/modelSchema";
import { MapLocationSchema } from "./common.schema";

/**
 * 브랜드 간단 응답 스키마
 * - 브랜드 목록 조회 시 사용
 */
export const ApiBrandSimpleResponseSchema = BrandSchema.pick({
  id: true,
  nameEn: true,
  nameKo: true,
}).openapi("ApiBrandSimpleResponse");

/**
 * 브랜드 상세 응답 스키마
 * - 브랜드 상세 페이지에서 사용
 */
export const ApiBrandDetailResponseSchema = BrandSchema.pick({
  id: true,
  nameEn: true,
  nameKo: true,
  description: true,
  imageUrl: true,
  brandUrl: true,
})
  .extend({
    mapLocation: MapLocationSchema,
  })
  .openapi("ApiBrandDetailResponse");

/**
 * 브랜드 이름(한글) 파라미터 스키마
 */
export const BrandNameParamSchema = z.object({
  nameKo: z.string().openapi({
    param: { name: "nameKo", in: "path" },
    example: "딥티크",
    description: "브랜드 한글 이름",
  }),
});

/**
 * 브랜드 ID 파라미터 스키마
 */
export const BrandIdParamSchema = z.object({
  id: z
    .string()
    .uuid({ message: "유효한 UUID 형식이 아닙니다." })
    .openapi({
      param: { name: "id", in: "path" },
      example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      description: "브랜드 고유 ID (UUID)",
    }),
});
/**
 * 향수 응답 등 다른 엔티티에 포함될 때 사용할 브랜드 스키마
 */
export const ApiBrandForEmbeddingResponseSchema = BrandSchema.pick({
  nameEn: true,
  nameKo: true,
  brandUrl: true,
});

export const StoreSchema = z
  .object({
    name: z.string(),
    address: z.string(),
    roadAddress: z.string().optional(),
    telephone: z.string().optional(),
    x: z.string(),
    y: z.string(),
    category: z.string().optional(),
    categoryGroupCode: z.string().optional(),
    link: z.string().optional(),
    distance: z.number().optional(),
  })
  .openapi("Store");

export const BrandStoreNameParamSchema = z.object({
  name: z.string().openapi({
    param: { name: "name", in: "path" },
    example: "딥티크",
    description: "검색할 브랜드 이름",
  }),
});

export const BrandStoreQuerySchema = z.object({
  x: z.string().optional().openapi({ description: "사용자 경도" }),
  y: z.string().optional().openapi({ description: "사용자 위도" }),
});

export const BrandStoresResponseSchema = z
  .object({
    success: z.literal(true),
    stores: z.array(StoreSchema),
    total: z.number(),
  })
  .openapi("BrandStoresResponse");

export type ApiBrandSimpleResponse = z.infer<
  typeof ApiBrandSimpleResponseSchema
>;

export type ApiBrandDetailResponse = z.infer<
  typeof ApiBrandDetailResponseSchema
>;

export type Store = z.infer<typeof StoreSchema>;
