import { create } from "zustand";
import { fetchUserInfo } from "../supabase/query/user";
import { users } from "@prisma/client";

interface UserState {
  user: users | null;
  fetchUser: () => Promise<void>;
  setUser: (user: users) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    try {
      const data = await fetchUserInfo();
      set({ user: data as users });
    } catch {
      set({ user: null });
    }
  },
  reset: () => set({ user: null }),
}));
