import { Prisma, UserCollection } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { UserProfileResponse } from "../schemas/user.schema";
import {
  serviceInternalError,
  serviceNotFound,
  ServiceResult,
  serviceSuccess,
} from "../utils/serviceResult.utils";
import { PostWithAuthor } from "./community.service";
import { checkResourceExists } from "../utils/service.utils";
import { PerfumeBaseResponse } from "../schemas/perfume.schema";

const postIncludeArgs = {
  author: {
    select: { id: true, nickname: true, imageUrl: true },
  },
} satisfies Prisma.PostInclude;

const perfumeBaseInclude = {
  brand: { select: { nameEn: true, nameKo: true } },
  perfumeImage: { select: { imageUrl: true } },
} satisfies Prisma.PerfumeInclude;

const postWithAuthorArgs = { include: postIncludeArgs };

export async function getUserProfileService(
  userId: string
): Promise<ServiceResult<UserProfileResponse>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, nickname: true, imageUrl: true },
    });

    if (!user) {
      return serviceNotFound("사용자를 찾을 수 없습니다.");
    }
    return serviceSuccess(user);
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function getUserPostsService(
  userId: string
): Promise<ServiceResult<PostWithAuthor[]>> {
  try {
    const userCheck = await checkResourceExists("user", userId, "사용자");
    if (!userCheck.success) return userCheck;

    const posts = await prisma.post.findMany({
      where: {
        userId,
        published: true, // 공개된 게시글만
      },
      ...postWithAuthorArgs,
      orderBy: { createdAt: "desc" },
    });
    return serviceSuccess(posts);
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function getUserPublicBookmarkedPerfumesService(
  targetUserId: string
): Promise<ServiceResult<PerfumeBaseResponse[]>> {
  try {
    const userCheck = await checkResourceExists("user", targetUserId, "사용자");
    if (!userCheck.success) return userCheck;

    const bookmarks = await prisma.perfumeBookmark.findMany({
      where: {
        userId: targetUserId,
        isPublic: true, // 공개된 북마크만
      },
      include: { perfume: { include: perfumeBaseInclude } },
      orderBy: { createdAt: "desc" },
    });

    const perfumes = bookmarks.map((b) => b.perfume);
    return serviceSuccess(perfumes);
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function getUserCollectionsService(
  targetUserId: string
): Promise<ServiceResult<UserCollection[]>> {
  try {
    const userCheck = await checkResourceExists("user", targetUserId, "사용자");
    if (!userCheck.success) return userCheck;

    const collections = await prisma.userCollection.findMany({
      where: {
        userId: targetUserId,
      },
      include: {
        image: true,
      },
    });
    return serviceSuccess(collections);
  } catch (error) {
    return serviceInternalError(error);
  }
}
