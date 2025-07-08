import { z } from "@hono/zod-openapi";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import PostScalarFieldEnumSchema from "@zod/inputTypeSchemas/PostScalarFieldEnumSchema";

type OrderablePostFields = z.infer<typeof PostScalarFieldEnumSchema>;

async function fetchPosts({
  searchInput,
  order,
  skip,
  take,
}: {
  searchInput: string;
  order: OrderablePostFields;
  skip: number;
  take: number;
}) {
  const where: Prisma.PostWhereInput = searchInput
    ? {
        OR: [
          {
            title: {
              contains: searchInput,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: searchInput,
              mode: "insensitive",
            },
          },
        ],
      }
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

export async function getPostsService({
  searchInput,
  order,
  skip,
  take,
}: {
  searchInput: string;
  order: OrderablePostFields;
  skip: number;
  take: number;
}) {
  const posts = await fetchPosts({ searchInput, order, skip, take });
  return posts;
}
