import { createRoute, z } from "@hono/zod-openapi";
import { CreateUserSchema, UserSchema } from "@/lib/hono/schemas/user.schema";
import {
  ErrorResponseSchema,
  SuccessResponseSchema,
} from "@/lib/hono/schemas/common.schema";

export const createUserRoute = createRoute({
  method: "post",
  path: "/users",
  summary: "새로운 유저 생성",
  description: "새로운 유저를 생성함",
  request: {
    body: {
      content: { "application/json": { schema: CreateUserSchema } },
      description: "생성할 유저 정보",
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: SuccessResponseSchema(UserSchema),
        },
      },
      description: "성공적으로 유저를 생성함",
    },
    400: {
      description: "잘못된 요청 데이터",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
  tags: ["User"],
});

export const getUserRoute = createRoute({
  method: "get",
  path: "/users/{id}",
  summary: "특정 유저 조회",
  request: {
    params: z.object({
      id: z
        .string()
        .uuid()
        .openapi({
          param: { name: "id", in: "path" },
          example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        }),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessResponseSchema(UserSchema),
        },
      },
      description: "성공적으로 유저를 조회함",
    },
    404: {
      description: "유저를 찾을 수 없음",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
  tags: ["User"],
});
