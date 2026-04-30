import { Prisma } from "@prisma/client";
import { authorSelect } from "./user.repository";
import { perfumeBaseInclude } from "./perfume.repository";

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

export type BasePost = Prisma.PostGetPayload<{
  include: typeof postIncludeArgs;
}>;

export type FullPost = Prisma.PostGetPayload<{
  include: typeof postDetailIncludeArgs;
}>;
