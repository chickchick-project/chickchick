import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  ServiceResult,
  serviceSuccess,
  serviceInternalError,
} from "../utils/serviceResult.utils";
import { PostWithAuthor } from "./community.service";
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

/**
 * 인증된 사용자가 북마크한 게시글 목록을 조회합니다.
 * @param userId - 인증된 사용자의 ID
 */
export async function getMyBookmarkedPostsService(
  userId: string
): Promise<ServiceResult<PostWithAuthor[]>> {
  try {
    const bookmarks = await prisma.postBookmark.findMany({
      where: { userId },
      select: {
        post: {
          ...postWithAuthorArgs,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const posts = bookmarks.map((b) => b.post);
    return serviceSuccess(posts);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 인증된 사용자가 북마크한 향수 목록을 조회합니다.
 * @param userId - 인증된 사용자의 ID
 */
export async function getMyBookmarkedPerfumesService(
  userId: string
): Promise<ServiceResult<PerfumeBaseResponse[]>> {
  try {
    const bookmarks = await prisma.perfumeBookmark.findMany({
      where: { userId },
      select: {
        perfume: {
          include: perfumeBaseInclude,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const perfumes = bookmarks.map((b) => b.perfume);
    return serviceSuccess(perfumes);
  } catch (error) {
    return serviceInternalError(error);
  }
}
