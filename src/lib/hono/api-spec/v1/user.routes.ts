// import { createRoute, z } from "@hono/zod-openapi";
// import { CreateUserSchema, UserSchema } from "@/lib/hono/schemas/user.schema";
// import {
//   ErrorResponseSchema,
//   SuccessResponseSchema,
// } from "@/lib/hono/schemas/common.schema";

// export const getUserRoute = createRoute({
//   method: "get",
//   path: "/users/{id}",
//   summary: "특정 유저 조회",
//   request: {
//     params: z.object({
//       id: z
//         .string()
//         .uuid()
//         .openapi({
//           param: { name: "id", in: "path" },
//           example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
//         }),
//     }),
//   },
//   responses: {
//     200: {
//       content: {
//         "application/json": {
//           schema: SuccessResponseSchema(UserSchema),
//         },
//       },
//       description: "성공적으로 유저를 조회함",
//     },
//     404: {
//       description: "유저를 찾을 수 없음",
//       content: {
//         "application/json": {
//           schema: ErrorResponseSchema,
//         },
//       },
//     },
//   },
//   tags: ["User"],
// });
