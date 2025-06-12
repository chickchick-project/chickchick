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
    brand: getLocalized(raw.brand.name),
    imageUrl: raw.imageUrl ?? "",
    officialUrl: raw.officialUrl ?? null,
    notes: raw.noteMappings.map(
      (m: { note: { id: string; name: JsonValue } }) => ({
        id: m.note.id,
        name: getLocalized(m.note.name),
      })
    ),
    accords: raw.accordMappings.map(
      (m: { accord: { id: string; name: JsonValue } }) => ({
        id: m.accord.id,
        name: getLocalized(m.accord.name) as TAccords,
      })
    ),
  };
}
