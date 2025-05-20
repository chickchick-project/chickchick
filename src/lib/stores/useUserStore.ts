import { create } from "zustand";
import { fetchUserInfo } from "../supabase/query/user";
import { users } from "@prisma/client";

interface UserState {
  user: users | null;
  isHydrated: boolean;
  fetchUser: () => Promise<void>;
  setUser: (user: users) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isHydrated: false,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    try {
      const data = await fetchUserInfo();
      set({ user: data as users, isHydrated: true });
    } catch {
      set({ user: null });
    }
  },
  reset: () => set({ user: null }),
}));
