// import { createRoute, z } from "@hono/zod-openapi";
// import {
//   GetPostsQuerySchema,
//   PostResponseSchema,
//   PostIdParamSchema,
//   CreatePostRequestSchema,
// } from "@/lib/hono/schemas/community.schema";
// import {
//   SuccessResponseSchema,
//   ErrorResponseSchema,
// } from "@/lib/hono/schemas/common.schema";

// /**
//  * @method GET
//  * @path /posts
//  * @summary 커뮤니티 게시글 목록 조회
//  */
// export const getPostsRoute = createRoute({
//   method: "get",
//   path: "/posts",
//   summary: "커뮤니티 게시글 목록 조회",
//   request: {
//     query: GetPostsQuerySchema,
//   },
//   responses: {
//     200: {
//       content: {
//         "application/json": {
//           schema: SuccessResponseSchema(z.array(PostResponseSchema)),
//         },
//       },
//       description: "게시글 목록",
//     },
//     404: {
//       content: {
//         "application/json": {
//           schema: ErrorResponseSchema,
//         },
//       },
//       description: "게시글을 찾을 수 없음",
//     },
//   },
//   tags: ["Community"],
// });

// /**
//  * @method GET
//  * @path /posts/{id}
//  * @summary 커뮤니티 게시글 조회
//  */
// export const getPostRoute = createRoute({
//   method: "get",
//   path: "/posts/{id}",
//   summary: "커뮤니티 게시글 조회",
//   description: "요청된 게시글 ID에 해당하는 단일 게시글 정보 조회",
//   request: {
//     params: PostIdParamSchema,
//   },
//   responses: {
//     200: {
//       content: {
//         "application/json": {
//           schema: SuccessResponseSchema(PostResponseSchema),
//         },
//       },
//       description: "게시글",
//     },
//     404: {
//       content: {
//         "application/json": {
//           schema: ErrorResponseSchema,
//         },
//       },
//       description: "게시글을 찾을 수 없음",
//     },
//   },
//   tags: ["Community"],
// });

// /**
//  * @method POST
//  * @path /posts
//  * @summary 커뮤니티 게시글 생성
//  */
// export const createPostRoute = createRoute({
//   method: "post",
//   path: "/posts",
//   summary: "커뮤니티 게시글 생성",
//   description: "커뮤니티 게시글 생성",
//   request: {
//     body: {
//       content: {
//         "application/json": {
//           schema: CreatePostRequestSchema,
//         },
//       },
//     },
//   },

//   responses: {
//     201: {
//       content: {
//         "application/json": {
//           schema: SuccessResponseSchema(PostResponseSchema),
//         },
//       },
//       description: "게시글 생성",
//     },
//     400: {
//       content: {
//         "application/json": {
//           schema: ErrorResponseSchema,
//         },
//       },
//       description: "잘못된 요청 데이터",
//     },
//     401: {
//       content: {
//         "application/json": {
//           schema: ErrorResponseSchema,
//         },
//       },
//       description: "인증되지 않은 사용자",
//     },
//   },
//   security: [{ BearerAuth: [] }],
//   tags: ["Community"],
// });
