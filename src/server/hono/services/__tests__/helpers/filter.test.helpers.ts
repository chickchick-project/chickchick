import type { RawFilterOption } from "../../../schemas/filter.schema";

export const getTestData = () => {
  const mockRawFilters: RawFilterOption[] = [
    {
      id: "note-1",
      name_ko: "장미",
      name_en: "Rose",
      count: 15,
      category: "notes",
    },
    {
      id: "note-2",
      name_ko: "바닐라",
      name_en: "Vanilla",
      count: 20,
      category: "notes",
    },
    {
      id: "accord-1",
      name_ko: "플로럴",
      name_en: "Floral",
      count: 30,
      category: "accords",
    },
    {
      id: "accord-2",
      name_ko: "우디",
      name_en: "Woody",
      count: 25,
      category: "accords",
    },
    {
      id: "brand-1",
      name_ko: "샤넬",
      name_en: "Chanel",
      count: 10,
      category: "brands",
    },
    {
      id: "brand-2",
      name_ko: "디올",
      name_en: "Dior",
      count: 12,
      category: "brands",
    },
  ];

  const mockFilterTotals = [
    { category: "notes", total_count: 150 },
    { category: "accords", total_count: 80 },
    { category: "brands", total_count: 50 },
  ];

  return {
    mockRawFilters,
    mockFilterTotals,
    filterRequest: () => ({
      searchText: "테스트",
      brandFilter: ["brand-1"],
      notesFilter: ["note-1", "note-2"],
      accordsFilter: ["accord-1"],
    }),
  };
};
