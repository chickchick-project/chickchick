import { z } from "@hono/zod-openapi";
import { prisma } from "@/lib/prisma";
import type { PostCategory, Prisma } from "@prisma/client";
import PostScalarFieldEnumSchema from "@zod/inputTypeSchemas/PostScalarFieldEnumSchema";
import { GetPostsQuerySchema } from "../schemas/community.schema";

type OrderablePostFields = z.infer<typeof PostScalarFieldEnumSchema>;
type GetPostsParams = z.infer<typeof GetPostsQuerySchema>;

async function fetchPosts({
  searchInput,
  order,
  skip,
  take,
  category,
}: {
  searchInput: string;
  order: OrderablePostFields;
  skip: number;
  take: number;
  category?: PostCategory;
}) {
  const where: Prisma.PostWhereInput =
    searchInput && searchInput.trim() !== ""
      ? {
          AND: [
            {
              OR: [
                { title: { contains: searchInput, mode: "insensitive" } },
                { content: { contains: searchInput, mode: "insensitive" } },
              ],
            },
            ...(category ? [{ category }] : []),
          ],
        }
      : category
      ? { category }
      : {};

  return prisma.post.findMany({
    where,
    orderBy: {
      [order]: "desc",
    },
    skip,
    take,
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

async function fetchPostById(id: string) {
  return prisma.post.findUnique({
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

export async function getPostsService(params: GetPostsParams) {
  const { page, limit, searchInput, category } = params;
  const skip = (page - 1) * limit;
  const take = limit;
  const order: OrderablePostFields = "createdAt";
  const posts = await fetchPosts({
    searchInput: searchInput ?? "",
    order,
    skip,
    take,
    category,
  });
  return posts;
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
