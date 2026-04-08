import { prisma } from "@/server/prisma";
import {
  ServiceResult,
  serviceSuccess,
  serviceInternalError,
} from "@/server/result";
import { checkResourceExists } from "../../repositories/base.repository";

export async function toggleLikeService(
  reviewId: string,
  userId: string
): Promise<ServiceResult<{ liked: boolean }>> {
  try {
    const [reviewCheck, userCheck] = await Promise.all([
      checkResourceExists("review", reviewId, "리뷰"),
      checkResourceExists("user", userId, "사용자"),
    ]);
    if (!reviewCheck.success) return reviewCheck;
    if (!userCheck.success) return userCheck;

    const like = await prisma.reviewLike.findUnique({
      where: { review_likes_user_id_review_id_key: { reviewId, userId } },
    });

    if (like) {
      await prisma.reviewLike.delete({ where: { id: like.id } });
      return serviceSuccess({ liked: false });
    } else {
      await prisma.reviewLike.create({ data: { reviewId, userId } });
      return serviceSuccess({ liked: true });
    }
  } catch (error) {
    return serviceInternalError(error);
  }
}
