import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { checkResourceExists } from "../utils/service.utils";
import {
  serviceInternalError,
  ServiceResult,
  serviceSuccess,
} from "../utils/serviceResult.utils";
import {
  CreateCommentPayload,
  GetCommentQuery,
  PaginatedCommentResponse,
} from "../schemas/comment.schema";
import { createCursorPaginationResult } from "../utils/pagination";

const commentIncludeArgs = {
  author: {
    select: { id: true, nickname: true, imageUrl: true },
  },
  replies: {
    include: {
      author: {
        select: { id: true, nickname: true, imageUrl: true },
      },
    },
    orderBy: {
      createdAt: "asc" as const,
    },
  },
} satisfies Prisma.CommentInclude;

const commentWithRepliesArgs = { include: commentIncludeArgs };

export type CommentWithReplies = Prisma.CommentGetPayload<
  typeof commentWithRepliesArgs
>;

/**
 * 특정 게시글의 모든 댓글과 대댓글을 계층적으로 조회합니다.
 * @param postId - 댓글을 조회할 게시글의 ID
 */
export const getCommentService = async (
  postId: string
): Promise<ServiceResult<CommentWithReplies[]>> => {
  try {
    const postCheck = await checkResourceExists("post", postId, "게시글");
    if (!postCheck.success) return postCheck;

    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null,
      },
      ...commentWithRepliesArgs,
      orderBy: {
        createdAt: "desc",
      },
    });

    return serviceSuccess(comments);
  } catch (error) {
    return serviceInternalError(error);
  }
};

/**
 * 특정 게시글의 모든 댓글과 대댓글을 커서 기반 페이지네이션으로 조회합니다.
 * @param postId - 댓글을 조회할 게시글의 ID
 * @param cursor - 페이지네이션 커서
 * @param limit - 페이지당 댓글 수
 */
export const getPaginatedCommentService = async (
  params: GetCommentQuery
): Promise<ServiceResult<PaginatedCommentResponse>> => {
  try {
    const { postId, cursor, limit } = params;
    const postCheck = await checkResourceExists("post", postId, "게시글");
    if (!postCheck.success) return postCheck;

    const where: Prisma.CommentWhereInput = {
      postId,
      parentId: null,
    };

    const [comments, totalCount] = await Promise.all([
      prisma.comment.findMany({
        where,
        ...commentWithRepliesArgs,
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
      }),
      prisma.comment.count({ where }),
    ]);

    const paginatedResult = createCursorPaginationResult(
      comments,
      totalCount,
      limit
    );

    const formattedData = paginatedResult.data.map((comment) => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt?.toISOString() || null,
      replies: comment.replies.map((reply) => ({
        ...reply,
        createdAt: reply.createdAt.toISOString(),
        updatedAt: reply.updatedAt?.toISOString() || null,
      })),
    }));

    return serviceSuccess({
      data: formattedData,
      totalCount: paginatedResult.totalCount,
      nextCursor: paginatedResult.nextCursor,
    });
  } catch (error) {
    return serviceInternalError(error);
  }
};

/**
 * 새로운 댓글 또는 대댓글을 생성합니다.
 * @param payload - 댓글 생성에 필요한 완전한 데이터
 */
export const createCommentService = async (
  payload: CreateCommentPayload
): Promise<ServiceResult<CommentWithReplies>> => {
  try {
    const { authorId, postId, parentId } = payload;

    const checks = await Promise.all([
      checkResourceExists("post", postId, "게시글"),
      checkResourceExists("user", authorId, "사용자"),
      parentId
        ? checkResourceExists("comment", parentId, "부모 댓글")
        : Promise.resolve(serviceSuccess(true)),
    ]);

    for (const check of checks) {
      if (!check.success) return check;
    }

    const newComment = await prisma.$transaction(async (tx) => {
      const createdComment = await tx.comment.create({
        data: payload,
        ...commentWithRepliesArgs,
      });

      await tx.post.update({
        where: { id: postId },
        data: { commentCount: { increment: 1 } },
      });

      return createdComment;
    });

    return serviceSuccess(newComment);
  } catch (error) {
    return serviceInternalError(error);
  }
};
