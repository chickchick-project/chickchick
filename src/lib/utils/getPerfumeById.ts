import { prisma } from "../prisma";

export async function getPerfumeById(id: string) {
  return prisma.perfume.findUnique({
    where: { id },
    include: {
      brand: true,
      noteMappings: {
        include: {
          note: true,
        },
      },
      accordMappings: {
        include: {
          accord: true,
        },
      },
    },
  });
}
