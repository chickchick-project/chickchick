import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import type { AppContext } from "@/lib/hono/app";
import { authMiddleware } from "@/lib/hono/middleware/auth.middleware";
import * as CommunityServices from "@/lib/hono/services/community.service";
import * as CommunitySchemas from "@/lib/hono/schemas/community.schema";
import * as CommonSchemas from "@/lib/hono/schemas/common.schema";

const communityApi = new OpenAPIHono<AppContext>();

/**
 * @method GET
 * @path /posts
 * @summary 커뮤니티 게시글 목록 조회
 */
const getPostsRoute = createRoute({
  method: "get",
  path: "/posts",
  summary: "커뮤니티 게시글 목록 조회",
  request: {
    query: CommunitySchemas.GetPostsQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: CommonSchemas.SuccessResponseSchema(
            z.array(CommunitySchemas.PostResponseSchema)
          ),
        },
      },
      description: "게시글 목록",
    },
    404: {
      content: {
        "application/json": {
          schema: CommonSchemas.ErrorResponseSchema,
        },
      },
      description: "게시글을 찾을 수 없음",
    },
  },
  tags: ["Community"],
});

communityApi.openapi(getPostsRoute, async (c) => {
  const queryParams = c.req.valid("query");

  const posts = await CommunityServices.getPostsService(queryParams);

  if (!posts) {
    return c.json(
      {
        success: false,
        message: "Posts not found",
      },
      404
    );
  }
  return c.json(
    {
      success: true,
      message: "Posts retrieved successfully",
      data: posts,
    },
    200
  );
});

/**
 * @method GET
 * @path /posts/{id}
 * @summary 커뮤니티 게시글 단일 조회
 */
const getPostRoute = createRoute({
  method: "get",
  path: "/posts/{id}",
  summary: "커뮤니티 게시글 단일 조회",
  description: "요청된 게시글 ID에 해당하는 단일 게시글 정보 조회",
  request: {
    params: CommunitySchemas.PostIdParamSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: CommonSchemas.SuccessResponseSchema(
            CommunitySchemas.PostResponseSchema
          ),
        },
      },
      description: "게시글",
    },
    404: {
      content: {
        "application/json": {
          schema: CommonSchemas.ErrorResponseSchema,
        },
      },
      description: "게시글을 찾을 수 없음",
    },
  },
  tags: ["Community"],
});

communityApi.openapi(getPostRoute, async (c) => {
  const { id } = c.req.valid("param");
  const post = await CommunityServices.getPostService(id);
  if (!post) {
    return c.json(
      {
        success: false,
        message: "Post not found",
      },
      404
    );
  }
  return c.json(
    {
      success: true,
      message: "Post retrieved successfully",
      data: post,
    },
    200
  );
});

/**
 * @method POST
 * @path /posts
 * @summary 커뮤니티 게시글 생성
 */
const createPostRoute = createRoute({
  method: "post",
  path: "/posts",
  summary: "커뮤니티 게시글 생성",
  description: "커뮤니티 게시글 생성",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CommunitySchemas.CreatePostRequestSchema,
        },
      },
    },
  },

  responses: {
    201: {
      content: {
        "application/json": {
          schema: CommonSchemas.SuccessResponseSchema(
            CommunitySchemas.PostResponseSchema
          ),
        },
      },
      description: "게시글 생성",
    },
    400: {
      content: {
        "application/json": {
          schema: CommonSchemas.ErrorResponseSchema,
        },
      },
      description: "잘못된 요청 데이터",
    },
    401: {
      content: {
        "application/json": {
          schema: CommonSchemas.ErrorResponseSchema,
        },
      },
      description: "인증되지 않은 사용자",
    },
  },
  tags: ["Community"],
});

communityApi.use(createPostRoute.getRoutingPath(), authMiddleware);

communityApi.openapi(createPostRoute, async (c) => {
  const user = c.get("user");
  const content = c.req.valid("json");
  const { thumbnailUrl, ...restContent } = content;

  const post = await CommunityServices.createPostService({
    ...restContent,
    thumbnailUrl: thumbnailUrl ?? undefined,
    userId: user!.id as string,
  });

  return c.json(
    {
      success: true,
      message: "Post created successfully",
      data: post,
    },
    201
  );
});

export default communityApi;
