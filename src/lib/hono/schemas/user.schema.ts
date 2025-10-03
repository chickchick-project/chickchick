import { z } from "zod";
import { UserSchema } from "@zod/modelSchema";

export const ApiUserProfileResponseSchema = UserSchema.pick({
  id: true,
  nickname: true,
  imageUrl: true,
}).openapi("ApiUserProfileResponse");

export type ApiUserProfileResponse = z.infer<
  typeof ApiUserProfileResponseSchema
>;
