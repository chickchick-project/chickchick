import { Post, PostCategory } from "@prisma/client";
import { validateUserSession } from "../userQueries";
import { prisma } from "@/lib/prisma";
export type TPostCategory = PostCategory | "";
export type TPostCreateInput = Pick<
  Post,
  "content" | "title" | "category" | "thumbnailUrl"
>;

export async function createCommunityPost(
  userId: string,
  postData: TPostCreateInput
) {
  const validation = await validateUserSession(userId);
  if (validation.errorResult) return validation.errorResult;
  try {
    const post = await prisma.post.create({
      data: { ...postData, userId },
    });
    return { post, message: "커뮤니티 글이 작성되었습니다.", success: true };
  } catch (error: any) {
    console.error(error);
    return {
      message: "커뮤니티 글 작성에 실패했습니다." + error.message,
      success: false,
    };
  }
}
