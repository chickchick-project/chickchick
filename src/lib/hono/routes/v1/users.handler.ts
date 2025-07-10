import { OpenAPIHono } from "@hono/zod-openapi";
import {
  createUserRoute,
  getUserRoute,
} from "@/lib/hono/api-spec/v1/user.routes";
import {
  createUserService,
  getUserService,
} from "@/lib/hono/services/user.service";

const usersApi = new OpenAPIHono();

usersApi.openapi(
  createUserRoute,
  async (c) => {
    const newUser = c.req.valid("json");
    const creeatedUser = await createUserService(newUser);
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

usersApi.openapi(getUserRoute, async (c) => {
  const userId = c.req.param("id");
  const user = await getUserService(userId);
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
