// import { Prisma } from "@prisma/client";
// import { prisma } from "@/lib/prisma";
// import { GetPostsQuery, PostListResponse } from "../schemas/community.schema";

// const DEFAULT_POST_LIMIT = 12;

// export const getPaginatedPostListService = async (
//   params: GetPostsQuery,
// ): Promise<PostListResponse> => {
//   try {
//     const {
//       category,
//       sortBy = "createdAt",
//       q: search_text,
//       cursor: last_seen_id,
//       limit: result_limit = DEFAULT_POST_LIMIT,
//     } = params;

//     const sortOrder = "desc";
//     const fetchLimit = result_limit + 1;

//     const where: Prisma.PostWhereInput = {
//       published: true,
//     };
//     if (category) {
//       where.category = category;
//     }
//     if (search_text) {
//       where.OR = [
//         { title: { contains: search_text, mode: "insensitive" } },
//         { content: { contains: search_text, mode: "insensitive" } },
//       ];
//     }

//     const orderBy:
//       | Prisma.PostOrderByWithRelationInput
//       | Prisma.PostOrderByWithRelationInput[] =
//       sortBy === "popular"
//         ? [
//             { likeCount: sortOrder },
//             { commentCount: sortOrder },
//             { viewCount: sortOrder },
//             { createdAt: sortOrder },
//           ]
//         : { [sortBy]: sortOrder };

//     const [rawData, total] = await Promise.all([
//       prisma.post.findMany({
//         where,
//         orderBy,
//         take: fetchLimit,
//         skip: last_seen_id ? 1 : 0,
//         cursor: last_seen_id ? { id: last_seen_id } : undefined,
//         include: {
//           author: { select: { nickname: true, imageUrl: true } },
//         },
//       }),
//       prisma.post.count({ where }),
//     ]);

//     if (!rawData || rawData.length === 0) {
//       return { data: [], nextCursor: null, totalCount: 0 };
//     }

//     const hasMore = rawData.length > result_limit;
//     const postsToReturn = hasMore ? rawData.slice(0, result_limit) : rawData;
//     const transformedPosts = postsToReturn.map((post) => ({
//       id: post.id,
//       category: post.category,
//       title: post.title,
//       content: post.content,
//       thumbnailUrl: post.thumbnailUrl,
//       author: post.author,
//       likeCount: post.likeCount,
//       commentCount: post.commentCount,
//       viewCount: post.viewCount,
//       createdAt: post.createdAt.toISOString(),
//     }));
//     const nextCursor = hasMore
//       ? postsToReturn[postsToReturn.length - 1].id
//       : null;
//     const totalCount = typeof total === "number" ? total : 0;

//     return {
//       data: transformedPosts,
//       nextCursor,
//       totalCount,
//     };
//   } catch (error) {
//     console.error("Error in getPaginatedPostListService:", error);
//     throw new Error("게시글 목록을 가져오는데 실패했습니다.");
//   }
// }
