import { prisma } from "@/lib/prisma";

export async function getPerfumeDetailRaw(id: string) {
  const perfume = await prisma.perfume.findUnique({
    where: { id },
    select: {
      nameKo: true,
      brand: { select: { nameKo: true } },
      noteMappings: {
        select: {
          noteStage: true,
          note: { select: { id: true, nameKo: true } },
        },
      },
      accordMappings: {
        select: {
          accord: { select: { id: true, nameKo: true } },
        },
      },
      perfumeImage: {
        select: { imageUrl: true },
      },
    },
  });

  if (!perfume) return null;

  return {
    id: id,
    name: perfume.nameKo,
    brand: perfume.brand.nameKo,
    notes: perfume.noteMappings.map((m) => ({
      stage: m.noteStage,
      id: m.note.id,
      name: m.note.nameKo,
    })),
    accords: perfume.accordMappings.map((m) => ({
      id: m.accord.id,
      name: m.accord.nameKo,
    })),
    imageUrl: perfume.perfumeImage?.imageUrl ?? null,
  };
}
