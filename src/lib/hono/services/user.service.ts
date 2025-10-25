import { UserCollection } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  serviceInternalError,
  serviceNotFound,
  ServiceResult,
  serviceSuccess,
} from "../utils/service.utils";
import { checkResourceExists } from "../utils/service.utils";
import {
  BasePost,
  BasePerfume,
  UserProfile,
  authorSelect,
  perfumeBaseInclude,
} from "../utils/prisma.utils";

export async function getUserProfileService(
  userId: string
): Promise<ServiceResult<UserProfile>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: authorSelect,
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
): Promise<ServiceResult<BasePost[]>> {
  try {
    const userCheck = await checkResourceExists("user", userId, "사용자");
    if (!userCheck.success) return userCheck;

    const posts = await prisma.post.findMany({
      where: {
        userId,
        published: true,
      },
      include: {
        author: {
          select: { id: true, nickname: true, imageUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return serviceSuccess(posts);
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function getUserPublicBookmarkedPerfumesService(
  targetUserId: string
): Promise<ServiceResult<BasePerfume[]>> {
  try {
    const userCheck = await checkResourceExists("user", targetUserId, "사용자");
    if (!userCheck.success) return userCheck;

    const bookmarks = await prisma.perfumeBookmark.findMany({
      where: {
        userId: targetUserId,
        isPublic: true,
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
        perfume: true,
      },
    });
    return serviceSuccess(collections);
  } catch (error) {
    return serviceInternalError(error);
  }
}
