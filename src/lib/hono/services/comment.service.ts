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
  console.log(
    `[SERVICE-DEBUG] getCommentService called with postId: ${postId}`
  );

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    console.log("게시글을 찾을 수 없습니다.");
    return [];
  }

  const comments = await prisma.comment.findMany({
    where: {
      postId,
    },
    include: {
      author: {
        select: { id: true, nickname: true, imageUrl: true },
      },
    },
  });

  return comments;
};
