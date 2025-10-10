import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  serviceInternalError,
  serviceNotFound,
  ServiceResult,
  serviceSuccess,
} from "../utils/serviceResult.utils";

import { checkResourceExists } from "../utils/service.utils";
import { PostWithAuthor } from "./community.service";

const perfumeBaseInclude = {
  brand: { select: { nameEn: true, nameKo: true } },
  perfumeImage: { select: { imageUrl: true } },
} satisfies Prisma.PerfumeInclude;

const perfumeDetailInclude = {
  ...perfumeBaseInclude,
  accordMappings: { select: { accord: true } },
  noteMappings: { select: { note: true, noteStage: true } },
  reviews: {
    select: {
      id: true,
      content: true,
      author: { select: { id: true, nickname: true, imageUrl: true } },
    },
    orderBy: { createdAt: "desc" as const },
    take: 5, // 최신 리뷰 5개만 포함
  },
  _count: {
    select: { bookmarks: true, reviews: true, collectedByUsers: true },
  },
} satisfies Prisma.PerfumeInclude;

export type BasePerfume = Prisma.PerfumeGetPayload<{
  include: typeof perfumeBaseInclude;
}>;
export type FullPerfume = Prisma.PerfumeGetPayload<{
  include: typeof perfumeDetailInclude;
}>;

/**
 * 향수 목록 조회
 * @description 향수 목록을 조회.
 * @returns 향수 목록
 */
export async function getPerfumesListService(): Promise<
  ServiceResult<BasePerfume[]>
> {
  try {
    const perfumes = await prisma.perfume.findMany({
      include: perfumeBaseInclude,
      orderBy: { nameKo: "asc" },
    });
    return serviceSuccess(perfumes);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 향수 목록 테마별 조회
 * @param themeName
 * @description 향수 목록을 테마별로 조회. TODO: 테마별로 조회하는 로직 구현 필요
 * @returns 향수 목록
 */
export async function getPerfumesListByThemeService(
  themeName: string
): Promise<ServiceResult<BasePerfume[]>> {
  console.log(themeName);
  try {
    // TODO: 테마에 따른 필터링 로직 구현 (예: 특정 어코드나 노트를 포함하는 향수 검색)
    // const perfumes = await prisma.perfume.findMany({
    //   where: {
    //     // 예시: 'citrus' 어코드를 포함하는 향수
    //     accordMappings: {
    //       some: { accord: { nameEn: { equals: theme, mode: "insensitive" } } },
    //     },
    //   },
    //   include: perfumeBaseInclude,
    //   take: 5,
    // });
    const perfumes = await prisma.perfume.findMany({
      include: perfumeBaseInclude,
      orderBy: { nameKo: "asc" },
      take: 5,
    });
    return serviceSuccess(perfumes);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 향수 ID에 따른 향수 정보 조회
 * @param id
 * @description 향수 ID에 따른 향수 정보를 조회.
 * @returns 향수 정보
 */
export async function getPerfumeByIdService(
  id: string
): Promise<ServiceResult<FullPerfume>> {
  try {
    const perfume = await prisma.perfume.findUnique({
      where: { id },
      include: perfumeDetailInclude,
    });

    if (!perfume) {
      return serviceNotFound("향수를 찾을 수 없습니다.");
    }
    return serviceSuccess(perfume);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 특정 향수가 태그된 게시글 목록 조회
 * @param perfumeId - 조회할 향수의 ID
 * @param options - 페이지네이션 옵션 (limit, cursor)
 * @description 특정 향수가 태그된 게시글 목록을 조회.
 * @returns 향수 태그된 게시글 목록
 */
export async function getPostsTaggedWithPerfumeService(
  perfumeId: string,
  options: { limit?: number; cursor?: string } = {}
): Promise<ServiceResult<PostWithAuthor[]>> {
  try {
    const perfumeCheck = await checkResourceExists(
      "perfume",
      perfumeId,
      "향수"
    );
    if (!perfumeCheck.success) return perfumeCheck;

    const limit = options.limit ?? 10;
    const fetchLimit = limit + 1;

    const mappings = await prisma.postPerfumeMapping.findMany({
      where: { perfumeId },
      take: fetchLimit,
      cursor: options.cursor ? { id: options.cursor } : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        post: {
          include: {
            author: {
              select: { id: true, nickname: true, imageUrl: true },
            },
          },
        },
      },
    });

    const posts: PostWithAuthor[] = mappings.map((mapping) => mapping.post);

    return serviceSuccess(posts);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 향수 북마크 추가/삭제
 * @param perfumeId 향수 ID
 * @param userId 사용자 ID
 * @description 향수 북마크 추가/삭제.
 * @returns 향수 북마크
 */
export async function togglePerfumeBookmarkService(
  perfumeId: string,
  userId: string
): Promise<ServiceResult<{ bookmarked: boolean }>> {
  try {
    const [perfumeCheck, userCheck] = await Promise.all([
      checkResourceExists("perfume", perfumeId, "향수"),
      checkResourceExists("user", userId, "사용자"),
    ]);
    if (!perfumeCheck.success) return perfumeCheck;
    if (!userCheck.success) return userCheck;

    const bookmark = await prisma.perfumeBookmark.findUnique({
      where: {
        perfume_bookmarks_user_id_perfume_id_key: { perfumeId, userId },
      },
    });

    if (bookmark) {
      await prisma.perfumeBookmark.delete({ where: { id: bookmark.id } });
      return serviceSuccess({ bookmarked: false });
    } else {
      await prisma.perfumeBookmark.create({ data: { perfumeId, userId } });
      return serviceSuccess({ bookmarked: true });
    }
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function togglePerfumeLikeService(
  perfumeId: string,
  userId: string
): Promise<ServiceResult<{ liked: boolean }>> {
  try {
    const [perfumeCheck, userCheck] = await Promise.all([
      checkResourceExists("perfume", perfumeId, "향수"),
      checkResourceExists("user", userId, "사용자"),
    ]);
    if (!perfumeCheck.success) return perfumeCheck;
    if (!userCheck.success) return userCheck;

    const like = await prisma.perfumeLike.findUnique({
      where: { perfume_likes_user_id_perfume_id_key: { perfumeId, userId } },
    });

    if (like) {
      await prisma.perfumeLike.delete({ where: { id: like.id } });
      return serviceSuccess({ liked: false });
    } else {
      await prisma.perfumeLike.create({ data: { perfumeId, userId } });
      return serviceSuccess({ liked: true });
    }
  } catch (error) {
    return serviceInternalError(error);
  }
}
