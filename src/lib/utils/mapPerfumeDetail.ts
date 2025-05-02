import { TPerfumeDetailRaw } from "@/lib/types/perfumeDetail";
import { JsonValue } from "@prisma/client/runtime/library";
import { TAccords } from "../constants/accords";

export type TPerfumeDetail = {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  officialUrl: string | null;
  notes: { id: string; name: string }[];
  accords: { id: string; name: TAccords }[];
};

function getLocalized(name: JsonValue): string {
  if (typeof name === "object" && name !== null && "en" in name) {
    const localized = name as { en?: string };
    return localized.en ?? "";
  }
  return typeof name === "string" ? name : "";
}

export function mapPerfumeDetail(raw: TPerfumeDetailRaw): TPerfumeDetail {
  return {
    id: raw.id,
    name: getLocalized(raw.name),
    brand: getLocalized(raw.brands.name),
    imageUrl: raw.image_url ?? "",
    officialUrl: raw.official_url ?? null,
    notes: raw.perfumes_notes_map.map((m) => ({
      id: m.perfume_notes.id,
      name: getLocalized(m.perfume_notes.name),
    })),
    accords: raw.perfumes_accords_map.map((m) => ({
      id: m.perfume_accords.id,
      name: getLocalized(m.perfume_accords.name) as TAccords,
    })),
  };
}
