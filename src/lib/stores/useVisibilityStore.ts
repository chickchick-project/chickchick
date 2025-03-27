import { create } from "zustand";

interface VisibilityState {
  isOpen: boolean;
}

interface VisibilityStore {
  visibilitys: Record<string, VisibilityState>;
  open: (id: string) => void;
  close: (id: string) => void;
  toggle: (id: string) => void;
  isOpen: (id: string) => boolean;
}

export const useVisibilityStore = create<VisibilityStore>((set, get) => ({
  visibilitys: {},

  open: (id) =>
    set((state) => ({
      visibilitys: { ...state.visibilitys, [id]: { isOpen: true } },
    })),

  close: (id) =>
    set((state) => ({
      visibilitys: { ...state.visibilitys, [id]: { isOpen: false } },
    })),

  toggle: (id) => {
    const current = get().visibilitys[id]?.isOpen ?? false;
    set((state) => ({
      visibilitys: { ...state.visibilitys, [id]: { isOpen: !current } },
    }));
  },

  isOpen: (id) => get().visibilitys[id]?.isOpen ?? false,
}));
