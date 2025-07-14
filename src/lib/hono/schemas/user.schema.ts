// import { z } from "@hono/zod-openapi";

// export const UserSchema = z.object({
//   id: z.string().uuid(),
//   name: z.string().min(2, { message: "이름은 2글자 이상이어야 합니다." }),
//   email: z.string().email(),
//   createdAt: z.date(),
// });

// export const CreateUserSchema = UserSchema.omit({
//   id: true,
//   createdAt: true,
// });

// export type User = z.infer<typeof UserSchema>;
// export type CreateUser = z.infer<typeof CreateUserSchema>;
