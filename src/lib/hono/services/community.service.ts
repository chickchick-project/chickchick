import { PostCategory, Prisma, PointActivityType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  ApiPostDetailCategoryPostResponse,
  ApiPostDetailResponse,
  ApiPostStatusResponse,
  CreatePostInput,
  GetPostsQuery,
  UpdatePostInput,
} from "../schemas/community.schema";
import {
  createCursorPaginationResult,
  PaginationResult,
} from "../utils/pagination.utils";
import {
  checkResourceExists,
  serviceBadRequest,
  serviceForbidden,
  serviceInternalError,
  serviceNotFound,
  ServiceResult,
  serviceSuccess,
  validateUuid,
} from "../utils/service.utils";
import {
  postIncludeArgs,
  postDetailIncludeArgs,
  BasePost,
} from "../utils/prisma.utils";
import { earnPointsService } from "./point.service";

const postWithAuthorArgs = { include: postIncludeArgs };

/**
 * 게시글 목록을 페이지네이션하여 조회합니다.
 * @param params - 게시글 조회 쿼리 (카테고리, 정렬, 검색어, 커서, 제한)
 */
export async function getPaginatedPostListService(
  params: GetPostsQuery
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

    const paginatedResult = createCursorPaginationResult(
      posts,
      totalCount,
      limit
    );
    return serviceSuccess(paginatedResult);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 게시글 ID로 상세 정보를 조회합니다.
 * @param id - 게시글 ID
 * @param userId - 인증된 사용자 ID (작성자 여부 확인용)
 */
export async function getPostByIdService(
  id: string,
  userId?: string | null
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

    if (!post) {
      return serviceNotFound("게시글을 찾을 수 없습니다.");
    }
    if (!post.published) {
      return serviceForbidden("이미 삭제된 게시글입니다.");
    }
    const { perfumeMappings, ...restOfPost } = post;
    const isAuthor = post.userId === userId;

    const result = {
      ...restOfPost,
      isAuthor,
      perfumes: perfumeMappings.map((mapping) => mapping.perfume),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt?.toISOString() || null,
    };

    return serviceSuccess(result);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 게시글의 조회수, 좋아요, 댓글 수 등 상태 정보를 조회합니다.
 * @param postId - 게시글 ID
 * @param userId - 인증된 사용자 ID (좋아요/북마크 여부 확인용)
 */
export async function getPostStatusByIdService(
  postId: string,
  userId?: string | null
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

    if (!postCounts) {
      return serviceNotFound("게시글 상태 정보를 찾을 수 없습니다.");
    }

    const result: ApiPostStatusResponse = {
      ...postCounts,
      isLiked: !!like,
      isBookmarked: !!bookmark,
    };

    return serviceSuccess(result);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 게시글과 같은 카테고리의 다른 게시글 목록을 조회합니다.
 * @param postId - 현재 게시글 ID
 */
export async function getPostDetailCategoryPostsService(
  postId: string
): Promise<ServiceResult<ApiPostDetailCategoryPostResponse[]>> {
  try {
    const uuidValidation = validateUuid(postId, "게시글");
    if (!uuidValidation.success) return uuidValidation;
    const currentPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, createdAt: true, category: true },
    });
    if (!currentPost) {
      return serviceNotFound("게시글을 찾을 수 없습니다.");
    }

    const { category, createdAt } = currentPost;
    const TOTAL_LIMIT = 15;
    const PREV_LIMIT_GOAL = 2;

    const prevPosts = await prisma.post.findMany({
      where: {
        category,
        published: true,
        createdAt: { gt: createdAt },
      },
      orderBy: { createdAt: "asc" },
      take: PREV_LIMIT_GOAL,
      include: { author: { select: { nickname: true } } },
    });
    const missingCount = PREV_LIMIT_GOAL - prevPosts.length;
    const nextLimitBase = TOTAL_LIMIT - PREV_LIMIT_GOAL;
    const nextPosts = await prisma.post.findMany({
      where: {
        category,
        published: true,
        createdAt: { lte: createdAt },
      },
      orderBy: { createdAt: "desc" },
      take: nextLimitBase + (missingCount > 0 ? missingCount : 0),
      include: { author: { select: { nickname: true } } },
    });
    const combinedPosts = [...prevPosts.reverse(), ...nextPosts];

    const result: ApiPostDetailCategoryPostResponse[] = combinedPosts.map(
      (post) => ({
        id: post.id,
        title: post.title,
        commentCount: post.commentCount,
        createdAt: post.createdAt,
        author: {
          id: post.userId,
          nickname: post.author.nickname,
        },
      })
    );
    return serviceSuccess(result);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 새 게시글을 생성합니다.
 * @param payload - 게시글 생성 데이터 (작성자 ID 포함)
 */
export async function createPostService(
  payload: CreatePostInput & { authorId: string }
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
      include: postIncludeArgs,
    });

    // 포인트 적립 (비동기, 실패해도 게시글 작성은 성공)
    earnPointsService(
      authorId,
      PointActivityType.CREATE_POST,
      newPost.id
    ).catch((error) => {
      console.error("[Point] Failed to earn points for post creation:", error);
    });

    return serviceSuccess(newPost);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 게시글을 수정합니다.
 * @param postId - 수정할 게시글 ID
 * @param authorId - 작성자 ID (권한 확인용)
 * @param updateData - 수정할 데이터
 */
export async function updatePostService(
  postId: string,
  authorId: string,
  updateData: UpdatePostInput
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
    if (!post) {
      return serviceNotFound("게시글을 찾을 수 없습니다.");
    }
    if (post.author.id !== authorId) {
      return serviceForbidden("게시글을 수정할 권한이 없습니다.");
    }
    if (!post.published) {
      return serviceBadRequest("이미 삭제된 게시글은 수정할 수 없습니다.");
    }

    const updatedPost = await prisma.$transaction(async (tx) => {
      if (perfumeIds !== undefined) {
        await tx.postPerfumeMapping.deleteMany({ where: { postId } });
      }

      const post = await tx.post.update({
        where: { id: postId, author: { id: authorId } },
        data: {
          ...postUpdateData,
          perfumeMappings:
            perfumeIds && perfumeIds.length > 0
              ? {
                  create: perfumeIds.map((perfumeId) => ({
                    perfume: { connect: { id: perfumeId } },
                  })),
                }
              : undefined,
        },
        include: postIncludeArgs,
      });
      return post;
    });

    return serviceSuccess(updatedPost);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 게시글을 삭제합니다 (소프트 삭제).
 * @param postId - 삭제할 게시글 ID
 * @param authorId - 작성자 ID (권한 확인용)
 */
export async function deletePostService(
  postId: string,
  authorId: string
): Promise<ServiceResult<{ category: PostCategory }>> {
  try {
    const [uuidValidation, userCheck] = await Promise.all([
      validateUuid(postId, "게시글"),
      checkResourceExists("user", authorId, "사용자"),
    ]);
    if (!uuidValidation.success) return uuidValidation;
    if (!userCheck.success) return userCheck;

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) return serviceNotFound("게시글을 찾을 수 없습니다.");
    if (post.userId !== authorId)
      return serviceForbidden("게시글 삭제 권한이 없습니다.");
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

/**
 * 게시글 좋아요를 토글합니다.
 * @param postId - 게시글 ID
 * @param userId - 사용자 ID
 */
export async function togglePostLikeService(
  postId: string,
  userId: string
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

    if (!post) {
      return serviceNotFound("게시글을 찾을 수 없습니다.");
    }
    if (!post.published) {
      return serviceForbidden("이미 삭제된 게시글입니다.");
    }

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
      earnPointsService(
        post.userId, // 좋아요를 누른 사람(userId)이 아닌, 글 작성자(post.userId)에게 포인트 지급
        PointActivityType.LIKE_POST,
        createdLike.id
      ).catch((error) => {
        console.error("[Point] Failed to earn points for post like:", error);
      });

      return serviceSuccess({ liked: true, likeCount: updatedPost.likeCount });
    }
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 게시글 북마크를 토글합니다.
 * @param postId - 게시글 ID
 * @param userId - 사용자 ID
 */
export async function togglePostBookmarkService(
  postId: string,
  userId: string
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

    if (!post) {
      return serviceNotFound("게시글을 찾을 수 없습니다.");
    }
    if (!post.published) {
      return serviceForbidden("이미 삭제된 게시글입니다.");
    }

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

// export async function getBookmarkedPostService(userId: string) {
//   try {
//     const bookmarkedPosts = await prisma.postBookmark.findMany({
//       where: { userId },
//       include: {
//         post: true,
//       },
//     });
//     return serviceSuccess(bookmarkedPosts);
//   } catch (error) {
//     return serviceInternalError(error);
//   }
// }
