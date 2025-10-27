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

// Brand Includes
export const brandSimpleSelect = {
  nameEn: true,
  nameKo: true,
} satisfies Prisma.BrandSelect;

export const brandDetailSelect = {
  id: true,
  nameEn: true,
  nameKo: true,
  description: true,
  imageUrl: true,
  brandUrl: true,
  mapLocation: true,
} satisfies Prisma.BrandSelect;

export const brandWithPerfumesInclude = {
  perfumes: {
    include: perfumeBaseInclude,
    orderBy: { nameKo: "asc" as const },
  },
} satisfies Prisma.BrandInclude;

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

// Brand Types
export type SimpleBrand = Prisma.BrandGetPayload<{
  select: typeof brandSimpleSelect;
}>;

export type DetailBrand = Prisma.BrandGetPayload<{
  select: typeof brandDetailSelect;
}>;

export type BrandWithPerfumes = Prisma.BrandGetPayload<{
  include: typeof brandWithPerfumesInclude;
}>;

// ==================== Type Transform Utilities ====================

/**
 * Prisma JsonValue를 MapLocation으로 변환
 * - 유효한 형식이면 { latitude, longitude } 반환
 * - 유효하지 않으면 null 반환
 */
export function parseMapLocation(
  value: Prisma.JsonValue
): { latitude: number; longitude: number } | null {
  if (value === null) return null;

  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;

    if (
      typeof obj.latitude === "number" &&
      typeof obj.longitude === "number"
    ) {
      return {
        latitude: obj.latitude,
        longitude: obj.longitude,
      };
    }
  }

  console.warn("Invalid mapLocation format:", value);
  return null;
}
