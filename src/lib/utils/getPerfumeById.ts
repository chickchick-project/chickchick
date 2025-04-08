import { prisma } from "@/lib/prisma";

export async function getPerfumeById(id: string) {
  return prisma.perfumes.findUnique({
    where: { id },
    include: {
      perfumes_notes_map: true,
      perfumes_accords_map: true,
    },
  });
}
