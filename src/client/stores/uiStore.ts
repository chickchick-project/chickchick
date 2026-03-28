import { create } from "zustand";

// ─── Modal ───────────────────────────────────────────────────────────────────

export type ModalKey = "loginModal";

export type ModalState = Record<ModalKey, boolean>;

interface ModalStoreActions {
  openModal: (name: ModalKey) => void;
  closeModal: (name: ModalKey) => void;
  toggleModal: (name: ModalKey) => void;
}

export const MODAL_KEYS: Record<string, ModalKey> = {
  LOGIN: "loginModal",
};

// ─── Visibility ──────────────────────────────────────────────────────────────

interface VisibilityState {
  isOpen: boolean;
  type: "modal" | "dropdown" | (string & {});
}

interface VisibilityStoreState {
  visibilities: Record<string, VisibilityState>;
  open: (id: string, type?: string) => void;
  close: (id: string) => void;
  toggle: (id: string) => void;
  isOpen: (id: string) => boolean;
}

// ─── Count ───────────────────────────────────────────────────────────────────

interface TotalStoreState {
  totalCount: number | null;
  setTotalCount: (n: number) => void;
}

// ─── Combined UI Store ────────────────────────────────────────────────────────

type UIStore = ModalState &
  ModalStoreActions &
  VisibilityStoreState &
  TotalStoreState;

const initialModalState: ModalState = {
  loginModal: false,
};

export const useUIStore = create<UIStore>((set, get) => ({
  // Modal
  ...initialModalState,
  openModal: (name) => set({ [name]: true }),
  closeModal: (name) => set({ [name]: false }),
  toggleModal: (name) => set((state) => ({ [name]: !state[name] })),

  // Visibility
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
    const isCurrentlyOpen = current?.isOpen ?? false;
    const type = current?.type ?? "dropdown";

    if (isCurrentlyOpen) {
      get().close(id);
    } else {
      get().open(id, type);
    }
  },

  isOpen: (id) => get().visibilities[id]?.isOpen ?? false,

  // Count
  totalCount: null,
  setTotalCount: (n: number) => set({ totalCount: n }),
}));

// ─── 하위 호환 re-export ──────────────────────────────────────────────────────

export const useModalStore = useUIStore;
export const useVisibilityStore = useUIStore;
export const useTotalStore = useUIStore;
