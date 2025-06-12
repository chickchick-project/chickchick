import { Account, NextAuthConfig, User } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "./lib/prisma";

interface UserData {
  name: string;
  nickname: string;
  email?: string;
  imageUrl?: string;
  provider: string;
}

const findOrCreateUser = async (providerData: UserData) => {
  const { name, nickname, email, imageUrl, provider } = providerData;
  let dbUser;

  if (email) {
    dbUser = await prisma.user.findUnique({ where: { email } });
    if (dbUser) {
      return dbUser;
    }
  }

  if (!dbUser && provider === "kakao" && name) {
    dbUser = await prisma.user.findFirst({ where: { nickname: name } });
    if (dbUser) {
      console.log(
        `${provider} OAuth: Existing user found by nickname:`,
        dbUser
      );
      return dbUser;
    }
  }

  const newUser = await prisma.user.create({
    data: {
      authId: uuidv4(),
      name: name || "",
      nickname: nickname || name || "",
      email,
      imageUrl,
    },
  });

  return newUser;
};

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  callbacks: {
    signIn: async ({
      user,
      account,
    }: {
      user: User;
      account: Account | null;
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
        const dbUser = await findOrCreateUser(providerData);
        if (!dbUser) return false;
        user.id = dbUser.id;
        return true;
      } catch (err) {
        console.error(`${account.provider} OAuth error:`, err);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
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
