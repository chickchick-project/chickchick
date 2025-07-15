import { PostCategory, Prisma } from "@prisma/client";
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

export async function likePostService(postId: string, userId: string) {
  const [post, postLike] = await prisma.$transaction([
    prisma.post.findUnique({ where: { id: postId } }),
    prisma.postLike.findUnique({
      where: { user_post_like_unique: { postId, userId } },
    }),
  ]);

  if (!post) {
    return null;
  }

  if (postLike) {
    return await prisma.$transaction([
      prisma.postLike.delete({
        where: { id: postLike.id },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);
  } else {
    return await prisma.$transaction([
      prisma.postLike.create({
        data: { postId, userId },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);
  }
}
