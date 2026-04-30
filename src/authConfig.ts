// Edge Runtime 호환 config — middleware에서만 사용
// DB fetch, Node API 절대 사용 금지
import { DefaultSession, NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface User {
    isNewUser?: boolean;
  }
  interface Session {
    user: {
      id: string;
      isNewUser?: boolean;
      nickname: string;
      imageUrl: string | null;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    error: "/",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isNewUser = token.isNewUser as boolean;
        session.user.nickname = token.nickname as string;
        session.user.imageUrl = token.imageUrl as string | null;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
