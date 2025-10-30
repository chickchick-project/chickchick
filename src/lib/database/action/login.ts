"use server";

import { signIn, signOut } from "@/auth";
import { revalidatePath } from "next/cache";

export const naverLogin = async (callbackUrl?: string) => {
  await signIn("naver", { redirect: true, redirectTo: callbackUrl || "/" });
};

export const googleLogin = async (callbackUrl?: string) => {
  await signIn("google", { redirect: true, redirectTo: callbackUrl || "/" });
};

// TODO: kakao email 받아오는 권한 없음. 보류
export const kakaoLogin = async (callbackUrl?: string) => {
  await signIn("kakao", { redirect: true, redirectTo: callbackUrl || "/" });
};

export const logout = async () => {
  await signOut({ redirect: false });
  revalidatePath("/", "layout");
};
