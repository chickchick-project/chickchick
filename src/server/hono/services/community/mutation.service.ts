import { PostCategory, PointActivityType } from "@prisma/client";
import { prisma } from "@/server/prisma";
import type {
  CreatePostInput,
  UpdatePostInput,
} from "../../schemas/community.schema";
import {
  serviceBadRequest,
  serviceForbidden,
  serviceInternalError,
  serviceNotFound,
  ServiceResult,
  serviceSuccess,
} from "@/server/result";
import { checkResourceExists } from "../../repositories/base.repository";
import { validateUuid } from "@/shared/utils/validate.utils";
import {
  postIncludeArgs,
  BasePost,
} from "../../repositories/community.repository";
import { earnPointsService } from "../point";

const postWithAuthorArgs = { include: postIncludeArgs };

/**
 * 새 게시글을 생성합니다.
 */
export async function createPostService(
  payload: CreatePostInput & { authorId: string },
): Promise<ServiceResult<BasePost>> {
  try {
    const { authorId, perfumeIds, ...rest } = payload;
    const userCheck = await checkResourceExists("user", authorId, "사용자");
    if (!userCheck.success) return userCheck;

    const newPost = await prisma.post.create({
      data: {
        ...rest,
        userId: authorId,
        perfumeMappings: perfumeIds
          ? { create: perfumeIds.map((perfumeId) => ({ perfumeId })) }
          : undefined,
      },
      ...postWithAuthorArgs,
    });

    // 포인트 적립 (비동기, 실패해도 게시글 작성은 성공)
    earnPointsService(authorId, PointActivityType.CREATE_POST, newPost.id).catch(
      (error) => {
        console.error("[Point] Failed to earn points for post creation:", error);
      },
    );

    return serviceSuccess(newPost);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 게시글을 수정합니다.
 */
export async function updatePostService(
  postId: string,
  authorId: string,
  updateData: UpdatePostInput,
): Promise<ServiceResult<BasePost>> {
  try {
    const { perfumeIds, ...postUpdateData } = updateData;
    const [uuidValidation, userCheck] = await Promise.all([
      validateUuid(postId, "게시글"),
      checkResourceExists("user", authorId, "사용자"),
    ]);
    if (!uuidValidation.success) return uuidValidation;
    if (!userCheck.success) return userCheck;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { published: true, author: { select: { id: true } } },
    });
    if (!post) return serviceNotFound("게시글을 찾을 수 없습니다.");
    if (post.author.id !== authorId) return serviceForbidden("게시글을 수정할 권한이 없습니다.");
    if (!post.published) return serviceBadRequest("이미 삭제된 게시글은 수정할 수 없습니다.");

    const updatedPost = await prisma.$transaction(async (tx) => {
      if (perfumeIds !== undefined) {
        await tx.postPerfumeMapping.deleteMany({ where: { postId } });
      }
      return tx.post.update({
        where: { id: postId, author: { id: authorId } },
        data: {
          ...postUpdateData,
          perfumeMappings:
            perfumeIds && perfumeIds.length > 0
              ? { create: perfumeIds.map((perfumeId) => ({ perfume: { connect: { id: perfumeId } } })) }
              : undefined,
        },
        include: postIncludeArgs,
      });
    });

    return serviceSuccess(updatedPost);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 게시글을 삭제합니다 (소프트 삭제).
 */
export async function deletePostService(
  postId: string,
  authorId: string,
): Promise<ServiceResult<{ category: PostCategory }>> {
  try {
    const [uuidValidation, userCheck] = await Promise.all([
      validateUuid(postId, "게시글"),
      checkResourceExists("user", authorId, "사용자"),
    ]);
    if (!uuidValidation.success) return uuidValidation;
    if (!userCheck.success) return userCheck;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return serviceNotFound("게시글을 찾을 수 없습니다.");
    if (post.userId !== authorId) return serviceForbidden("게시글 삭제 권한이 없습니다.");
    if (!post.published) return serviceBadRequest("이미 삭제된 게시글입니다.");

    await prisma.post.update({
      where: { id: postId },
      data: { published: false },
    });

    return serviceSuccess({ category: post.category });
  } catch (error) {
    return serviceInternalError(error);
  }
}
