import { PostBookmark, PostCategory, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import * as CommunitySchemas from "../schemas/community.schema";

const DEFAULT_POST_LIMIT = 12;

async function fetchPaginatedPosts(params: {
  where: Prisma.PostWhereInput;
  orderBy:
    | Prisma.PostOrderByWithRelationInput
    | Prisma.PostOrderByWithRelationInput[];
  take: number;
  skip: number;
  cursor?: { id: string };
}) {
  const { where, orderBy, take, skip, cursor } = params;

  return await prisma.post.findMany({
    where,
    orderBy,
    take,
    skip,
    cursor,
    include: {
      author: {
        select: {
          id: true,
          nickname: true,
          imageUrl: true,
        },
      },
    },
  });
}

async function fetchPostCount(where: Prisma.PostWhereInput) {
  return await prisma.post.count({ where });
}

async function fetchPostById(id: string) {
  return await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: {
        select: {
          id: true,
          nickname: true,
          imageUrl: true,
        },
      },
    },
  });
}

async function createPost(postData: {
  title: string;
  content: string;
  userId: string;
  category: PostCategory;
  thumbnailUrl?: string;
}) {
  const { userId, ...restOfPostData } = postData;

  return prisma.post.create({
    data: {
      ...restOfPostData,
      userId,
    },
  });
}

export async function getPaginatedPostListService(
  params: CommunitySchemas.GetPostsQuery
): Promise<CommunitySchemas.PaginatedPostListResponse> {
  try {
    const {
      category,
      sortBy = "createdAt",
      q: search_text,
      cursor: last_seen_id,
      limit: result_limit = DEFAULT_POST_LIMIT,
    } = params;

    const sortOrder = "desc";
    const fetchLimit = result_limit + 1;

    const where: Prisma.PostWhereInput = {
      published: true,
    };
    if (category) {
      where.category = category;
    }
    if (search_text) {
      where.OR = [
        { title: { contains: search_text, mode: "insensitive" } },
        { content: { contains: search_text, mode: "insensitive" } },
      ];
    }

    const orderBy:
      | Prisma.PostOrderByWithRelationInput
      | Prisma.PostOrderByWithRelationInput[] =
      sortBy === "popular"
        ? [
            { likeCount: sortOrder },
            { commentCount: sortOrder },
            { viewCount: sortOrder },
            { createdAt: sortOrder },
          ]
        : { [sortBy]: sortOrder };

    const [rawData, total] = await Promise.all([
      fetchPaginatedPosts({
        where,
        orderBy,
        take: fetchLimit,
        skip: last_seen_id ? 1 : 0,
        cursor: last_seen_id ? { id: last_seen_id } : undefined,
      }),
      fetchPostCount(where),
    ]);

    if (!rawData || rawData.length === 0) {
      return { data: [], nextCursor: null, totalCount: 0 };
    }

    const hasMore = rawData.length > result_limit;
    const postsToReturn = hasMore ? rawData.slice(0, result_limit) : rawData;

    const nextCursor = hasMore
      ? postsToReturn[postsToReturn.length - 1].id
      : null;
    const totalCount = typeof total === "number" ? total : 0;

    return {
      data: postsToReturn,
      nextCursor,
      totalCount,
    };
  } catch (error) {
    console.error("Error in getPaginatedPostListService:", error);
    throw new Error("게시글 목록을 가져오는데 실패했습니다.");
  }
}

export async function getPostService(id: string) {
  const post = await fetchPostById(id);
  return post;
}

export async function createPostService(postData: {
  title: string;
  content: string;
  userId: string;
  category: PostCategory;
  thumbnailUrl?: string;
}) {
  const post = await createPost(postData);
  return post;
}

async function togglePostLike(postId: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    const post = await tx.post.findUnique({ where: { id: postId } });
    if (!post) {
      return null;
    }
    const postLike = await tx.postLike.findUnique({
      where: { user_post_like_unique: { postId, userId } },
    });
    if (postLike) {
      await tx.postLike.delete({
        where: { id: postLike.id },
      });
      return tx.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      });
    } else {
      await tx.postLike.create({
        data: { postId, userId },
      });
      return tx.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      });
    }
  });
}

async function togglePostBookmark(
  postId: string,
  userId: string
): Promise<PostBookmark | null> {
  return prisma.$transaction(async (tx) => {
    const post = await tx.post.findUnique({ where: { id: postId } });
    if (!post) {
      return null;
    }

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
}

export async function likePostService(postId: string, userId: string) {
  try {
    const updatedPost = await togglePostLike(postId, userId);
    if (!updatedPost) {
      return null;
    }
    return updatedPost;
  } catch (error) {
    console.error("Error in likePostService:", error);
    throw new Error("게시글 좋아요를 추가하는데 실패했습니다.");
  }
}

export async function bookmarkPostService(postId: string, userId: string) {
  try {
    const updatedPost = await togglePostBookmark(postId, userId);
    if (!updatedPost) {
      return null;
    }
    return updatedPost;
  } catch (error) {
    console.error("Error in bookmarkPostService:", error);
    throw new Error("게시글 북마크를 추가하는데 실패했습니다.");
  }
}

export async function getBookmarkedPostService(userId: string) {
  return await prisma.postBookmark.findMany({
    where: { userId },
    include: {
      post: true,
    },
  });
}
