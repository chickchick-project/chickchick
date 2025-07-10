import { prisma } from "@/lib/prisma";
import { Perfume } from "@prisma/client";

export async function getPerfumesListService(): Promise<Perfume[]> {
  try {
    const perfumes = await prisma.perfume.findMany({
      include: {
        brand: true,
        perfumeImage: true,
      },
    });
    return perfumes;
  } catch (error) {
    console.error("Error fetching perfumes list:", error);
    throw new Error("향수 목록을 가져오는데 실패했습니다.");
  }
}

export async function getPerfumeByIdService(
  id: string
): Promise<Perfume | null> {
  try {
    const rawPerfume = await prisma.perfume.findUnique({
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

    if (!rawPerfume) {
      return null;
    }

    return rawPerfume;
  } catch (error) {
    console.error("Error fetching perfume by id:", error);
    throw new Error("향수 정보를 가져오는데 실패했습니다.");
  }
}
