import NextAuth from "next-auth";
import { authConfig } from "./authConfig";
import NaverProvider from "next-auth/providers/naver";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
    }),

    KakaoProvider({
      clientId: process.env.NEXT_PUBLIC_KAKAO_APP_KEY,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
  ],
  trustHost: true, // 추가
});
