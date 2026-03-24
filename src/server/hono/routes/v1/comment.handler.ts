import { createRoute } from "@hono/zod-openapi";
import * as CommentSchemas from "@/server/hono/schemas/comment.schema";
import * as CommentServices from "@/server/hono/services/comment.service";
import {
  apiInternalError,
  apiSuccess,
  apiNotFound,
  apiConflict,
  apiBadRequest,
  apiCreated,
  apiForbidden,
} from "@/server/hono/utils/api.utils";
import { createStandardApiResponses } from "@/server/hono/utils/openapi.schema";
import { createDomainRouters } from "@/server/hono/utils/router";
import { getAuthenticatedUser } from "@/server/hono/utils/service.utils";

const routers = createDomainRouters();

/**
 * @method GET
 * @path /{postId}
 * @summary 댓글 목록 조회
 * @description 게시글의 모든 댓글과 답글을 조회합니다
 */
const getCommentListRoute = createRoute({
  method: "get",
  path: "/{postId}",
  summary: "댓글 목록 조회",
  request: {
    params: CommentSchemas.PostIdParamSchema,
  },
  responses: createStandardApiResponses(
    {
      schema: CommentSchemas.CommentResponseSchema,
      description: "댓글 목록",
    },
    ["404"]
  ),
  tags: ["Comment"],
});

routers.public.openapi(getCommentListRoute, async (c) => {
  const { postId } = c.req.valid("param");
  const result = await CommentServices.getCommentService(postId);
  if (!result.success) {
    if (result.error === "NOT_FOUND") {
      return apiNotFound(c, result.message);
    }
    return apiInternalError(c, result.message);
  }
  return apiSuccess(c, result.data, "댓글 목록을 성공적으로 불러왔습니다.");
});

/**
 * @method GET
 * @path /{postId}/cursor
 * @summary 댓글 목록 조회 (커서 기반)
 * @description 커서 기반 페이지네이션을 사용하여 댓글 목록을 조회합니다
 */

const getCommentCursorRoute = createRoute({
  method: "get",
  path: "/{postId}/cursor",
  summary: "댓글 목록 조회 (커서 기반)",
  request: {
    params: CommentSchemas.PostIdParamSchema,
    query: CommentSchemas.GetCommentQuerySchema,
  },
  responses: createStandardApiResponses(
    {
      schema: CommentSchemas.PaginatedCommentResponseSchema,
      description: "댓글 목록",
    },
    ["404"]
  ),
  tags: ["Comment"],
});

routers.public.openapi(getCommentCursorRoute, async (c) => {
  const { postId } = c.req.valid("param");
  const queryParams = c.req.valid("query");
  const result = await CommentServices.getPaginatedCommentService(
    postId,
    queryParams
  );
  if (!result.success) {
    if (result.error === "NOT_FOUND") {
      return apiNotFound(c, result.message);
    }
    return apiInternalError(c, result.message);
  }
  return apiSuccess(c, result.data, "댓글 목록을 성공적으로 불러왔습니다.");
});

/**
 * @method POST
 * @path /{postId}
 * @summary 댓글 생성
 * @description 게시글에 새로운 댓글 또는 답글을 생성합니다 (인증 필요)
 */
const createCommentRoute = createRoute({
  method: "post",
  path: "/{postId}",
  summary: "댓글 생성",
  description: "게시글에 새로운 댓글 또는 답글을 생성합니다",
  request: {
    params: CommentSchemas.PostIdParamSchema,
    body: {
      content: {
        "application/json": {
          schema: CommentSchemas.CreateCommentBodySchema,
        },
      },
    },
  },

  responses: createStandardApiResponses(
    {
      schema: CommentSchemas.CommentResponseSchema,
      description: "댓글",
    },
    ["400", "401", "404", "409"]
  ),
  tags: ["Comment"],
});

