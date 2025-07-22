// lib/hono/schemas/user.schema.ts

import { z } from "zod";
import UserSchema from "@zod/modelSchema/UserSchema";
// import { PostResponseSchema } from "./community.schema";
// import { PerfumeBaseResponseSchema } from "./perfume.schema";

export const UserProfileResponseSchema = UserSchema.pick({
  id: true,
  nickname: true,
  imageUrl: true,
});

export const UserIdParamSchema = z.object({
  userId: UserSchema.shape.id.openapi({
    param: { name: "userId", in: "path" },
    example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  }),
});

export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;
