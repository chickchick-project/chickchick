import { PointActivityType } from "@prisma/client";
import { prisma } from "@/server/prisma";
import {
  serviceForbidden,
  serviceInternalError,
  serviceNotFound,
  ServiceResult,
  serviceSuccess,
} from "@/server/result";
import { checkResourceExists } from "../../repositories/base.repository";
import { validateUuid } from "@/shared/utils/validate.utils";
import { earnPointsService } from "../point";

/**
 * 게시글 좋아요를 토글합니다.
 */
export async function togglePostLikeService(
  postId: string,
  userId: string,
): Promise<ServiceResult<{ liked: boolean; likeCount: number }>> {
  try {
    const [uuidValidation, userCheck] = await Promise.all([
      validateUuid(postId, "게시글"),
      checkResourceExists("user", userId, "사용자"),
    ]);
    if (!uuidValidation.success) return uuidValidation;
    if (!userCheck.success) return userCheck;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { published: true, userId: true },
    });
    if (!post) return serviceNotFound("게시글을 찾을 수 없습니다.");
    if (!post.published) return serviceForbidden("이미 삭제된 게시글입니다.");

    const like = await prisma.postLike.findUnique({
      where: { post_likes_user_id_post_id_key: { postId, userId } },
    });

    if (like) {
      const [, updatedPost] = await prisma.$transaction([
        prisma.postLike.delete({ where: { id: like.id } }),
        prisma.post.update({
          where: { id: postId },
          data: { likeCount: { decrement: 1 } },
          select: { likeCount: true },
        }),
      ]);
      return serviceSuccess({ liked: false, likeCount: updatedPost.likeCount });
    } else {
      const [createdLike, updatedPost] = await prisma.$transaction([
        prisma.postLike.create({ data: { postId, userId } }),
        prisma.post.update({
          where: { id: postId },
          data: { likeCount: { increment: 1 } },
          select: { likeCount: true },
        }),
      ]);

      // 포인트 적립: 글 작성자에게 지급 (비동기, 실패해도 좋아요는 성공)
      earnPointsService(post.userId, PointActivityType.LIKE_POST, createdLike.id).catch(
        (error) => {
          console.error("[Point] Failed to earn points for post like:", error);
        },
      );

      return serviceSuccess({ liked: true, likeCount: updatedPost.likeCount });
    }
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 게시글 북마크를 토글합니다.
 */
export async function togglePostBookmarkService(
  postId: string,
  userId: string,
): Promise<ServiceResult<{ bookmarked: boolean }>> {
  try {
    const [uuidValidation, userCheck] = await Promise.all([
      validateUuid(postId, "게시글"),
      checkResourceExists("user", userId, "사용자"),
    ]);
    if (!uuidValidation.success) return uuidValidation;
    if (!userCheck.success) return userCheck;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { published: true },
    });
    if (!post) return serviceNotFound("게시글을 찾을 수 없습니다.");
    if (!post.published) return serviceForbidden("이미 삭제된 게시글입니다.");

    const bookmark = await prisma.postBookmark.findUnique({
      where: { post_bookmarks_user_id_post_id_key: { postId, userId } },
    });

    if (bookmark) {
      await prisma.postBookmark.delete({ where: { id: bookmark.id } });
      return serviceSuccess({ bookmarked: false });
    } else {
      await prisma.postBookmark.create({ data: { postId, userId } });
      return serviceSuccess({ bookmarked: true });
    }
  } catch (error) {
    return serviceInternalError(error);
  }
}
