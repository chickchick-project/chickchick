import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import type { AppContext } from "@/lib/hono/app";
import { authMiddleware } from "@/lib/hono/middleware/auth.middleware";
import * as CommunityServices from "@/lib/hono/services/community.service";
import * as CommunitySchemas from "@/lib/hono/schemas/community.schema";
import { createStandardApiResponses } from "@/lib/hono/utils/createStandardApiResponses";

const communityApi = new OpenAPIHono<AppContext>();
const authenticatedApi = new OpenAPIHono<AppContext>();

authenticatedApi.use("*", authMiddleware);

/**
 * @method GET
 * @path /posts
 * @summary 커뮤니티 게시글 목록 조회
 */
const getPostListRoute = createRoute({
  method: "get",
  path: "/posts",
  summary: "커뮤니티 게시글 목록 조회",
  request: {
    query: CommunitySchemas.GetPostsQuerySchema,
  },
  responses: createStandardApiResponses(
    {
      schema: CommunitySchemas.PaginatedPostListResponseSchema,
      description: "게시글 목록",
    },
    ["404"]
  ),
  tags: ["Community"],
});

communityApi.openapi(getPostListRoute, async (c) => {
  const queryParams = c.req.valid("query");

  const posts = await CommunityServices.getPaginatedPostListService(
    queryParams
  );

  if (!posts) {
    return c.json(
      {
        success: false,
        message: "게시글 목록을 찾을 수 없습니다.",
      },
      404
    );
  }
  return c.json(
    {
      success: true,
      message: "게시글 목록을 성공적으로 불러왔습니다.",
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
  responses: createStandardApiResponses(
    {
      schema: CommunitySchemas.PostResponseSchema,
      description: "게시글",
    },
    ["404"]
  ),
  tags: ["Community"],
});

communityApi.openapi(getPostRoute, async (c) => {
  const { id } = c.req.valid("param");
  const post = await CommunityServices.getPostService(id);
  if (!post) {
    return c.json(
      {
        success: false,
        message: "게시글을 찾을 수 없습니다.",
      },
      404
    );
  }
  return c.json(
    {
      success: true,
      message: "게시글을 성공적으로 불러왔습니다.",
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

  responses: createStandardApiResponses(
    {
      schema: CommunitySchemas.PostResponseSchema,
      description: "게시글",
    },
    ["400", "401"]
  ),
  tags: ["Community"],
});

authenticatedApi.openapi(createPostRoute, async (c) => {
  const user = c.get("user");
  const content = c.req.valid("json");
  const { thumbnailUrl, ...restContent } = content;
  if (!user) {
    return c.json(
      {
        success: false,
        message: "인증되지 않은 사용자 입니다.",
      },
      401
    );
  }

  const post = await CommunityServices.createPostService({
    ...restContent,
    thumbnailUrl: thumbnailUrl ?? undefined,
    userId: user!.id as string,
  });

  if (!post) {
    return c.json(
      {
        success: false,
        message: "게시글을 생성할 수 없습니다.",
      },
      400
    );
  }

  return c.json(
    {
      success: true,
      message: "게시글을 성공적으로 생성했습니다.",
      data: post,
    },
    201
  );
});

/**
 * @method POST
 * @path /posts/{id}/like
 * @summary 커뮤니티 게시글 좋아요 추가
 */
const likePostRoute = createRoute({
  method: "post",
  path: "/posts/{id}/like",
  summary: "게시글 좋아요",
  description: "게시글 좋아요 추가 한번 더 요청하면 자동으로 제거",
  request: { params: CommunitySchemas.PostIdParamSchema },
  responses: createStandardApiResponses(
    {
      schema: CommunitySchemas.PostResponseSchema,
      description: "게시글",
    },
    ["401", "404"]
  ),
  tags: ["Community"],
});

authenticatedApi.openapi(likePostRoute, async (c) => {
  const { id } = c.req.valid("param");
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
  const result = await CommunityServices.likePostService(
    id,
    user!.id as string
  );

  if (!result) {
    return c.json(
      {
        success: false,
        message: "게시글을 찾을 수 없습니다.",
      },
      404
    );
  }
  return c.json(
    {
      success: true,
      message: "게시글 좋아요를 성공적으로 추가했습니다.",
      data: result,
    },
    200
  );
});

// /**
//  * @method GET
//  * @path /posts/{id}/comments
//  * @summary 커뮤니티 게시글 댓글 조회
//  */
// const getPostCommentsRoute = createRoute({
//   method: "get",
//   path: "/posts/{id}/comments",
// });

// communityApi.use(getPostCommentsRoute.getRoutingPath(), authMiddleware);

// const getPostCommentsRoute = createRoute({
//   method: "get",
//   path: "/posts/{id}/comments",
//   summary: "게시글 댓글 목록 조회",
//   request: { params: CommunitySchemas.PostIdParamSchema },
//   responses: {
//     200: {
//       description: "댓글 목록 조회 성공",
//       content: {
//         "application/json": {
//           schema: CommonSchemas.SuccessResponseSchema(
//             z.array(CommunitySchemas.CommentResponseSchema)
//           ),
//         },
//       },
//     },
//     404: {
//       description: "게시글을 찾을 수 없음",
//       content: {
//         "application/json": {
//           schema: CommonSchemas.NotFoundResponse,
//         },
//       },
//     },
//   },
//   tags: ["Community"],
// });

// authenticatedApi.openapi(getPostCommentsRoute, async (c) => {
//   const { id } = c.req.valid("param");
//   const post = await CommunityServices.getPostCommentsService(id);
//   return c.json(
//     {
//       success: true,
//       message: "Post comments retrieved successfully",
//       data: post,
//     },
//     200
//   );
// });

// /**
//  * @method POST
//  * @path /posts/{id}/comments
//  * @summary 커뮤니티 게시글 댓글 생성
//  */
// const createPostCommentRoute = createRoute({
//   method: "post",
//   path: "/posts/{id}/comments",
//   summary: "게시글 댓글 생성",
//   request: {
//     params: CommunitySchemas.PostIdParamSchema,
//     body: {
//       content: {
//         "application/json": {
//           schema: CommunitySchemas.CreatePostCommentRequestSchema,
//         },
//       },
//     },
//   },
//   responses: {
//     201: {
//       description: "댓글 생성 성공",
//       content: {
//         "application/json": {
//           schema: CommonSchemas.SuccessResponseSchema(
//             CommunitySchemas.CommentResponseSchema
//           ),
//         },
//       },
//     },
//     401: {
//       description: "인증되지 않은 사용자",
//       content: {
//         "application/json": {
//           schema: CommonSchemas.UnauthorizedResponse,
//         },
//       },
//     },
//     404: {
//       description: "게시글을 찾을 수 없음",
//       content: {
//         "application/json": {
//           schema: CommonSchemas.NotFoundResponse,
//         },
//       },
//     },
//   },
//   tags: ["Community"],
// });

// authenticatedApi.openapi(createPostCommentRoute, async (c) => {
//   const { id } = c.req.valid("param");
//   const post = await CommunityServices.createPostCommentService(id);
//   return c.json(
//     {
//       success: true,
//       message: "Post comment created successfully",
//       data: post,
//     },
//     201
//   );
// });

// /**
//  * @method DELETE
//  * @path /posts/{id}/comments/{commentId}
//  * @summary 커뮤니티 게시글 댓글 삭제
//  */
// const deletePostCommentRoute = createRoute({
//   method: "delete",
//   path: "/posts/{id}/comments/{commentId}",
//   summary: "게시글 댓글 삭제",
//   request: {
//     params: CommunitySchemas.PostIdParamSchema,
//   },
//   responses: {
//     200: {
//       description: "댓글 삭제 성공",
//       content: {
//         "application/json": {
//           schema: CommonSchemas.SuccessResponseSchema(
//             CommunitySchemas.CommentResponseSchema
//           ),
//         },
//       },
//     },
//     401: {
//       description: "인증되지 않은 사용자",
//       content: {
//         "application/json": {
//           schema: CommonSchemas.UnauthorizedResponse,
//         },
//       },
//     },
//     404: {
//       description: "게시글을 찾을 수 없음",
//       content: {
//         "application/json": {
//           schema: CommonSchemas.NotFoundResponse,
//         },
//       },
//     },
//   },
//   tags: ["Community"],
// });

// authenticatedApi.openapi(deletePostCommentRoute, async (c) => {
//   const { id, commentId } = c.req.valid("param");
//   const post = await CommunityServices.deletePostCommentService(id, commentId);
//   return c.json(
//     {
//       success: true,
//       message: "Post comment deleted successfully",
//       data: post,
//     },
//     200
//   );
// });

// /**
//  * @method PUT
//  * @path /posts/{id}/comments/{commentId}
//  * @summary 커뮤니티 게시글 댓글 수정
//  */
// const updatePostCommentRoute = createRoute({
//   method: "put",
//   path: "/posts/{id}/comments/{commentId}",
//   summary: "게시글 댓글 수정",
//   request: {
//     params: CommunitySchemas.PostIdParamSchema,
//   },
//   responses: {
//     200: {
//       description: "댓글 수정 성공",
//       content: {
//         "application/json": {
//           schema: CommonSchemas.SuccessResponseSchema(
//             CommunitySchemas.CommentResponseSchema
//           ),
//         },
//       },
//     },
//     401: {
//       description: "인증되지 않은 사용자",
//       content: {
//         "application/json": {
//           schema: CommonSchemas.UnauthorizedResponse,
//         },
//       },
//     },
//     404: {
//       description: "게시글을 찾을 수 없음",
//       content: {
//         "application/json": {
//           schema: CommonSchemas.NotFoundResponse,
//         },
//       },
//     },
//   },
//   tags: ["Community"],
// });

// authenticatedApi.openapi(updatePostCommentRoute, async (c) => {
//   const { id, commentId } = c.req.valid("param");
//   const post = await CommunityServices.updatePostCommentService(id, commentId);
//   return c.json(
//     {
//       success: true,
//       message: "Post comment updated successfully",
//       data: post,
//     },
//     200
//   );
// });

communityApi.route("/", authenticatedApi);

export default communityApi;
