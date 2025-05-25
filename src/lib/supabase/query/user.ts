"use server";

import { getSession } from "@/lib/database/getSession";
import { prisma } from "@/lib/prisma";
import { BookmarkItemType } from "@prisma/client";

/**
 * 현재 로그인한 사용자 정보 가져오기
 */
export async function fetchUserInfo() {
  const session = await getSession();
  if (!session?.user?.id) return;

  const userData = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  return userData;
}

export async function fetchUserById(userId: string) {
  if (!/^[0-9a-fA-F-]{36}$/.test(userId)) {
    throw new Error("잘못된 사용자 ID 형식입니다.");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new Error("사용자를 찾을 수 없습니다.");

  return user;
}

/**
 * 사용자 향수 컬렉션 조회
 */

export async function fetchUserCollection(userId: string) {
  const data = await prisma.userCollection.findMany({
    where: {
      userId,
    },
    select: {
      perfumeId: true,
      perfume: {
        select: {
          nameKo: true,
          nameEn: true,
          imageUrl: true,
        },
      },
    },
  });

  return data;
}
/**
 * 향수 컬렉션에 추가
 */
export async function addUserCollection(userId: string, perfumeId: string) {
  await prisma.userCollection.create({
    data: {
      userId,
      perfumeId,
    },
  });

  return { message: "향수가 컬렉션에 추가되었습니다." };
}

/**
 * 사용자 북마크 목록 조회
 */
export async function fetchUserBookmarks(userId: string) {
  const data = await prisma.userBookmark.findMany({
    where: {
      userId,
    },
    select: {
      itemId: true,
      itemType: true,
    },
  });

  return data;
}

/**
 * 북마크 추가
 */
export async function addUserBookmark(
  userId: string,
  itemId: string,
  itemType: BookmarkItemType
) {
  await prisma.userBookmark.create({
    data: {
      userId,
      itemId,
      itemType,
    },
  });

  return { message: "북마크가 추가되었습니다." };
}
