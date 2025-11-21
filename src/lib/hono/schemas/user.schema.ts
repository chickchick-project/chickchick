import { z } from "@hono/zod-openapi";
import { UserSchema } from "@zod/modelSchema";

export const ApiUserProfileResponseSchema = UserSchema.pick({
  id: true,
  nickname: true,
  imageUrl: true,
  totalPoints: true,
})
  .extend({
    level: z.number().int().min(0),
  })
  .openapi("ApiUserProfileResponse");

export const ApiReviewAuthorResponseSchema = UserSchema.pick({
  id: true,
  nickname: true,
  imageUrl: true,
}).openapi("ApiReviewAuthorResponse");

export type ApiUserProfileResponse = z.infer<
  typeof ApiUserProfileResponseSchema
>;

export type ApiReviewAuthorResponse = z.infer<
  typeof ApiReviewAuthorResponseSchema
>;
