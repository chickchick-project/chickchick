import { Prisma } from "@prisma/client";
import { prisma } from "@/server/prisma";
import type {
  ApiPostDetailCategoryPostResponse,
  ApiPostDetailResponse,
  ApiPostStatusResponse,
  GetPostsQuery,
} from "../../schemas/community.schema";
import {
  createCursorPaginationResult,
  PaginationResult,
} from "../../utils/pagination.utils";
import {
  serviceForbidden,
  serviceInternalError,
  serviceNotFound,
  ServiceResult,
  serviceSuccess,
} from "@/server/result";
import { validateUuid } from "@/shared/utils/validate.utils";
import {
  postIncludeArgs,
  postDetailIncludeArgs,
  BasePost,
} from "../../repositories/community.repository";
import { sanitizeHtml } from "../../utils/sanitize.utils";

const postWithAuthorArgs = { include: postIncludeArgs };

/**
 * 게시글 목록을 페이지네이션하여 조회합니다.
 */
export async function getPaginatedPostListService(
  params: GetPostsQuery,
): Promise<ServiceResult<PaginationResult<BasePost>>> {
  try {
    const { category, sortBy, q, cursor, limit } = params;
    const fetchLimit = limit + 1;

    const where: Prisma.PostWhereInput = { published: true };
    if (category) where.category = category;
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { contentText: { contains: q, mode: "insensitive" } },
      ];
    }

    const orderBy:
      | Prisma.PostOrderByWithRelationInput[]
      | Prisma.PostOrderByWithRelationInput =
      sortBy === "popular"
        ? [{ likeCount: "desc" }, { createdAt: "desc" }]
        : { createdAt: "desc" };

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy,
        take: fetchLimit,
        cursor: cursor ? { id: cursor } : undefined,
        ...postWithAuthorArgs,
      }),
      prisma.post.count({ where }),
    ]);

    return serviceSuccess(createCursorPaginationResult(posts, totalCount, limit));
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 게시글 ID로 상세 정보를 조회합니다.
 */
export async function getPostByIdService(
  id: string,
  userId?: string | null,
): Promise<ServiceResult<ApiPostDetailResponse>> {
  try {
    const uuidValidation = validateUuid(id, "게시글");
    if (!uuidValidation.success) return uuidValidation;

    const post = await prisma.$transaction(async (tx) => {
      await tx.post.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
      return tx.post.findUnique({
        where: { id },
        include: postDetailIncludeArgs,
      });
    });

    if (!post) return serviceNotFound("게시글을 찾을 수 없습니다.");
    if (!post.published) return serviceForbidden("이미 삭제된 게시글입니다.");

    const { perfumeMappings, ...restOfPost } = post;

    return serviceSuccess({
      ...restOfPost,
      content: sanitizeHtml(post.content),
      isAuthor: post.userId === userId,
      perfumes: perfumeMappings.map((mapping) => mapping.perfume),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt?.toISOString() || null,
    });
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 게시글의 조회수, 좋아요, 댓글 수 등 상태 정보를 조회합니다.
 */
export async function getPostStatusByIdService(
  postId: string,
  userId?: string | null,
): Promise<ServiceResult<ApiPostStatusResponse>> {
  try {
    const uuidValidation = validateUuid(postId, "게시글");
    if (!uuidValidation.success) return uuidValidation;

    const [postCounts, like, bookmark] = await Promise.all([
      prisma.post.findUnique({
        where: { id: postId },
        select: { viewCount: true, likeCount: true, commentCount: true },
      }),
      userId
        ? prisma.postLike.findUnique({
            where: { post_likes_user_id_post_id_key: { postId, userId } },
          })
        : null,
      userId
        ? prisma.postBookmark.findUnique({
            where: { post_bookmarks_user_id_post_id_key: { postId, userId } },
          })
        : null,
    ]);

    if (!postCounts) return serviceNotFound("게시글 상태 정보를 찾을 수 없습니다.");

    return serviceSuccess({
      ...postCounts,
      isLiked: !!like,
      isBookmarked: !!bookmark,
    });
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 게시글과 같은 카테고리의 다른 게시글 목록을 조회합니다.
 */
export async function getPostDetailCategoryPostsService(
  postId: string,
): Promise<ServiceResult<ApiPostDetailCategoryPostResponse[]>> {
  try {
    const uuidValidation = validateUuid(postId, "게시글");
    if (!uuidValidation.success) return uuidValidation;

    const currentPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, createdAt: true, category: true },
    });
    if (!currentPost) return serviceNotFound("게시글을 찾을 수 없습니다.");

    const { category, createdAt } = currentPost;
    const TOTAL_LIMIT = 15;
    const PREV_LIMIT_GOAL = 2;

    const prevPosts = await prisma.post.findMany({
      where: { category, published: true, createdAt: { gt: createdAt } },
      orderBy: { createdAt: "asc" },
      take: PREV_LIMIT_GOAL,
      include: { author: { select: { nickname: true } } },
    });

    const missingCount = PREV_LIMIT_GOAL - prevPosts.length;
    const nextPosts = await prisma.post.findMany({
      where: { category, published: true, createdAt: { lte: createdAt } },
      orderBy: { createdAt: "desc" },
      take: TOTAL_LIMIT - PREV_LIMIT_GOAL + (missingCount > 0 ? missingCount : 0),
      include: { author: { select: { nickname: true } } },
    });

    const combinedPosts = [...prevPosts.reverse(), ...nextPosts];

    return serviceSuccess(
      combinedPosts.map((post) => ({
        id: post.id,
        title: post.title,
        commentCount: post.commentCount,
        createdAt: post.createdAt,
        author: { id: post.userId, nickname: post.author.nickname },
      })),
    );
  } catch (error) {
    return serviceInternalError(error);
  }
}
