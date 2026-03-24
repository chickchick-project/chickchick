import { create } from "zustand";

//modal 구독
export type ModalKey = "loginModal";

export type ModalState = Record<ModalKey, boolean>;

interface ModalStoreActions {
  openModal: (name: ModalKey) => void;
  closeModal: (name: ModalKey) => void;
  toggleModal: (name: ModalKey) => void;
}

const initialState: ModalState = {
  loginModal: false,
};

export const useModalStore = create<ModalState & ModalStoreActions>((set) => ({
  ...initialState,
  openModal: (name) => set({ [name]: true }),
  closeModal: (name) => set({ [name]: false }),
  toggleModal: (name) => set((state) => ({ [name]: !state[name] })),
}));

export const MODAL_KEYS: Record<string, ModalKey> = {
  LOGIN: "loginModal",
};
