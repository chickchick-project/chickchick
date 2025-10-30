import { Prisma } from "@prisma/client";

export const brandSelect = {
  nameEn: true,
  nameKo: true,
  brandUrl: true,
} satisfies Prisma.BrandSelect;

export const authorSelect = {
  id: true,
  nickname: true,
  imageUrl: true,
} satisfies Prisma.UserSelect;

// Perfume Includes
export const perfumeBaseInclude = {
  brand: { select: brandSelect },
  perfumeImage: { select: { imageUrl: true } },
} satisfies Prisma.PerfumeInclude;

export const perfumeDetailInclude = {
  ...perfumeBaseInclude,
  accordMappings: { select: { accord: true } },
  noteMappings: { select: { note: true, noteStage: true } },
  reviews: {
    select: {
      id: true,
      content: true,
      author: { select: authorSelect },
    },
    orderBy: { createdAt: "desc" as const },
    take: 5,
  },
  _count: {
    select: { bookmarks: true, reviews: true, collectedByUsers: true },
  },
} satisfies Prisma.PerfumeInclude;

// Post Includes
export const postIncludeArgs = {
  author: {
    select: authorSelect,
  },
} satisfies Prisma.PostInclude;

export const postDetailIncludeArgs = {
  ...postIncludeArgs,
  perfumeMappings: {
    select: {
      perfume: {
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
          ...perfumeBaseInclude,
        },
      },
    },
  },
} satisfies Prisma.PostInclude;

// Review Includes
export const reviewIncludeArgs = {
  author: {
    select: authorSelect,
  },
  perfume: {
    select: {
      id: true,
      nameKo: true,
      nameEn: true,
      ...perfumeBaseInclude,
    },
  },
  attributeSelections: {
    include: {
      option: {
        include: {
          attribute: true,
        },
      },
    },
  },
} satisfies Prisma.ReviewInclude;

// Comment Includes
export const commentIncludeArgs = {
  author: {
    select: authorSelect,
  },
  replies: {
    include: {
      author: {
        select: authorSelect,
      },
    },
    orderBy: {
      createdAt: "asc" as const,
    },
  },
} satisfies Prisma.CommentInclude;

// Collection Includes
export const myCollectionInclude = {
  image: true,
} satisfies Prisma.UserCollectionInclude;

export const myCommentInclude = {
  post: { select: { id: true, title: true } },
} satisfies Prisma.CommentInclude;

export type BasePerfume = Prisma.PerfumeGetPayload<{
  include: typeof perfumeBaseInclude;
}>;

export type FullPerfume = Prisma.PerfumeGetPayload<{
  include: typeof perfumeDetailInclude;
}>;

export type UserProfile = Prisma.UserGetPayload<{
  select: typeof authorSelect;
}>;

export type BasePost = Prisma.PostGetPayload<{
  include: typeof postIncludeArgs;
}>;

export type FullPost = Prisma.PostGetPayload<{
  include: typeof postDetailIncludeArgs;
}>;

export type FullReview = Prisma.ReviewGetPayload<{
  include: typeof reviewIncludeArgs;
}>;

export type CommentWithReplies = Prisma.CommentGetPayload<{
  include: typeof commentIncludeArgs;
}>;

export type MyCollection = Prisma.UserCollectionGetPayload<{
  include: typeof myCollectionInclude;
}>;

export type MyComment = Prisma.CommentGetPayload<{
  include: typeof myCommentInclude;
}>;
