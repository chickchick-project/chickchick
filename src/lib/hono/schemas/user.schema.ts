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

export type ApiUserProfileResponse = z.infer<
  typeof ApiUserProfileResponseSchema
>;
