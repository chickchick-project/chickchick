import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppContext } from "@/lib/hono/app";
import { createRoute } from "@hono/zod-openapi";
import { authMiddleware } from "@/lib/hono/middleware/auth.middleware";
import * as CommentSchemas from "@/lib/hono/schemas/comment.schema";
import * as CommentServices from "@/lib/hono/services/comment.service";
import { createStandardApiResponses } from "@/lib/hono/utils/createStandardApiResponses";
import { getAuthenticatedUser } from "@/lib/hono/utils/service.utils";

const commentsApi = new OpenAPIHono<AppContext>();
commentsApi.use("*", authMiddleware);
/**
 * @method GET
 * @path /{postId}
 * @summary 댓글 목록 조회
 */
commentsApi.openapi(
  createRoute({
    method: "get",
    path: "/{postId}",
    summary: "댓글 목록 조회",
    request: {
      params: CommentSchemas.CommentPostIdParamSchema,
    },
    responses: createStandardApiResponses(
      {
        schema: CommentSchemas.CommentListResponseSchema,
        description: "댓글 목록",
      },
      ["404"]
    ),
    tags: ["Comment"],
  }),
  async (c) => {
    const { postId } = c.req.valid("param");
    const comments = await CommentServices.getCommentService(postId);
    if (!comments || comments.length === 0) {
      return c.json(
        {
          success: true,
          message: "댓글이 없습니다.",
          data: [],
        },
        200
      );
    }
    return c.json(
      {
        success: true,
        message: "댓글 목록을 성공적으로 불러왔습니다.",
        data: comments,
      },
      200
    );
  }
);

/**
 * @method POST
 * @path /{postId}
 * @summary 댓글 생성
 */
const createCommentRoute = createRoute({
  method: "post",
  path: "/{postId}",
  summary: "댓글 생성",
  description: "댓글 생성",
  request: {
    params: CommentSchemas.CommentPostIdParamSchema,
    body: {
      content: {
        "application/json": {
          schema: CommentSchemas.CreateCommentRequestSchema,
        },
      },
    },
  },

  responses: createStandardApiResponses(
    {
      schema: CommentSchemas.CommentResponseSchema,
      description: "댓글",
    },
    ["400", "401"]
  ),
  tags: ["Comment"],
});

commentsApi.use(createCommentRoute.getRoutingPath(), authMiddleware);

commentsApi.openapi(createCommentRoute, async (c) => {
  const user = getAuthenticatedUser(c);
  const { postId } = c.req.valid("param");
  const body = c.req.valid("json");
  try {
    const newComment = await CommentServices.createCommentService({
      postId,
      content: body.content,
      parentId: body.parentId,
      authorId: user.id,
    });

    return c.json(
      {
        success: true,
        message: "댓글을 성공적으로 생성했습니다.",
        data: newComment,
      },
      201
    );
  } catch (error: unknown) {
    console.error("Error creating comment:", error);
    if (error instanceof Error) {
      return c.json({ success: false, message: error.message }, 404);
    }
    return c.json(
      { success: false, message: "댓글 생성 중 오류가 발생했습니다." },
      500
    );
  }
});
export default commentsApi;
