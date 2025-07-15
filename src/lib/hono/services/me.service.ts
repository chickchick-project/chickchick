import { prisma } from "@/lib/prisma";

async function getBookmarkedPostMe(userId: string) {
  return await prisma.postBookmark.findMany({
    where: { userId },
    include: {
      post: true,
    },
  });
}

export async function getBookmarkedPostMeService(userId: string) {
  return await getBookmarkedPostMe(userId);
}

async function getBookmarkedPerfumeMe(userId: string) {
  return await prisma.perfumeBookmark.findMany({
    where: { userId },
    include: {
      perfume: true,
    },
  });
}

export async function getBookmarkedPerfumeMeService(userId: string) {
  return await getBookmarkedPerfumeMe(userId);
}
