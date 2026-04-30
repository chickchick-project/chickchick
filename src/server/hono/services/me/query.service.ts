import { prisma } from "@/server/prisma";
import {
  ServiceResult,
  serviceSuccess,
  serviceInternalError,
  serviceNotFound,
} from "@/server/result";
import { ApiMyProfileResponse } from "../../schemas/me.schema";
import { PaginatedResponse } from "../../schemas/common.schema";
import {
  BasePerfume,
  perfumeBaseInclude,
} from "../../repositories/perfume.repository";
import {
  BasePost,
  postIncludeArgs,
} from "../../repositories/community.repository";
import {
  FullReview,
  reviewIncludeArgs,
} from "../../repositories/review.repository";
import {
  MyCollection,
  MyComment,
  myCommentInclude,
} from "../../repositories/user.repository";
import { calculateLevel, getPointsForNextLevel } from "@/shared/utils/level.utils";

/**
 * 인증된 사용자가 북마크한 게시글 목록을 조회합니다.
 */
export async function getMyBookmarkedPostsService(
  userId: string
): Promise<ServiceResult<BasePost[]>> {
  try {
    const bookmarks = await prisma.postBookmark.findMany({
      where: { userId },
      include: { post: { include: postIncludeArgs } },
      orderBy: { createdAt: "desc" },
    });

    const posts = bookmarks.map((b) => b.post);
    return serviceSuccess(posts);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 인증된 사용자가 최근 본 향수 목록을 조회합니다.
 */
export async function getRecentPerfumesService(userId: string): Promise<
  ServiceResult<{
    items: Array<{ id: string; viewedAt: Date; perfume: BasePerfume }>;
  }>
> {
  try {
    const views = await prisma.recentPerfumeView.findMany({
      where: { userId },
      orderBy: { viewedAt: "desc" },
      include: { perfume: { include: perfumeBaseInclude } },
    });

    const items = views.map((v) => ({
      id: v.perfumeId,
      viewedAt: v.viewedAt,
      perfume: v.perfume as unknown as BasePerfume,
    }));

    return serviceSuccess({ items });
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 인증된 사용자가 최근 본 게시글 목록을 조회합니다.
 */
export async function getRecentPostsService(userId: string): Promise<
  ServiceResult<{
    items: Array<{ id: string; viewedAt: Date; post: BasePost }>;
  }>
> {
  try {
    const views = await prisma.recentPostView.findMany({
      where: { userId },
      orderBy: { viewedAt: "desc" },
      include: { post: { include: postIncludeArgs } },
    });

    const items = views.map((v) => ({
      id: v.postId,
      viewedAt: v.viewedAt,
      post: v.post as unknown as BasePost,
    }));

    return serviceSuccess({ items });
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 인증된 사용자가 북마크한 향수 목록을 조회합니다.
 */
export async function getMyBookmarkedPerfumesService(
  userId: string
): Promise<ServiceResult<BasePerfume[]>> {
  try {
    const bookmarks = await prisma.perfumeBookmark.findMany({
      where: { userId },
      include: { perfume: { include: perfumeBaseInclude } },
      orderBy: { createdAt: "desc" },
    });

    const perfumes = bookmarks.map((b) => b.perfume);
    return serviceSuccess(perfumes);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 사용자가 작성한 리뷰 목록을 조회합니다.
 */
export async function getMyReviewsService(
  userId: string,
  options: { limit?: number; cursor?: string }
): Promise<ServiceResult<PaginatedResponse<FullReview>>> {
  try {
    const { limit = 12, cursor } = options;
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: { authorId: userId },
        include: reviewIncludeArgs,
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      }),
      prisma.review.count({ where: { authorId: userId } }),
    ]);

    const hasMore = reviews.length > limit;
    const data = hasMore ? reviews.slice(0, limit) : reviews;
    const nextCursor = hasMore ? data[data.length - 1].id : null;

    return serviceSuccess({ data, totalCount, nextCursor });
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 사용자의 작성한 게시글 목록을 조회합니다.
 */
export async function getMyPostsService(
  userId: string,
  options: { limit?: number; cursor?: string }
): Promise<ServiceResult<PaginatedResponse<BasePost>>> {
  try {
    const { limit = 12, cursor } = options;
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: { userId },
        include: postIncludeArgs,
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      }),
      prisma.post.count({ where: { userId } }),
    ]);

    const hasMore = posts.length > limit;
    const data = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore ? data[data.length - 1].id : null;

    return serviceSuccess({ data, totalCount, nextCursor });
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 사용자의 작성한 댓글 목록을 조회합니다.
 */
export async function getMyCommentsService(
  userId: string,
  options: { limit?: number; cursor?: string }
): Promise<ServiceResult<PaginatedResponse<MyComment>>> {
  try {
    const { limit = 12, cursor } = options;
    const [comments, totalCount] = await Promise.all([
      prisma.comment.findMany({
        where: { authorId: userId },
        include: myCommentInclude,
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      }),
      prisma.comment.count({ where: { authorId: userId } }),
    ]);

    const hasMore = comments.length > limit;
    const data = hasMore ? comments.slice(0, limit) : comments;
    const nextCursor = hasMore ? data[data.length - 1].id : null;

    return serviceSuccess({ data, totalCount, nextCursor });
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 사용자가 좋아요한 향수 목록을 조회합니다.
 */
export async function getMyLikedPerfumesService(
  userId: string
): Promise<ServiceResult<BasePerfume[]>> {
  try {
    const likes = await prisma.perfumeLike.findMany({
      where: { userId },
      include: { perfume: { include: perfumeBaseInclude } },
      orderBy: { createdAt: "desc" },
    });
    return serviceSuccess(likes.map((like) => like.perfume));
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 사용자가 좋아요한 게시글 목록을 조회합니다.
 */
export async function getMyLikedPostsService(
  userId: string
): Promise<ServiceResult<BasePost[]>> {
  try {
    const likes = await prisma.postLike.findMany({
      where: { userId },
      include: { post: { include: postIncludeArgs } },
      orderBy: { createdAt: "desc" },
    });
    return serviceSuccess(likes.map((like) => like.post));
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 내 프로필 정보를 조회합니다.
 */
export async function getMyProfileService(
  id: string
): Promise<ServiceResult<ApiMyProfileResponse>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        nickname: true,
        age: true,
        gender: true,
        imageUrl: true,
        totalPoints: true,
        consecutiveLoginDays: true,
      },
    });

    if (!user) {
      return serviceNotFound("사용자를 찾을 수 없습니다.");
    }

    const level = calculateLevel(user.totalPoints);
    const nextLevelPoints = getPointsForNextLevel(user.totalPoints);

    return serviceSuccess({
      ...user,
      level,
      nextLevelPoints,
    });
  } catch (error) {
    return serviceInternalError(error);
  }
}

export type { MyComment, MyCollection };
