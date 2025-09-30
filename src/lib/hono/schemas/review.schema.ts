import { z } from "@hono/zod-openapi";
import { Season } from "@prisma/client";
import ReviewSchema from "@zod/modelSchema/ReviewSchema";
import UserSchema from "@zod/modelSchema/UserSchema";

const ReviewChipsSchema = ReviewSchema.pick({
  feeling: true,
  longevity: true,
  sillage: true,
  genderTone: true,
  season: true,
  timeOfDay: true,
  pricePerception: true,
});

export const ReviewResponseSchema = ReviewSchema.pick({
  id: true,
  usageStatus: true,
  content: true,
  createdAt: true,
}).extend({
  author: UserSchema.pick({
    id: true,
    nickname: true,
    imageUrl: true,
  }),
  perfume: z
    .object({
      id: z.string().uuid(),
      nameEn: z.string().nullable(),
      nameKo: z.string().nullable(),
    })
    .nullable(),
  chips: ReviewChipsSchema,
});

export const CreateReviewBodySchema = ReviewSchema.pick({ content: true });

export const CreateReviewSchema = ReviewSchema.pick({
  usageStatus: true,
  feeling: true,
  longevity: true,
  sillage: true,
  genderTone: true,
  season: true,
  timeOfDay: true,
  pricePerception: true,
}).extend({
  season: z.preprocess(
    (val) => (Array.isArray(val) ? val : [val]),
    z.array(z.nativeEnum(Season))
  ),
});

export const CreateReviewPayloadSchema = CreateReviewSchema.merge(
  CreateReviewBodySchema
).extend({
  authorId: z.string().uuid(),
  perfumeId: z.string().uuid(),
});

export const UpdateReviewSchema = ReviewSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type RowReviewResponse = z.infer<typeof ReviewSchema> & {
  author: {
    id: string;
    nickname: string;
    imageUrl: string | null;
  };
  perfume: {
    id: string;
    nameEn: string | null;
    nameKo: string | null;
  };
};
export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;
export type ReviewChips = z.infer<typeof ReviewChipsSchema>;
export type CreateReview = z.infer<typeof CreateReviewSchema>;
export type CreateReviewPayload = z.infer<typeof CreateReviewPayloadSchema>;
export type UpdateReview = z.infer<typeof UpdateReviewSchema>;
