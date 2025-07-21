import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { checkResourceExists } from "../utils/service.utils";
import {
  serviceInternalError,
  ServiceResult,
  serviceSuccess,
} from "../utils/serviceResult.utils";
import { CreateCommentPayload } from "../schemas/comment.schema";

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
