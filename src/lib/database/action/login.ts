"use client";
import { signIn } from "next-auth/react";

export const naverLogin = async () => {
  await signIn("naver", {
    redirect: true,
    callbackUrl: "/",
  });
};
