import { prisma } from "@/lib/prisma";
import { PerfumeResponse } from "@/lib/hono/schemas/perfume.schema";

export function getPerfumesListService(): Promise<PerfumeResponse[]>;
export function getPerfumesListService(
  filter: unknown
): Promise<PerfumeResponse[]>;

export async function getPerfumesListService(
  filter?: unknown
): Promise<PerfumeResponse[]> {
  // TODO: 배너에 보여줄 테마에 맞는 필터 적용 필요
  //테마는 어떻게 구분할 것인가?
  console.log(filter);
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
): Promise<PerfumeResponse | null> {
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
