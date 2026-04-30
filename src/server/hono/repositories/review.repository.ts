import { Prisma } from "@prisma/client";
import { authorSelect } from "./user.repository";
import { perfumeBaseInclude } from "./perfume.repository";

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

export type FullReview = Prisma.ReviewGetPayload<{
  include: typeof reviewIncludeArgs;
}>;
