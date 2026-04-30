import { Prisma } from "@prisma/client";

export const authorSelect = {
  id: true,
  nickname: true,
  imageUrl: true,
} satisfies Prisma.UserSelect;

export const myCollectionInclude = {
  image: true,
} satisfies Prisma.UserCollectionInclude;

export const myCommentInclude = {
  post: { select: { id: true, title: true } },
} satisfies Prisma.CommentInclude;

export type UserProfile = Prisma.UserGetPayload<{
  select: typeof authorSelect;
}>;

export type MyCollection = Prisma.UserCollectionGetPayload<{
  include: typeof myCollectionInclude;
}>;

export type MyComment = Prisma.CommentGetPayload<{
  include: typeof myCommentInclude;
}>;

export type UserCollectionWithRelations = Prisma.UserCollectionGetPayload<{
  include: { image: true; perfume: true };
}>;
