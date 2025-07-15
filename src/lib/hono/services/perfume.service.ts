import { prisma } from "@/lib/prisma";
import { PerfumeResponse } from "@/lib/hono/schemas/perfume.schema";
import { PerfumeBookmark } from "@prisma/client";

/**
 * 향수 목록 조회
 * @param filter
 * @description 향수 목록을 조회.
 * @returns 향수 목록
 */
async function fetchPerfumesList(filter?: unknown) {
  console.log(filter);
  return await prisma.perfume.findMany({
    include: {
      brand: true,
      perfumeImage: true,
    },
  });
}

/**
 * 향수 ID에 따른 향수 정보 조회
 * @param id
 * @description 향수 ID에 따른 향수 정보를 조회.
 * @returns 향수 정보
 */
async function fetchPerfumeById(id: string): Promise<PerfumeResponse | null> {
  return await prisma.perfume.findUnique({
    where: { id },
    include: {
      brand: true,
      perfumeImage: true,
      accordMappings: {
        select: { accord: true },
      },
      noteMappings: {
        select: { note: true, noteStage: true },
      },
      reviews: {
        select: {
          id: true,
          content: true,
          author: { select: { id: true, nickname: true, imageUrl: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { bookmarks: true, reviews: true, collectedByUsers: true },
      },
    },
  });
}
/**
 * 내 북마크 향수 목록 조회
 * @param userId
 * @description 내 북마크 향수 목록을 조회.
 * @returns 내 북마크 향수 목록
 */
async function fetchMyBookmarkedPerfumes(
  userId: string
): Promise<PerfumeResponse[]> {
  const bookmarks = await prisma.perfumeBookmark.findMany({
    where: { userId },
    include: {
      perfume: {
        include: {
          brand: true,
          perfumeImage: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return bookmarks.map((b) => b.perfume);
}

/**
 * 사용자의 공개 북마크 향수 목록 조회
 * @param targetUserId
 * @returns
 */
async function fetchUserPublicBookmarkedPerfumes(
  targetUserId: string
): Promise<PerfumeResponse[]> {
  const bookmarks = await prisma.perfumeBookmark.findMany({
    where: {
      userId: targetUserId,
      isPublic: true,
    },
    include: {
      perfume: {
        include: {
          brand: true,
          perfumeImage: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return bookmarks.map((b) => b.perfume);
}

/**
 * 향수 북마크 추가/삭제
 * @param perfumeId 향수 ID
 * @param userId 사용자 ID
 * @description 향수 북마크 추가/삭제.
 * @returns 향수 북마크
 */
async function togglePerfumeBookmark(
  perfumeId: string,
  userId: string
): Promise<PerfumeBookmark | null> {
  return prisma.$transaction(async (tx) => {
    const perfume = await tx.perfume.findUnique({
      where: { id: perfumeId },
    });
    if (!perfume) {
      return null;
    }

    const bookmark = await tx.perfumeBookmark.findUnique({
      where: { user_perfume_bookmark_unique: { perfumeId, userId } },
    });

    if (bookmark) {
      return tx.perfumeBookmark.delete({
        where: { id: bookmark.id },
      });
    } else {
      return tx.perfumeBookmark.create({
        data: { perfumeId, userId },
      });
    }
  });
}

export async function getPerfumesListService(
  filter?: unknown
): Promise<PerfumeResponse[]> {
  // TODO: 배너에 보여줄 테마에 맞는 필터 적용 필요
  //테마는 어떻게 구분할 것인가?
  console.log(filter);
  try {
    const perfumes = await fetchPerfumesList(filter);
    return perfumes;
  } catch (error) {
    console.error("Error fetching perfumes list:", error);
    throw new Error("향수 목록을 가져오는데 실패했습니다.");
  }
}

export async function getPerfumeByIdService(
  id: string
): Promise<PerfumeResponse | null> {
  try {
    return await fetchPerfumeById(id);
  } catch (error) {
    console.error("Error fetching perfume by id:", error);
    throw new Error("향수 정보를 가져오는데 실패했습니다.");
  }
}

export async function togglePerfumeBookmarkService(
  perfumeId: string,
  userId: string
) {
  try {
    const updatedPerfume = await togglePerfumeBookmark(perfumeId, userId);
    if (!updatedPerfume) {
      return null;
    }
    return updatedPerfume;
  } catch (error) {
    console.error("Error in togglePerfumeBookmarkService:", error);
    throw new Error("향수 북마크를 추가하는데 실패했습니다.");
  }
}

export async function getBookmarkedPerfumesService(
  targetUserId: string,
  viewerId: string | null
): Promise<PerfumeResponse[]> {
  try {
    if (viewerId && targetUserId === viewerId) {
      return await fetchMyBookmarkedPerfumes(targetUserId);
    } else {
      return await fetchUserPublicBookmarkedPerfumes(targetUserId);
    }
  } catch (error) {
    console.error(
      `Error in getBookmarkedPerfumesService for user ${targetUserId}:`,
      error
    );
    throw new Error("북마크된 향수 목록을 가져오는데 실패했습니다.");
  }
}
