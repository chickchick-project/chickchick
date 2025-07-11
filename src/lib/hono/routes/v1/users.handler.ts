import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import * as UserService from "@/lib/hono/services/user.service";
import * as UserSchemas from "@/lib/hono/schemas/user.schema";
import * as CommonSchemas from "@/lib/hono/schemas/common.schema";

const usersApi = new OpenAPIHono();

const createUserRoute = createRoute({
  method: "post",
  path: "/users",
  summary: "새로운 유저 생성",
  description: "새로운 유저를 생성함",
  request: {
    body: {
      content: { "application/json": { schema: UserSchemas.CreateUserSchema } },
      description: "생성할 유저 정보",
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: CommonSchemas.SuccessResponseSchema(UserSchemas.UserSchema),
        },
      },
      description: "성공적으로 유저를 생성함",
    },
    400: {
      description: "잘못된 요청 데이터",
      content: {
        "application/json": {
          schema: CommonSchemas.ErrorResponseSchema,
        },
      },
    },
  },
  tags: ["User"],
});

usersApi.openapi(
  createUserRoute,
  async (c) => {
    const newUser = c.req.valid("json");
    const creeatedUser = await UserService.createUserService(newUser);
    return c.json(
      {
        success: true,
        message: "User created successfully",
        data: creeatedUser,
      },
      201
    );
  },
  (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          message: "User creation failed",
          error: result.error,
        },
        400
      );
    }
  }
);

const getUserRoute = createRoute({
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
          schema: CommonSchemas.SuccessResponseSchema(UserSchemas.UserSchema),
        },
      },
      description: "성공적으로 유저를 조회함",
    },
    404: {
      description: "유저를 찾을 수 없음",
      content: {
        "application/json": {
          schema: CommonSchemas.ErrorResponseSchema,
        },
      },
    },
  },
  tags: ["User"],
});

usersApi.openapi(getUserRoute, async (c) => {
  const userId = c.req.param("id");
  const user = await UserService.getUserService(userId);
  if (!user) {
    return c.json(
      {
        success: false,
        message: "User not found",
      },
      404
    );
  }
  return c.json(
    {
      success: true,
      message: "User found",
      data: user,
    },
    200
  );
});

export default usersApi;
