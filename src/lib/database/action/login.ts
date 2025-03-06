"use server";

import { signIn, signOut } from "@/auth";

export const naverLogin = async () => {
  await signIn("naver", { redirect: true, redirectTo: "/" });
};

export const logout = async () => {
  await signOut({ redirect: true, redirectTo: "/" });
};
