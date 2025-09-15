import { create } from "zustand";

interface FilterStore {
  filters: Record<string, string[]>;
  handleFilterChange: (category: string, value: string) => void;
  closeFilter: (id: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  filters: {},
  handleFilterChange: (category, value) =>
    set((state) => {
      const newFilters = { ...state.filters };
      const prevArray = newFilters[category] ?? [];

      const nextArray = prevArray.includes(value)
        ? prevArray.filter((v) => v !== value)
        : [...prevArray, value].sort();

      if (nextArray.length === 0) {
        delete newFilters[category];
      } else {
        newFilters[category] = nextArray;
      }

      return { filters: newFilters };
    }),
  closeFilter: (id) =>
    set((state) => {
      const newFilters = { ...state.filters };
      for (const category in newFilters) {
        const values = newFilters[category];
        if (values.includes(id)) {
          const nextArray = values.filter((v) => v !== id);
          if (nextArray.length === 0) {
            delete newFilters[category];
          } else {
            newFilters[category] = nextArray;
          }
        }
      }
      return { filters: newFilters };
    }),
  resetFilters: () => set({ filters: {} }),
}));
