import { create } from "zustand";
import { fetchCurrentUserInfo } from "../queries/userQueries";
import { User } from "@prisma/client";

interface UserState {
  user: User | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const data = await fetchCurrentUserInfo();
      if (!data.success) {
        set({ user: null, isLoading: false });
        return;
      }
      set({ user: data.data as User, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },
  reset: () => set({ user: null }),
}));
