"use server";

import { signIn, signOut } from "@/auth";

export const naverLogin = async () => {
  await signIn("naver", { redirect: true, redirectTo: "/" });
};

export const googleLogin = async () => {
  await signIn("google", { redirect: true, redirectTo: "/" });
};

// TODO: kakao email 받아오는 권한 없음. 보류
export const kakaoLogin = async () => {
  await signIn("kakao", { redirect: true, redirectTo: "/" });
};

export const logout = async () => {
  await signOut({ redirect: true });
};
