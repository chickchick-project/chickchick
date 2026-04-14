import { prisma } from "@/server/prisma";
import {
  serviceInternalError,
  serviceNotFound,
  ServiceResult,
  serviceSuccess,
} from "@/server/result";
import { v4 as uuidv4 } from "uuid";
import { generateNicknameCandidate } from "@/server/hono/utils/nickname.utils";

export interface OAuthUserInput {
  provider: string;
  providerAccountId: string;
  name: string;
  email: string;
  imageUrl?: string;
}

export interface SyncOAuthUserResult {
  id: string;
  isNewUser: boolean;
  isLinked: boolean; // true = 다른 소셜 계정으로 첫 로그인, 이메일로 기존 계정에 연결됨
}

const REJOIN_WINDOW_DAYS = 7;

export async function syncOAuthUserService(
  input: OAuthUserInput,
): Promise<ServiceResult<SyncOAuthUserResult>> {
  try {
    const { provider, providerAccountId, name, email, imageUrl } = input;

    // 1. providerAccountId로 먼저 조회 (같은 소셜 계정으로 재로그인)
    const oauthAccount = await prisma.userOAuthAccount.findFirst({
      where: { provider, providerAccountId },
      include: { user: true },
    });

    if (oauthAccount) {
      const { user } = oauthAccount;

      if (!user.isActive && user.deletedAt) {
        const daysSinceDeleted =
          (Date.now() - user.deletedAt.getTime()) / (1000 * 60 * 60 * 24);

        if (daysSinceDeleted < REJOIN_WINDOW_DAYS) {
          // 탈퇴 후 7일 미만 → 기존 계정 재활성화
          const restoredNickname = user.nickname.replace(/_deleted_\d+$/, "");
          const reactivated = await prisma.user.update({
            where: { id: user.id },
            data: { isActive: true, deletedAt: null, nickname: restoredNickname },
          });
          return serviceSuccess({ id: reactivated.id, isNewUser: false, isLinked: false });
        } else {
          // 탈퇴 후 7일 이상 → OAuth 계정 연결 해제 + email 해제 후 신규 생성
          await prisma.userOAuthAccount.deleteMany({
            where: { provider, providerAccountId },
          });
          await prisma.user.update({
            where: { id: user.id },
            data: { email: null },
          });
          // fall through → 아래 신규 생성 로직으로
        }
      } else {
        return serviceSuccess({ id: user.id, isNewUser: false, isLinked: false });
      }
    }

    // 2. email로 기존 유저 조회 (다른 소셜 계정으로 첫 로그인 → 계정 연결)
    let dbUser = await prisma.user.findUnique({ where: { email } });

    if (dbUser && !dbUser.isActive && dbUser.deletedAt) {
      const daysSinceDeleted =
        (Date.now() - dbUser.deletedAt.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceDeleted < REJOIN_WINDOW_DAYS) {
        // 탈퇴 후 7일 미만 → 재활성화 + OAuth 계정 연결
        const restoredNickname = dbUser.nickname.replace(/_deleted_\d+$/, "");
        const reactivated = await prisma.user.update({
          where: { id: dbUser.id },
          data: { isActive: true, deletedAt: null, nickname: restoredNickname },
        });
        await prisma.userOAuthAccount.create({
          data: { userId: reactivated.id, provider, providerAccountId },
        });
        return serviceSuccess({ id: reactivated.id, isNewUser: false, isLinked: true });
      } else {
        // 탈퇴 후 7일 이상 → email 해제 후 신규 생성
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { email: null },
        });
        dbUser = null;
      }
    }

    if (dbUser) {
      // 기존 활성 유저 → 이 소셜 계정을 연결
      // 이미 연결된 소셜 계정이 있을 때만 알림 표시 (신규 연결임을 명확히 알릴 때)
      const existingAccountCount = await prisma.userOAuthAccount.count({
        where: { userId: dbUser.id },
      });
      await prisma.userOAuthAccount.create({
        data: { userId: dbUser.id, provider, providerAccountId },
      });
      return serviceSuccess({ id: dbUser.id, isNewUser: false, isLinked: existingAccountCount > 0 });
    }

    // 3. 신규 유저 생성
    const authId = uuidv4();
    const candidate = generateNicknameCandidate();
    const nicknameTaken = await prisma.user.findUnique({ where: { nickname: candidate } });
    const defaultNickname = nicknameTaken ? `user_${authId.slice(0, 8)}` : candidate;

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

    await prisma.userOAuthAccount.create({
      data: { userId: newUser.id, provider, providerAccountId },
    });

    return serviceSuccess({ id: newUser.id, isNewUser: true, isLinked: false });
  } catch (error) {
    return serviceInternalError(error);
  }
}

export interface SessionUser {
  id: string;
  isActive: boolean;
  nickname: string;
  imageUrl: string | null;
}

export async function getSessionUserService(
  userId: string,
): Promise<ServiceResult<SessionUser>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isActive: true, nickname: true, imageUrl: true },
    });
    if (!user) return serviceNotFound("사용자를 찾을 수 없습니다.");
    return serviceSuccess(user);
  } catch (error) {
    return serviceInternalError(error);
  }
}
