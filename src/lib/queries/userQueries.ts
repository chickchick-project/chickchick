"use server";

import { getSession } from "@/lib/database/getSession";
import { prisma } from "@/lib/prisma";
import { User, BookmarkItemType, Post } from "@prisma/client";
import { Session } from "next-auth";

type UserCollectionItem = {
  perfumeId: string;
  perfume: {
    id: string;
    nameKo: string | null;
    nameEn: string;
    imageUrl: string | null;
    brand: {
      nameEn: string;
      nameKo: string | null;
    };
  };
};

type SessionValidationResult =
  | { session: ValidatedSession; errorResult?: null }
  | { session?: null; errorResult: { success: false; message: string } };

type BookmarkedPostInfo = Pick<Post, "id" | "title" | "thumbnailUrl">;

type BookmarkedPerfumeInfo = {
  id: string;
  nameKo: string | null;
  nameEn: string;
  imageUrl: string | null;
};

type UserBookmarksGrouped = {
  posts: BookmarkedPostInfo[];
  perfumes: BookmarkedPerfumeInfo[];
};

interface ActionResult<T = null> {
  success: boolean;
  message?: string;
  data?: T;
}

interface ValidatedSession extends Session {
  user: User & { id: string };
}
interface CurrentUserInfo {
  id: string;
  imageUrl: string | null;
  name: string;
  email: string | null;
  nickname: string;
  role: string | null;
}

async function validateUserSession(
  expectedUserId?: string
): Promise<SessionValidationResult> {
  const session = await getSession();
  if (!session || !session.user || !session.user.id) {
    const message = !session
      ? "로그인이 필요합니다."
      : !session.user
      ? "세션 정보가 올바르지 않습니다."
      : "사용자 ID를 확인할 수 없습니다.";
    return { errorResult: { success: false, message } };
  }
  const currentUserId = session.user.id;
  if (expectedUserId && currentUserId !== expectedUserId) {
    return {
      errorResult: { success: false, message: "요청 권한이 없습니다." },
    };
  }
  return { session: session as ValidatedSession };
}
export async function fetchCurrentUserInfo(): Promise<
  ActionResult<CurrentUserInfo>
> {
  const validation = await validateUserSession();
  if (validation.errorResult) return validation.errorResult;
  const { session } = validation;

  try {
    const userData = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        nickname: true,
        email: true,
        imageUrl: true,
        role: true,
      },
    });

    if (!userData) {
      return { success: false, message: "사용자 정보를 찾을 수 없습니다." };
    }
    return { success: true, data: userData };
  } catch (error) {
    console.error("[UserQuery] fetchCurrentUserInfo:", error);
    return {
      success: false,
      message: "사용자 정보 조회에 실패했습니다.",
    };
  }
}

export async function fetchUserById(
  userId: string
): Promise<ActionResult<User>> {
  const checkUUID = /^[0-9a-fA-F-]{36}$/.test(userId);
  if (!checkUUID) {
    console.error("[UserQuery] fetchUserById: Invalid user ID format:", userId);
    return { success: false, message: "Invalid user ID format" };
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { success: false, message: "사용자를 찾을 수 없습니다." };
    }
    return { success: true, data: user };
  } catch (error) {
    console.error("[UserQuery] fetchUserById:", error);
    return { success: false, message: "사용자 조회에 실패했습니다." };
  }
}

/**
 * 사용자 향수 컬렉션 조회
 */
export async function fetchUserCollection(
  userId: string
): Promise<ActionResult<UserCollectionItem[]>> {
  try {
    const data = await prisma.userCollection.findMany({
      where: {
        userId,
      },
      select: {
        perfumeId: true,
        perfume: {
          select: {
            id: true,
            nameKo: true,
            nameEn: true,
            brand: { select: { nameEn: true, nameKo: true } },
            perfumeImage: {
              select: {
                image_url: true,
              },
            },
          },
        },
      },
    });

    if (!data) {
      return { success: false, message: "컬렉션을 찾을 수 없습니다." };
    }

    const formattedData = data.map((item) => ({
      perfumeId: item.perfumeId,
      perfume: {
        ...item.perfume,
        imageUrl: item.perfume.perfumeImage?.image_url || null,
      },
    }));

    return { success: true, data: formattedData };
  } catch (error) {
    console.error("[UserQuery] fetchUserCollection:", error);
    return { success: false, message: "컬렉션 조회에 실패했습니다." };
  }
}

export async function addUserCollection(userId: string, perfumeId: string) {
  const validation = await validateUserSession(userId);
  if (validation.errorResult) return validation.errorResult;

  try {
    const existingEntry = await prisma.userCollection.findUnique({
      where: { user_collection_unique_constraint: { userId, perfumeId } },
    });
    if (existingEntry)
      return { message: "이미 컬렉션에 있는 향수입니다.", success: false };

    await prisma.userCollection.create({
      data: {
        userId,
        perfumeId,
      },
    });
    return { message: "향수가 컬렉션에 추가되었습니다.", success: true };
  } catch (error) {
    console.error("[UserQuery] addUserCollection:", error);
    return { message: "향수 추가에 실패했습니다.", success: false };
  }
}

/**
 * 사용자 북마크 목록 조회
 */
export async function fetchUserBookmarks(
  userId: string
): Promise<UserBookmarksGrouped> {
  const validation = await validateUserSession(userId);
  if (validation.errorResult) return { posts: [], perfumes: [] };

  try {
    const [postBookmarks, perfumeBookmarks] = await Promise.all([
      prisma.postBookmark.findMany({
        where: { userId },
        select: {
          post: { select: { id: true, title: true, thumbnailUrl: true } },
        },
      }),
      prisma.perfumeBookmark.findMany({
        where: { userId },
        select: {
          perfume: {
            select: {
              id: true,
              nameKo: true,
              nameEn: true,
              perfumeImage: {
                select: {
                  image_url: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // [수정됨] 반환 데이터 구조를 가공합니다.
    const formattedPerfumes = perfumeBookmarks.map((b) => ({
      ...b.perfume,
      imageUrl: b.perfume.perfumeImage?.image_url || null,
    }));

    return {
      posts: postBookmarks.map((b) => b.post),
      perfumes: formattedPerfumes,
    };
  } catch (error) {
    console.error("[UserQuery] fetchUserBookmarks:", error);
    return { posts: [], perfumes: [] };
  }
}

export async function addUserBookmark(
  userId: string,
  itemId: string,
  itemType: BookmarkItemType
) {
  const validation = await validateUserSession(userId);
  if (validation.errorResult) return validation.errorResult;

  if (itemType === BookmarkItemType.POST) {
    const existing = await prisma.postBookmark.findUnique({
      where: { user_post_bookmark_unique: { userId, postId: itemId } },
    });
    if (existing)
      return { message: "이미 북마크한 게시물입니다.", success: false };

    await prisma.postBookmark.create({
      data: {
        userId,
        postId: itemId,
      },
    });
  } else if (itemType === BookmarkItemType.PERFUME) {
    const existing = await prisma.perfumeBookmark.findUnique({
      where: { user_perfume_bookmark_unique: { userId, perfumeId: itemId } },
    });
    if (existing)
      return { message: "이미 북마크한 향수입니다.", success: false };
    await prisma.perfumeBookmark.create({
      data: {
        userId,
        perfumeId: itemId,
      },
    });
  }

  return { message: "북마크가 추가되었습니다.", success: true };
}
