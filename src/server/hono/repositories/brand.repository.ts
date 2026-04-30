import { Prisma } from "@prisma/client";

export const brandSelect = {
  nameEn: true,
  nameKo: true,
  brandUrl: true,
} satisfies Prisma.BrandSelect;

export const brandSimpleSelect = {
  nameEn: true,
  nameKo: true,
} satisfies Prisma.BrandSelect;

export const brandDetailSelect = {
  id: true,
  nameEn: true,
  nameKo: true,
  description: true,
  imageUrl: true,
  brandUrl: true,
  mapLocation: true,
} satisfies Prisma.BrandSelect;

export const brandWithPerfumesInclude = {
  perfumes: {
    include: {
      brand: { select: brandSelect },
      perfumeImage: { select: { imageUrl: true } },
    },
    orderBy: { nameKo: "asc" as const },
  },
} satisfies Prisma.BrandInclude;

export type SimpleBrand = Prisma.BrandGetPayload<{
  select: typeof brandSimpleSelect;
}>;

export type DetailBrand = Prisma.BrandGetPayload<{
  select: typeof brandDetailSelect;
}>;

export type BrandWithPerfumes = Prisma.BrandGetPayload<{
  include: typeof brandWithPerfumesInclude;
}>;

export function parseMapLocation(
  value: Prisma.JsonValue
): { latitude: number; longitude: number } | null {
  if (value === null) return null;

  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;

    if (typeof obj.latitude === "number" && typeof obj.longitude === "number") {
      return {
        latitude: obj.latitude,
        longitude: obj.longitude,
      };
    }
  }

  console.warn("Invalid mapLocation format:", value);
  return null;
}
