import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
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
  serviceInternalError,
  ServiceResult,
  serviceSuccess,
  serviceNotFound,
  serviceBadRequest,
  serviceForbidden,
} from "../utils/service.utils";
import { checkResourceExists, validateUuid } from "../utils/service.utils";

// --- Prisma 쿼리 인자 및 타입 정의 ---
const postIncludeArgs = {
  author: {
    select: { id: true, nickname: true, imageUrl: true },
  },
} satisfies Prisma.PostInclude;

const postWithAuthorArgs = { include: postIncludeArgs };

export type PostWithAuthor = Prisma.PostGetPayload<typeof postWithAuthorArgs>;

const postDetailIncludeArgs = {
  ...postIncludeArgs,
  perfumeMappings: {
    select: {
      perfume: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          brand: { select: { nameEn: true, nameKo: true } },
          perfumeImage: { select: { imageUrl: true } },
        },
      },
    },
  },
} satisfies Prisma.PostInclude;

export type BasePost = Prisma.PostGetPayload<{
  include: typeof postIncludeArgs;
}>;
export type FullPost = Prisma.PostGetPayload<{
  include: typeof postDetailIncludeArgs;
}>;

// --- 서비스 함수들 ---
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

    // const transformedPosts = posts.map((post) => ({
    //   //논의 필요
    //   ...post,
    //   createdAt: post.createdAt.toISOString(),
    //   updatedAt: post.updatedAt?.toISOString() || null,
    // }));
    // const paginatedResult = createCursorPaginationResult(
    //   transformedPosts,
    //   totalCount,
    //   limit
    // );
    // return serviceSuccess({
    //   data: paginatedResult.data,
    //   totalCount: paginatedResult.totalCount,
    //   nextCursor: paginatedResult.nextCursor,
    // });
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

export async function getPostByIdService(
  id: string,
  userId?: string | null
): Promise<ServiceResult<ApiPostDetailResponse>> {
  try {
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
    const { perfumeMappings, ...restOfPost } = post;
    const perfumes = perfumeMappings.map((mapping) => {
      const perfumeImage = mapping.perfume.perfumeImage
        ? { imageUrl: mapping.perfume.perfumeImage.imageUrl }
        : null;

      return {
        ...mapping.perfume,
        perfumeImage,
      };
    });
    const isAuthor = post.userId === userId;
    return serviceSuccess({ ...restOfPost, perfumes, isAuthor });
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function getPostStatusByIdService(
  postId: string,
  userId?: string | null
): Promise<ServiceResult<ApiPostStatusResponse>> {
  try {
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

export async function createPostService(
  payload: CreatePostInput & { authorId: string }
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
          ? { create: perfumeIds.map((perfumeId) => ({ perfumeId })) }
          : undefined,
      },
      include: postIncludeArgs,
    });
    return serviceSuccess(newPost);
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function updatePostService(
  postId: string,
  authorId: string,
  updateData: UpdatePostInput
): Promise<ServiceResult<BasePost>> {
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
        include: postIncludeArgs,
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
): Promise<ServiceResult<{ message: string }>> {
  try {
    const uuidValidation = validateUuid(postId, "게시글");
    if (!uuidValidation.success) return uuidValidation;

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

    return serviceSuccess({ message: "게시글을 성공적으로 삭제했습니다." });
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function togglePostLikeService(
  postId: string,
  userId: string
): Promise<ServiceResult<{ liked: boolean; likeCount: number }>> {
  try {
    const postCheck = await checkResourceExists("post", postId, "게시글");
    if (!postCheck.success) return postCheck;

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
      const [, updatedPost] = await prisma.$transaction([
        prisma.postLike.create({ data: { postId, userId } }),
        prisma.post.update({
          where: { id: postId },
          data: { likeCount: { increment: 1 } },
          select: { likeCount: true },
        }),
      ]);
      return serviceSuccess({ liked: true, likeCount: updatedPost.likeCount });
    }
  } catch (error) {
    return serviceInternalError(error);
  }
}
export async function togglePostBookmarkService(
  postId: string,
  userId: string
): Promise<ServiceResult<{ bookmarked: boolean }>> {
  try {
    const postCheck = await checkResourceExists("post", postId, "게시글");
    if (!postCheck.success) return postCheck;

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
