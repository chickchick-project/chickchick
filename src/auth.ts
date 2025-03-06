import NextAuth from "next-auth";
import { authConfig } from "./authConfig";
import NaverProvider from "next-auth/providers/naver";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
    }),
  ],
  trustHost: true, // 추가
});
