import { prisma } from "@/server/prisma";
import {
  serviceInternalError,
  serviceNotFound,
  serviceBadRequest,
  ServiceResult,
  serviceSuccess,
} from "@/server/result";
import { v4 as uuidv4 } from "uuid";
import { generateNicknameCandidate } from "@/server/hono/utils/nickname.utils";

export interface OAuthUserInput {
  provider: string;
  providerAccountId: string;
  email: string;
}

export type SyncOAuthUserResult =
  | { type: "success"; id: string; isNewUser: boolean }
  | { type: "email_conflict"; token: string };

const REJOIN_WINDOW_DAYS = 7;
const PENDING_LINK_EXPIRES_MINUTES = 10;

export async function syncOAuthUserService(
  input: OAuthUserInput,
): Promise<ServiceResult<SyncOAuthUserResult>> {
  try {
    const { provider, providerAccountId, email } = input;

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
          const restoredNickname = user.nickname.replace(/_deleted_\d+$/, "");
          const reactivated = await prisma.user.update({
            where: { id: user.id },
            data: { isActive: true, deletedAt: null, nickname: restoredNickname },
          });
          return serviceSuccess({ type: "success", id: reactivated.id, isNewUser: false });
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
        return serviceSuccess({ type: "success", id: user.id, isNewUser: false });
      }
    }

    // 2. email로 기존 유저 조회
    let dbUser = await prisma.user.findUnique({ where: { email } });

    if (dbUser && !dbUser.isActive && dbUser.deletedAt) {
      const daysSinceDeleted =
        (Date.now() - dbUser.deletedAt.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceDeleted < REJOIN_WINDOW_DAYS) {
        // 탈퇴 후 7일 미만 → 재활성화 + OAuth 계정 연결 (삭제된 계정이므로 확인 불필요)
        const restoredNickname = dbUser.nickname.replace(/_deleted_\d+$/, "");
        const reactivated = await prisma.user.update({
          where: { id: dbUser.id },
          data: { isActive: true, deletedAt: null, nickname: restoredNickname },
        });
        await prisma.userOAuthAccount.create({
          data: { userId: reactivated.id, provider, providerAccountId },
        });
        return serviceSuccess({ type: "success", id: reactivated.id, isNewUser: false });
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
      // 활성 유저 이메일 중복 → 명시적 연결 확인 필요
      const expiresAt = new Date(
        Date.now() + PENDING_LINK_EXPIRES_MINUTES * 60 * 1000,
      );
      const pending = await prisma.pendingOAuthLink.create({
        data: { provider, providerAccountId, targetEmail: email, expiresAt },
      });
      return serviceSuccess({ type: "email_conflict", token: pending.token });
    }

    // 3. 신규 유저 생성
    const authId = uuidv4();
    const candidate = generateNicknameCandidate();
    const nicknameTaken = await prisma.user.findUnique({ where: { nickname: candidate } });
    const defaultNickname = nicknameTaken ? `user_${authId.slice(0, 8)}` : candidate;

    const newUser = await prisma.user.create({
      data: {
        authId,
        name: "",
        nickname: defaultNickname,
        email,
        totalPoints: 100,
      },
    });

    await prisma.userOAuthAccount.create({
      data: { userId: newUser.id, provider, providerAccountId },
    });

    return serviceSuccess({ type: "success", id: newUser.id, isNewUser: true });
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function confirmOAuthLinkService(
  token: string,
): Promise<ServiceResult<{ userId: string }>> {
  try {
    const pending = await prisma.pendingOAuthLink.findUnique({ where: { token } });

    if (!pending) return serviceNotFound("유효하지 않은 연결 토큰입니다.");

    if (pending.expiresAt < new Date()) {
      await prisma.pendingOAuthLink.delete({ where: { token } });
      return serviceBadRequest("만료된 연결 토큰입니다. 다시 로그인해 주세요.");
    }

    const user = await prisma.user.findUnique({
      where: { email: pending.targetEmail },
    });
    if (!user || !user.isActive) {
      return serviceNotFound("연결할 계정을 찾을 수 없습니다.");
    }

    const existingOAuth = await prisma.userOAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: pending.provider,
          providerAccountId: pending.providerAccountId,
        },
      },
    });

    if (!existingOAuth) {
      await prisma.userOAuthAccount.create({
        data: {
          userId: user.id,
          provider: pending.provider,
          providerAccountId: pending.providerAccountId,
        },
      });
    }

    await prisma.pendingOAuthLink.delete({ where: { token } });
    return serviceSuccess({ userId: user.id });
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
