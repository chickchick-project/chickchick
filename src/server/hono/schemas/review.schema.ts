import { z } from "@hono/zod-openapi";
import {
  ReviewModelSchema,
  ReviewAttributeSelectionModelSchema,
  AttributeOptionModelSchema,
  ReviewAttributeModelSchema,
} from "@zod/schemas/variants/pure";

const ReviewSchema = ReviewModelSchema.omit({ likes: true, attributeSelections: true, author: true, perfume: true });
const ReviewAttributeSelectionSchema = ReviewAttributeSelectionModelSchema.omit({ option: true, review: true });
const AttributeOptionSchema = AttributeOptionModelSchema.omit({ attribute: true, selections: true });
const ReviewAttributeSchema = ReviewAttributeModelSchema.omit({ options: true });
import { PaginatedResponseSchema } from "./common.schema";
import { ApiPerfumeSimpleResponseSchema } from "./perfume.schema";
import { ApiReviewAuthorResponseSchema } from "./user.schema";

/**
 * 리뷰 ID 경로 파라미터 스키마
 */
export const ReviewIdParamSchema = z.object({
  reviewId: ReviewSchema.shape.id.openapi({
    param: { name: "reviewId", in: "path" },
    example: "b1c2d3e4-f5a6-7890-1234-abcdef567890",
  }),
});

const FullAttributeSelectionSchema = ReviewAttributeSelectionSchema.extend({
  option: AttributeOptionSchema.extend({
    attribute: ReviewAttributeSchema,
  }),
});

export const ApiReviewResponseSchema = ReviewSchema.extend({
  author: ApiReviewAuthorResponseSchema,
  perfume: ApiPerfumeSimpleResponseSchema,
  attributeSelections: z.array(FullAttributeSelectionSchema),
}).openapi("ApiReviewResponse");

export const ApiPopularReviewResponseSchema = ApiReviewResponseSchema.extend({
  _count: z.object({
    likes: z.number().int().openapi({
      description: "리뷰가 받은 좋아요의 총 개수",
      example: 42,
    }),
  }),
}).openapi("ApiPopularReviewResponse");

// --- 페이지네이션 응답 스키마 ---
export const PaginatedApiReviewResponseSchema = PaginatedResponseSchema(
  ApiReviewResponseSchema
);

/**
 * 리뷰 속성 스키마
 */
export const ReviewAttributesInputSchema = z.object({
  feeling: z.string().min(1, "이 향수에 대한 느낌을 선택해주세요."),
  longevity: z.string().min(1, "지속시간을 선택해주세요."),
  sillage: z.string().min(1, "잔향감을 선택해주세요."),
  genderTone: z.string().min(1, "향수가 떠오르게 하는 이미지를 선택해주세요."),
  season: z.array(z.string()).min(1, "계절을 최소 1개 이상 선택해야 합니다."),
  timeOfDay: z.string().min(1, "어울리는 시간대를 선택해주세요."),
  pricePerception: z.string().min(1, "가격에 대한 의견을 선택해주세요."),
});
/**
 * 리뷰 생성 스키마
 */

export const CreateReviewInputSchema = ReviewSchema.pick({
  content: true,
  usageStatus: true,
}).extend({
  attributes: ReviewAttributesInputSchema,
});
/**
 * 리뷰 수정 스키마
 */
export const UpdateReviewInputSchema = ReviewSchema.pick({
  content: true,
  usageStatus: true,
})
  .partial()
  .extend({
    attributes: ReviewAttributesInputSchema.partial().optional(),
  });

export type PaginatedApiReviewResponse = z.infer<
  typeof PaginatedApiReviewResponseSchema
>;
export type ApiReviewResponse = z.infer<typeof ApiReviewResponseSchema>;

export type CreateReviewInput = z.infer<typeof CreateReviewInputSchema>;
export type UpdateReviewInput = z.infer<typeof UpdateReviewInputSchema>;

export { PerfumeUsageStatus } from "@prisma/client";