routers.authenticated.openapi(createCommentRoute, async (c) => {
  const { postId } = c.req.valid("param");
  const body = c.req.valid("json");
  const user = getAuthenticatedUser(c);

  const payload: CommentSchemas.CreateCommentPayload = {
    ...body,
    postId,
    authorId: user.id,
  };

  const result = await CommentServices.createCommentService(payload);

  if (!result.success) {
    // 서비스가 반환한 에러 코드에 따라 적절한 HTTP 응답을 매핑
    switch (result.error) {
      case "NOT_FOUND":
        return apiNotFound(c, result.message);
      case "ALREADY_EXISTS":
        return apiConflict(c, result.message);
      case "FORBIDDEN":
        return apiForbidden(c, result.message);
      case "BAD_REQUEST":
        return apiBadRequest(c, result.message);
      default:
        return apiInternalError(c, result.message);
    }
  }

  return apiCreated(c, result.data, "댓글을 성공적으로 생성했습니다.");
});

/**
 * @method PATCH
 * @path /{commentId}
 * @summary 댓글 수정
 * @description 댓글 또는 답글의 내용을 수정합니다 (인증 필요)
 */
const editCommentRoute = createRoute({
  method: "patch",
  path: "/{commentId}",
  summary: "댓글 수정",
  description: "댓글 또는 대댓글의 내용을 수정합니다.",
  request: {
    params: CommentSchemas.CommentIdParamSchema,
    body: {
      content: {
        "application/json": { schema: CommentSchemas.UpdateCommentBodySchema },
      },
    },
  },
  responses: createStandardApiResponses(
    {
      schema: CommentSchemas.CommentResponseSchema,
      description: "수정된 댓글",
    },
    ["400", "401", "403", "404"]
  ),
  tags: ["Comment"],
});

routers.authenticated.openapi(editCommentRoute, async (c) => {
  const { commentId } = c.req.valid("param");
  const body = c.req.valid("json");
  const user = getAuthenticatedUser(c);
  const payload = {
    id: commentId,
    authorId: user.id,
    content: body.content,
    parentId: body.parentId,
  };
  const result = await CommentServices.updateCommentService(payload);
  if (!result.success) {
    if (result.error === "NOT_FOUND") return apiNotFound(c, result.message);
    if (result.error === "FORBIDDEN") return apiForbidden(c, result.message);
    if (result.error === "BAD_REQUEST") return apiBadRequest(c, result.message);
    return apiInternalError(c, result.message);
  }
  return apiSuccess(c, result.data, "댓글을 성공적으로 수정했습니다.");
});

/**
 * @method DELETE
 * @path /{commentId}
 * @summary 댓글 삭제
 * @description 댓글 또는 답글을 소프트 삭제합니다 (인증 필요)
 */
const deleteCommentRoute = createRoute({
  method: "delete",
  path: "/{commentId}",
  summary: "댓글 삭제 (Soft Delete)",
  description: `댓글 또는 대댓글을 삭제합니다. 댓글 내용을 "삭제된 댓글 입니다."로 변경하고, published 필드를 false로 설정합니다.`,
  request: {
    params: CommentSchemas.CommentIdParamSchema,
  },
  responses: createStandardApiResponses(
    {
      schema: CommentSchemas.DeleteCommentResponseSchema,
      description: "삭제된 댓글",
    },
    ["400", "401", "403", "404"]
  ),
  tags: ["Comment"],
});

routers.authenticated.openapi(deleteCommentRoute, async (c) => {
  const { commentId } = c.req.valid("param");
  const user = getAuthenticatedUser(c);
  const payload: CommentSchemas.DeleteCommentPayload = {
    id: commentId,
    authorId: user.id,
  };
  const result = await CommentServices.deleteCommentService(payload);
  if (!result.success) {
    if (result.error === "NOT_FOUND") return apiNotFound(c, result.message);
    if (result.error === "FORBIDDEN") return apiForbidden(c, result.message);
    if (result.error === "BAD_REQUEST") return apiBadRequest(c, result.message);
    return apiInternalError(c, result.message);
  }
  return apiSuccess(c, result.data, "댓글을 성공적으로 삭제했습니다.");
});

export default routers.merge();
