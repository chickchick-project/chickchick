import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import * as PerfumeServices from "@/lib/hono/services/perfume.service";
import * as PerfumeSchemas from "@/lib/hono/schemas/perfume.schema";
import * as CommunityServices from "@/lib/hono/services/community.service";
import * as CommunitySchemas from "@/lib/hono/schemas/community.schema";
import { createStandardApiResponses } from "../../utils/createStandardApiResponses";
import { authMiddleware } from "@/lib/hono/middleware/auth.middleware";
import type { AppContext } from "@/lib/hono/app";

const usersApi = new OpenAPIHono<AppContext>();

usersApi.use("*", authMiddleware);

/**
 * @method GET
 * @path /{userId}/bookmarks/perfumes
 * @description 요청된 사용자가 북마크한 모든 향수 목록을 조회합니다.
 * @summary 북마크 향수 목록 조회
 */
const bookmarkPerfumeRoute = createRoute({
  method: "get",
  path: "/{userId}/bookmarks/perfumes",
  summary: "북마크 향수 목록 조회",
  description: "요청된 사용자가 북마크한 모든 향수 목록을 조회합니다.",
  request: {
    params: z.object({
      userId: z.string().optional(),
    }),
  },
  responses: createStandardApiResponses(
    {
      schema: PerfumeSchemas.PerfumeResponseSchema,
      description: "향수",
    },
    ["401"]
  ),
  tags: ["User"],
});

usersApi.openapi(bookmarkPerfumeRoute, async (c) => {
  const { userId: targetUserId } = c.req.valid("param");
  const user = c.get("user");
  if (!user) {
    return c.json(
      {
        success: false,
        message: "인증되지 않은 사용자 입니다.",
      },
      401
    );
  }
  const result = await PerfumeServices.getBookmarkedPerfumesService(
    user!.id as string,
    targetUserId ?? null
  );

  return c.json(
    {
      success: true,
      message: "북마크된 향수 목록을 성공적으로 불러왔습니다.",
      data: result,
    },
    200
  );
});

/**
 * @method GET
 * @path /{userId}/bookmarks/posts
 * @description 요청된 사용자가 북마크한 모든 게시글 목록을 조회합니다.
 * @summary 북마크 게시글 목록 조회
 */
const bookmarkPostRoute = createRoute({
  method: "get",
  path: "/{userId}/bookmarks/posts",
  summary: "북마크 게시글 목록 조회",
  description: "요청된 사용자가 북마크한 모든 게시글 목록을 조회합니다.",
  request: {
    params: z.object({
      userId: z.string().optional(),
    }),
  },
  responses: createStandardApiResponses(
    {
      schema: CommunitySchemas.PaginatedPostListResponseSchema,
      description: "게시글 목록",
    },
    ["401"]
  ),
  tags: ["User"],
});

usersApi.openapi(bookmarkPostRoute, async (c) => {
  const { userId: targetUserId } = c.req.valid("param");
  if (!targetUserId) {
    return c.json(
      {
        success: false,
        message: "인증되지 않은 사용자 입니다.",
      },
      401
    );
  }
  const result = await CommunityServices.getBookmarkedPostService(targetUserId);

  return c.json(
    {
      success: true,
      message: "북마크된 게시글 목록을 성공적으로 불러왔습니다.",
      data: result,
    },
    200
  );
});

// const createUserRoute = createRoute({
//   method: "post",
//   path: "/users",
//   summary: "새로운 유저 생성",
//   description: "새로운 유저를 생성함",
//   request: {
//     body: {
//       content: { "application/json": { schema: UserSchemas.CreateUserSchema } },
//       description: "생성할 유저 정보",
//     },
//   },
//   responses: {
//     201: {
//       content: {
//         "application/json": {
//           schema: CommonSchemas.SuccessResponseSchema(UserSchemas.UserSchema),
//         },
//       },
//       description: "성공적으로 유저를 생성함",
//     },
//     400: {
//       description: "잘못된 요청 데이터",
//       content: {
//         "application/json": {
//           schema: CommonSchemas.ErrorResponseSchema,
//         },
//       },
//     },
//   },
//   tags: ["User"],
// });

// usersApi.openapi(
//   createUserRoute,
//   async (c) => {
//     const newUser = c.req.valid("json");
//     const creeatedUser = await UserService.createUserService(newUser);
//     return c.json(
//       {
//         success: true,
//         message: "User created successfully",
//         data: creeatedUser,
//       },
//       201
//     );
//   },
//   (result, c) => {
//     if (!result.success) {
//       return c.json(
//         {
//           success: false,
//           message: "User creation failed",
//           error: result.error,
//         },
//         400
//       );
//     }
//   }
// );

// const getUserRoute = createRoute({
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
//           schema: CommonSchemas.SuccessResponseSchema(UserSchemas.UserSchema),
//         },
//       },
//       description: "성공적으로 유저를 조회함",
//     },
//     404: {
//       description: "유저를 찾을 수 없음",
//       content: {
//         "application/json": {
//           schema: CommonSchemas.ErrorResponseSchema,
//         },
//       },
//     },
//   },
//   tags: ["User"],
// });

// usersApi.openapi(getUserRoute, async (c) => {
//   const userId = c.req.param("id");
//   const user = await UserService.getUserService(userId);
//   if (!user) {
//     return c.json(
//       {
//         success: false,
//         message: "User not found",
//       },
//       404
//     );
//   }
//   return c.json(
//     {
//       success: true,
//       message: "User found",
//       data: user,
//     },
//     200
//   );
// });

export default usersApi;
