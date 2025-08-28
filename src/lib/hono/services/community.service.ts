import { PostBookmark, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import * as CommunitySchemas from "../schemas/community.schema";
import { createCursorPaginationResult } from "../utils/pagination";
import {
  serviceInternalError,
  ServiceResult,
  serviceSuccess,
  serviceNotFound,
  serviceBadRequest,
  serviceForbidden,
} from "../utils/serviceResult.utils";
import { checkResourceExists, validateUuid } from "../utils/service.utils";
import { ca } from "zod/v4/locales";

// --- Prisma 쿼리 인자 및 타입 정의 ---
const postIncludeArgs = {
  author: {
    select: { id: true, nickname: true, imageUrl: true },
  },
} satisfies Prisma.PostInclude;

const postWithAuthorArgs = { include: postIncludeArgs };

export type PostWithAuthor = Prisma.PostGetPayload<typeof postWithAuthorArgs>;

// --- 서비스 함수들 ---
export async function getPaginatedPostListService(
  params: CommunitySchemas.GetPostsQuery
): Promise<ServiceResult<CommunitySchemas.PaginatedPostListResponse>> {
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

    const transformedPosts = posts.map((post) => ({
      //논의 필요
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt?.toISOString() || null,
    }));
    const paginatedResult = createCursorPaginationResult(
      transformedPosts,
      totalCount,
      limit
    );
    return serviceSuccess({
      data: paginatedResult.data,
      totalCount: paginatedResult.totalCount,
      nextCursor: paginatedResult.nextCursor,
    });
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function getPostByIdService(
  id: string,
  userId?: string | null
): Promise<ServiceResult<CommunitySchemas.PostDetailResponse>> {
  try {
    const post = await prisma.$transaction(async (tx) => {
      await tx.post.update({
        where: { id },
        data: { viewCount: { increment: 1 } }, //조회수 증가로직 게시글 조회 시 1 올릴지 따로 api를 만들지 논의 필요
      });
      return tx.post.findUnique({
        where: { id },
        ...postWithAuthorArgs,
      });
    });

    if (!post) {
      return serviceNotFound("게시글을 찾을 수 없습니다.");
    }

    const isAuthor = post.userId === userId;
    const result: CommunitySchemas.PostDetailResponse = {
      ...post,
      isAuthor,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt?.toISOString() || null,
    };
    return serviceSuccess(result);
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function getPostStatusByIdService(
  postId: string,
  userId?: string | null
): Promise<ServiceResult<CommunitySchemas.PostStatusResponse>> {
  try {
    const [postCounts, like, bookmark] = await Promise.all([
      prisma.post.findUnique({
        where: { id: postId },
        select: { viewCount: true, likeCount: true, commentCount: true },
      }),

      userId
        ? prisma.postLike.findUnique({
            where: { user_post_like_unique: { postId, userId } },
          })
        : null,
      userId
        ? prisma.postBookmark.findUnique({
            where: { user_post_bookmark_unique: { postId, userId } },
          })
        : null,
    ]);

    if (!postCounts) {
      return serviceNotFound("게시글 상태 정보를 찾을 수 없습니다.");
    }

    const result: CommunitySchemas.PostStatusResponse = {
      ...postCounts,
      isLiked: !!like,
      isBookmarked: !!bookmark,
    };

    return serviceSuccess(result);
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function createPostService(
  payload: CommunitySchemas.CreatePostPayload
): Promise<ServiceResult<PostWithAuthor>> {
  const { authorId, perfumeIds, ...rest } = payload;
  try {
    const userCheck = await checkResourceExists("user", authorId, "사용자");

    if (!userCheck.success) return userCheck;

    const newPost = await prisma.post.create({
      data: {
        ...rest,
        userId: authorId,
        perfumeMappings: perfumeIds
          ? {
              create: perfumeIds.map((perfumeId) => ({
                perfume: { connect: { id: perfumeId } },
              })),
            }
          : undefined,
      },
      ...postWithAuthorArgs,
    });
    return serviceSuccess(newPost);
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function updatePostService(
  postId: string,
  authorId: string,
  updateData: CommunitySchemas.UpdatePost
): Promise<ServiceResult<PostWithAuthor>> {
  try {
    const { perfumeIds, ...postUpdateData } = updateData;
    const uuidValidation = validateUuid(postId, "게시글");
    if (!uuidValidation.success) return uuidValidation;

    const post = await prisma.post.findUnique({
      where: { id: postId, author: { id: authorId } },
    });
    if (!post) {
      return serviceNotFound("게시글을 찾을 수 없거나 수정 권한이 없습니다.");
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
        ...postWithAuthorArgs,
      });
      return post;
    });

    return serviceSuccess(updatedPost);
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function deletePostService(
  postId: string,
  authorId: string
): Promise<ServiceResult<PostWithAuthor>> {
  try {
    const uuidValidation = validateUuid(postId, "게시글");
    if (!uuidValidation.success) return uuidValidation;

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      return serviceNotFound("게시글을 찾을 수 없습니다.");
    }
    if (post.userId !== authorId) {
      return serviceForbidden("게시글 삭제 권한이 없습니다.");
    }
    if (!post.published) {
      return serviceBadRequest("이미 삭제된 게시글입니다.");
    }

    const deletedPost = await prisma.post.update({
      where: { id: postId },
      data: { published: false },
      ...postWithAuthorArgs,
    });

    return serviceSuccess(deletedPost);
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function togglePostLikeService(
  postId: string,
  userId: string
): Promise<ServiceResult<PostWithAuthor>> {
  try {
    const postCheck = await checkResourceExists("post", postId, "게시글");
    if (!postCheck.success) return postCheck;

    const updatedPost = await prisma.$transaction(async (tx) => {
      const like = await tx.postLike.findUnique({
        where: { user_post_like_unique: { postId, userId } },
      });

      if (like) {
        await tx.postLike.delete({ where: { id: like.id } });
        return tx.post.update({
          where: { id: postId },
          data: { likeCount: { decrement: 1 } },
          ...postWithAuthorArgs,
        });
      } else {
        await tx.postLike.create({ data: { postId, userId } });
        return tx.post.update({
          where: { id: postId },
          data: { likeCount: { increment: 1 } },
          ...postWithAuthorArgs,
        });
      }
    });
    return serviceSuccess(updatedPost);
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function togglePostBookmarkService(
  postId: string,
  userId: string
): Promise<ServiceResult<PostBookmark | null>> {
  try {
    const postCheck = await checkResourceExists("post", postId, "게시글");
    if (!postCheck.success) return postCheck;

    const updatedPost = await prisma.$transaction(async (tx) => {
      const bookmark = await tx.postBookmark.findUnique({
        where: { user_post_bookmark_unique: { postId, userId } },
      });

      if (bookmark) {
        // 북마크가 있으면 삭제
        return tx.postBookmark.delete({
          where: { id: bookmark.id },
        });
      } else {
        // 북마크가 없으면 생성
        return tx.postBookmark.create({
          data: { postId, userId },
        });
      }
    });
    return serviceSuccess(updatedPost);
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function getBookmarkedPostService(userId: string) {
  try {
    const bookmarkedPosts = await prisma.postBookmark.findMany({
      where: { userId },
      include: {
        post: true,
      },
    });
    return serviceSuccess(bookmarkedPosts);
  } catch (error) {
    return serviceInternalError(error);
  }
}
