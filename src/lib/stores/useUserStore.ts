import { create } from "zustand";
import { ApiMyProfileResponse } from "../hono/schemas/me.schema";

interface UserState {
  user: ApiMyProfileResponse | null;
  isLoading: boolean;
  setUser: (user: ApiMyProfileResponse | null) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  reset: () => set({ user: null }),
}));
