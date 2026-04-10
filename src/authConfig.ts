import { Account, DefaultSession, NextAuthConfig, User } from "next-auth";

declare module "next-auth" {
  interface User {
    isNewUser?: boolean;
    isLinked?: boolean;
    linkedProvider?: string;
  }
  interface Session {
    user: {
      id: string;
      isNewUser?: boolean;
      isLinked?: boolean;
      linkedProvider?: string;
      nickname: string;
      imageUrl: string | null;
    } & DefaultSession["user"];
  }
}

const internalFetch = async (path: string, init?: RequestInit) => {
  const baseUrl = process.env.NEXTAUTH_URL ?? process.env.AUTH_URL;
  if (!baseUrl)
    throw new Error("NEXTAUTH_URL 또는 AUTH_URL 환경변수가 필요합니다.");

  return fetch(`${baseUrl}/api/v1/auth${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-internal-secret": process.env.INTERNAL_API_SECRET ?? "",
      ...init?.headers,
    },
  });
};

const syncOAuthUser = async (payload: {
  provider: string;
  providerAccountId: string;
  name: string;
  email: string;
  imageUrl?: string;
}): Promise<{ id: string; isNewUser: boolean; isLinked: boolean }> => {
  const res = await internalFetch("/sync", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OAuth 유저 동기화 실패: ${res.status} ${text}`);
  }

  const json = await res.json();
  return json.data;
};

const fetchSessionUser = async (
  userId: string,
): Promise<{
  id: string;
  isActive: boolean;
  nickname: string;
  imageUrl: string | null;
} | null> => {
  const res = await internalFetch(`/session-user/${userId}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`세션 유저 조회 실패: ${res.status}`);
  const json = await res.json();
  return json.data;
};

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    error: "/",
  },
  callbacks: {
    signIn: async ({
      user,
      account,
    }: {
      user: User;
      account?: Account | null;
    }) => {
      if (!account) return false;
      if (!user.email) return false;

      try {
        const { id, isNewUser, isLinked } = await syncOAuthUser({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          name: user.name ?? "",
          email: user.email,
          imageUrl: user.image ?? undefined,
        });

        user.id = id;
        user.isNewUser = isNewUser;
        user.isLinked = isLinked;
        user.linkedProvider = isLinked ? account.provider : undefined;
        return true;
      } catch (err) {
        console.error(`[AUTH][signIn] ${account.provider} 동기화 오류:`, err);
        return false;
      }
    },

    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.isNewUser === false) {
        token.isNewUser = false;
      }
      if (trigger === "update" && session?.isLinked === false) {
        token.isLinked = false;
        token.linkedProvider = undefined;
      }

      if (user) {
        token.id = user.id;
        token.isNewUser = user.isNewUser ?? false;
        token.isLinked = user.isLinked ?? false;
        token.linkedProvider = user.linkedProvider;
      }

      if (token.id) {
        try {
          const freshUser = await fetchSessionUser(token.id as string);
          if (!freshUser || !freshUser.isActive) {
            return null;
          }
          token.nickname = freshUser.nickname;
          token.imageUrl = freshUser.imageUrl;
        } catch (err) {
          console.error("[AUTH][jwt] 세션 유저 조회 오류 — 세션 무효화:", err);
          return null;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isNewUser = token.isNewUser as boolean;
        session.user.isLinked = token.isLinked as boolean;
        session.user.linkedProvider = token.linkedProvider as
          | string
          | undefined;
        session.user.nickname = token.nickname as string;
        session.user.imageUrl = token.imageUrl as string | null;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
