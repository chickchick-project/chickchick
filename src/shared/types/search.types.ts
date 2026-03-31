export type GenderSort = "MASCULINE" | "UNISEX" | "FEMININE";

export interface SearchPerfumesParams {
  searchText?: string;
  cursor?: string;
  limit?: number;
  genderSort?: GenderSort;
}

export interface SearchPerfumesWithFiltersParams extends SearchPerfumesParams {
  brandFilter?: string[];
  notesFilter?: string[];
  accordsFilter?: string[];
}
