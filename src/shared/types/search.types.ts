export interface SearchPerfumesParams {
  searchText?: string;
  cursor?: string;
  limit?: number;
}

export interface SearchPerfumesWithFiltersParams extends SearchPerfumesParams {
  brandFilter?: string[];
  notesFilter?: string[];
  accordsFilter?: string[];
}
