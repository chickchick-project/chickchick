import { prisma } from "../prisma";

export async function getPerfumeById(id: string) {
  return prisma.perfumes.findUnique({
    where: { id },
    include: {
      brands: true,
      perfumes_notes_map: {
        include: {
          perfume_notes: true,
        },
      },
      perfumes_accords_map: {
        include: {
          perfume_accords: true,
        },
      },
    },
  });
}
