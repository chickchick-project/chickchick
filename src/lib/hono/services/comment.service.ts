import { prisma } from "@/lib/prisma";

export const createCommentService = async (input: {
  postId: string;
  content: string;
  parentId: string | null;
  authorId: string;
}) => {
  const { content, authorId, postId, parentId } = input;

  return prisma.$transaction(async (tx) => {
    const newComment = await tx.comment.create({
      data: {
        content,
        authorId,
        postId,
        parentId,
      },
      include: {
        author: {
          select: { id: true, nickname: true, imageUrl: true },
        },
      },
    });

    await tx.post.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } },
    });

    return newComment;
  });
};

export const getCommentService = async (postId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
      parentId: null,
    },
    include: {
      author: {
        select: { id: true, nickname: true, imageUrl: true },
      },
      replies: {
        include: {
          author: {
            select: { id: true, nickname: true, imageUrl: true },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments;
};
