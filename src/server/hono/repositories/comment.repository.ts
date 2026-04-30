import { Prisma } from "@prisma/client";
import { authorSelect } from "./user.repository";

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

export type CommentWithReplies = Prisma.CommentGetPayload<{
  include: typeof commentIncludeArgs;
}>;
