import { create } from "zustand";

interface FilterStore {
  filters: Map<string, Set<string>>;
  handleFilterChange: (category: string, value: string) => void;
  closeFilter: (id: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  filters: new Map(),
  handleFilterChange: (category, value) =>
    set((state) => {
      const filters = new Map(state.filters);
      const prevSet = filters.get(category) ?? new Set();
      const nextSet = new Set(prevSet);
      if (nextSet.has(value)) {
        nextSet.delete(value);
      } else {
        nextSet.add(value);
      }
      filters.set(category, nextSet);
      return { filters };
    }),
  closeFilter: (id) =>
    set((state) => {
      const filters = new Map(state.filters);
      for (const [category, set] of filters.entries()) {
        if (set.has(id)) {
          const nextSet = new Set(set);
          nextSet.delete(id);
          if (nextSet.size > 0) {
            filters.set(category, nextSet);
          } else {
            filters.delete(category);
          }
        }
      }
      return { filters };
    }),
  resetFilters: () => set({ filters: new Map() }),
}));
