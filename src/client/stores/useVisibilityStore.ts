import { create } from "zustand";

interface VisibilityState {
  isOpen: boolean;
  type: "modal" | "dropdown" | (string & {});
}

interface VisibilityStore {
  visibilities: Record<string, VisibilityState>;
  open: (id: string, type?: string) => void;
  close: (id: string) => void;
  toggle: (id: string) => void;
  isOpen: (id: string) => boolean;
}

export const useVisibilityStore = create<VisibilityStore>((set, get) => ({
  visibilities: {},

  open: (id, type = "dropdown") =>
    set((state) => {
      const newVisibilities = { ...state.visibilities };

      if (type === "modal") {
        for (const key in newVisibilities) {
          if (newVisibilities[key].type === "modal") {
            newVisibilities[key] = { ...newVisibilities[key], isOpen: false };
          }
        }
      }

      newVisibilities[id] = { isOpen: true, type };

      return { visibilities: newVisibilities };
    }),

  close: (id) =>
    set((state) => ({
      visibilities: {
        ...state.visibilities,
        [id]: {
          ...state.visibilities[id],
          isOpen: false,
        },
      },
    })),

  toggle: (id) => {
    const current = get().visibilities[id];
    const isOpen = current?.isOpen ?? false;
    const type = current?.type ?? "dropdown";

    if (isOpen) {
      get().close(id);
    } else {
      get().open(id, type);
    }
  },

  isOpen: (id) => get().visibilities[id]?.isOpen ?? false,
}));
