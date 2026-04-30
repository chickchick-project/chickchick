import { Prisma } from "@prisma/client";
import { brandSelect } from "./brand.repository";
import { authorSelect } from "./user.repository";

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

export type BasePerfume = Prisma.PerfumeGetPayload<{
  include: typeof perfumeBaseInclude;
}>;

export type FullPerfume = Prisma.PerfumeGetPayload<{
  include: typeof perfumeDetailInclude;
}>;
