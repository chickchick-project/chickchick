import { z } from "@hono/zod-openapi";
import {
  ReviewSchema,
  ReviewAttributeSelectionSchema,
  AttributeOptionSchema,
  ReviewAttributeSchema,
} from "@zod/modelSchema";
import { PaginatedResponseSchema } from "./common.schema";
import { ApiPerfumeSimpleResponseSchema } from "./perfume.schema";
import { ApiUserProfileResponseSchema } from "./user.schema";

const FullAttributeSelectionSchema = ReviewAttributeSelectionSchema.extend({
  option: AttributeOptionSchema.extend({
    attribute: ReviewAttributeSchema,
  }),
});

export const ApiReviewResponseSchema = ReviewSchema.extend({
  author: ApiUserProfileResponseSchema,
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

export const ReviewAttributesInputSchema = z.object({
  feeling: z.string().optional(),
  longevity: z.string().optional(),
  sillage: z.string().optional(),
  genderTone: z.string().optional(),
  season: z.array(z.string()).optional(),
  timeOfDay: z.string().optional(),
  pricePerception: z.string().optional(),
});

export const CreateReviewInputSchema = ReviewSchema.pick({
  content: true,
  usageStatus: true,
}).extend({
  attributes: ReviewAttributesInputSchema,
});

export const UpdateReviewInputSchema = CreateReviewInputSchema.partial();

export type PaginatedApiReviewResponse = z.infer<
  typeof PaginatedApiReviewResponseSchema
>;
export type ApiReviewResponse = z.infer<typeof ApiReviewResponseSchema>;

export type CreateReviewInput = z.infer<typeof CreateReviewInputSchema>;
export type UpdateReviewInput = z.infer<typeof UpdateReviewInputSchema>;
