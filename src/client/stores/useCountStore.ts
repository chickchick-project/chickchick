import { create } from "zustand";

interface TotalStore {
  totalCount: number | null;
  setTotalCount: (n: number) => void;
}

export const useTotalStore = create<TotalStore>((set) => ({
  totalCount: null,
  setTotalCount: (n: number) => set({ totalCount: n }),
}));
