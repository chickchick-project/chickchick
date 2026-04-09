import { Account, DefaultSession, NextAuthConfig, User } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "./server/prisma";

declare module "next-auth" {
  interface User {
    isNewUser?: boolean;
  }
  interface Session {
    user: {
      id: string;
      isNewUser?: boolean;
    } & DefaultSession["user"];
  }
}

interface UserData {
  name: string;
  nickname: string;
  email?: string;
  imageUrl?: string;
  provider: string;
}

const REJOIN_WINDOW_DAYS = 7;

const findOrCreateUser = async (
  providerData: UserData,
): Promise<{
  user: Awaited<ReturnType<typeof prisma.user.findUnique>> & object;
  isNewUser: boolean;
}> => {
  const { name, email, imageUrl, provider } = providerData;
  let dbUser;

  if (email) {
    dbUser = await prisma.user.findUnique({ where: { email } });

    if (dbUser && !dbUser.isActive && dbUser.deletedAt) {
      const daysSinceDeleted =
        (Date.now() - dbUser.deletedAt.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceDeleted < REJOIN_WINDOW_DAYS) {
        // 탈퇴 후 7일 미만 → 기존 계정 재활성화 (_deleted_ suffix 제거)
        const restoredNickname = dbUser.nickname.replace(/_deleted_\d+$/, "");
        const reactivated = await prisma.user.update({
          where: { id: dbUser.id },
          data: { isActive: true, deletedAt: null, nickname: restoredNickname },
        });
        return { user: reactivated, isNewUser: false };
      } else {
        // 탈퇴 후 7일 이상 → 새 계정 생성 (기존 email 해제)
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { email: null },
        });
        dbUser = null;
      }
    }

    if (dbUser) return { user: dbUser, isNewUser: false };
  }

  if (!dbUser && provider === "kakao" && name) {
    dbUser = await prisma.user.findFirst({
      where: { nickname: name, isActive: true },
    });
    if (dbUser) return { user: dbUser, isNewUser: false };
  }

  // 신규 유저 — 기본 닉네임(user_XXXX) 생성, 중복 시 재시도
  const authId = uuidv4();
  let defaultNickname = "";
  for (let i = 0; i < 10; i++) {
    const suffix = Math.floor(1000 + Math.random() * 9000).toString();
    const candidate = `user_${suffix}`;
    const exists = await prisma.user.findUnique({
      where: { nickname: candidate },
    });
    if (!exists) {
      defaultNickname = candidate;
      break;
    }
  }
  if (!defaultNickname) defaultNickname = `user_${authId.slice(0, 8)}`;

  const newUser = await prisma.user.create({
    data: {
      authId,
      name: name || "",
      nickname: defaultNickname,
      email,
      imageUrl,
      totalPoints: 100,
    },
  });
  return { user: newUser, isNewUser: true };
};

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  callbacks: {
    signIn: async ({
      user,
      account,
    }: {
      user: User;
      account?: Account | null;
    }) => {
      if (!account) return false;

      const providerData = {
        name: user.name || "",
        nickname: user.name || "",
        email: user.email ?? undefined,
        imageUrl: user.image ?? undefined,
        provider: account.provider,
      };

      try {
        const { user: dbUser, isNewUser } =
          await findOrCreateUser(providerData);
        if (!dbUser) return false;
        user.id = dbUser.id;
        user.isNewUser = isNewUser;
        console.log(
          `[AUTH][signIn] provider=${account.provider} email=${providerData.email} dbUserId=${dbUser.id} isNewUser=${isNewUser}`,
        );
        return true;
      } catch (err) {
        console.error(`${account.provider} OAuth error:`, err);
        return false;
      }
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.isNewUser = user.isNewUser ?? false;
        console.log(
          `[AUTH][jwt] 최초 발급 — userId=${token.id} isNewUser=${token.isNewUser}`,
        );
      } else {
        console.log(
          `[AUTH][jwt] 갱신 — userId=${token.id} trigger=${trigger ?? "none"}`,
        );
      }
      // 온보딩 완료 시 세션 업데이트
      if (trigger === "update" && session?.isNewUser === false) {
        token.isNewUser = false;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isNewUser = token.isNewUser as boolean;
        console.log(
          `[AUTH][session] 세션 구성 — userId=${session.user.id} email=${session.user.email}`,
        );
      }
      return session;
    },
  },
  providers: [
    /**
     * 초기 값 빈 배열
     */
  ],
} satisfies NextAuthConfig;
