import { prisma } from "@/lib/prisma";
import { UserCollection } from "@prisma/client";

export function fetchUserCollections(
  userId: string
): Promise<UserCollection[]> {
  return prisma.userCollection.findMany({
    where: {
      userId,
    },
    include: {
      image: true,
    },
  });
}
