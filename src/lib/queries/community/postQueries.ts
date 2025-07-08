import { Post, PostCategory, Prisma } from "@prisma/client";
// import { validateUserSession } from "../userQueries";
import { prisma } from "@/lib/prisma";
import { TPostFormData } from "@/components/domains/post/form/postSchema";

export type TPostCategory = PostCategory;

export type TPostDetail = Omit<
  Post,
  "bookmarks" | "userId" | "createdAt" | "updatedAt"
> & {
  author: {
    id: string;
    nickname: string;
    imageUrl: string | null;
  };
  isAuthor: boolean;
  isLiked: boolean;
  bookmarkInfo: {
    isBookmarked: boolean;
    id: string | null;
  };
  createdAt: string;
  updatedAt: string | null;
};

export async function createCommunityPost(
  userId: string,
  postData: TPostFormData
) {
  // const validation = await validateUserSession(userId);
  // if (validation.errorResult) return validation.errorResult;
  try {
    const post = await prisma.post.create({
      data: { ...postData, userId },
    });
    return { post, message: "커뮤니티 글이 작성되었습니다.", success: true };
  } catch (error) {
    console.error(error);
    return {
      message: "커뮤니티 글 작성에 실패했습니다.",
      success: false,
    };
  }
}

export async function getPostDetailByIdService(
  userId: string | null,
  postId: string
): Promise<TPostDetail | null> {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const post = await tx.post.update({
        where: { id: postId },
        data: { viewCount: { increment: 1 } },
        include: {
          author: { select: { id: true, nickname: true, imageUrl: true } },
          bookmarks: {
            where: { userId: userId ?? undefined },
          },
        },
      });

      const likeActivity = userId
        ? await tx.userActivity.findFirst({
            where: {
              userId: userId,
              targetId: postId,
              targetType: "POST",
              action: "LIKED",
            },
          })
        : null;

      return { post, likeActivity };
    });
    if (!result || !result.post) {
      return null;
    }
    const { post, likeActivity } = result;
    const { bookmarks, userId: postUserId, ...postData } = post;
    const isBookmarked = bookmarks.length > 0;
    const isAuthor = userId === post.author.id;

    return {
      ...postData,
      isAuthor,
      isLiked: !!likeActivity,
      bookmarkInfo: {
        isBookmarked,
        id: isBookmarked ? bookmarks[0].id : null,
      },
      createdAt: postData.createdAt.toISOString(),
      updatedAt: postData.updatedAt ? postData.updatedAt.toISOString() : null,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      console.error(`게시글(id: ${postId})을 찾을 수 없습니다.`);
      return null;
    } else {
      console.error("에러:", error);
      throw new Error("게시글을 가져오는데 실패했습니다.");
    }
  }
}
