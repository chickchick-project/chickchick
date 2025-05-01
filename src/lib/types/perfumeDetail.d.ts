import {
  perfumes,
  perfumes_notes_map,
  perfumes_accords_map,
  brands,
  perfume_notes,
  perfume_accords,
} from "@prisma/client";

export type TPerfumeDetailRaw = perfumes & {
  brands: brands;
  perfumes_notes_map: (perfumes_notes_map & {
    perfume_notes: perfume_notes;
  })[];
  perfumes_accords_map: (perfumes_accords_map & {
    perfume_accords: perfume_accords;
  })[];
};

export type TPerfumeDetail = {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  officialUrl: string | null;
  description: string | null;
  notes: {
    id: string;
    name: string;
  }[];
  accords: {
    id: string;
    name: string;
  }[];
};
