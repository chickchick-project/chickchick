// Node 런타임 전용 — server components, API routes, server actions에서 사용
import NextAuth from "next-auth";
import { authConfig } from "./authConfig";
import NaverProvider from "next-auth/providers/naver";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import { Account, User } from "next-auth";

const internalFetch = async (path: string, init?: RequestInit) => {
  const baseUrl = process.env.AUTH_URL;
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

type SyncOAuthUserResponse =
  | { type: "success"; id: string; isNewUser: boolean }
  | { type: "email_conflict"; token: string };

const syncOAuthUser = async (payload: {
  provider: string;
  providerAccountId: string;
  email: string;
}): Promise<SyncOAuthUserResponse> => {
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
  trustHost: true,
  callbacks: {
    ...authConfig.callbacks,

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
        const result = await syncOAuthUser({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          email: user.email,
        });

        if (result.type === "email_conflict") {
          return `/?action=link_confirm&token=${result.token}&provider=${account.provider}`;
        }

        user.id = result.id;
        user.isNewUser = result.isNewUser;
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

      if (user) {
        token.id = user.id;
        token.isNewUser = user.isNewUser ?? false;
      }

      const SESSION_REFRESH_INTERVAL_SEC = 60;
      const now = Math.floor(Date.now() / 1000);
      const lastFetched = (token.lastFetched as number | undefined) ?? 0;
      const needsRefresh = now - lastFetched > SESSION_REFRESH_INTERVAL_SEC;

      if (token.id && needsRefresh) {
        try {
          const freshUser = await fetchSessionUser(token.id as string);
          if (!freshUser || !freshUser.isActive) {
            return null;
          }
          token.nickname = freshUser.nickname;
          token.imageUrl = freshUser.imageUrl;
          token.lastFetched = now;
        } catch (err) {
          console.error("[AUTH][jwt] 세션 유저 조회 오류 — 세션 무효화:", err);
          return null;
        }
      }

      return token;
    },
  },
});
