import { describe, it, expect, beforeEach, vi } from "vitest";
import { prisma } from "@/server/prisma";
import {
  syncOAuthUserService,
  confirmOAuthLinkService,
  getSessionUserService,
} from "../auth.service";

vi.mock("@/server/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    userOAuthAccount: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    pendingOAuthLink: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("uuid", () => ({
  v4: vi.fn(() => "test-auth-id-1234-5678"),
}));

vi.mock("@/server/hono/utils/nickname.utils", () => ({
  generateNicknameCandidate: vi.fn(() => "플로럴토끼4821"),
}));

const BASE_INPUT = {
  provider: "google",
  providerAccountId: "google-uid-001",
  email: "test@example.com",
};

const ACTIVE_USER = {
  id: "user-001",
  email: "test@example.com",
  nickname: "user_1234",
  isActive: true,
  deletedAt: null,
};

const DELETED_USER_RECENT = {
  id: "user-002",
  email: "test@example.com",
  nickname: "user_5678_deleted_1234567890",
  isActive: false,
  deletedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3일 전
};

const DELETED_USER_OLD = {
  id: "user-003",
  email: "test@example.com",
  nickname: "user_9012_deleted_9876543210",
  isActive: false,
  deletedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10일 전
};

describe("syncOAuthUserService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("OAuth 계정으로 기존 유저 조회 (재로그인)", () => {
    it("providerAccountId로 찾은 활성 유저를 반환해야 한다", async () => {
      vi.mocked(prisma.userOAuthAccount.findFirst).mockResolvedValue({
        id: "oauth-001",
        userId: ACTIVE_USER.id,
        provider: "google",
        providerAccountId: "google-uid-001",
        createdAt: new Date(),
        user: ACTIVE_USER,
      } as never);

      const result = await syncOAuthUserService(BASE_INPUT);

      expect(result.success).toBe(true);
      if (result.success && result.data.type === "success") {
        expect(result.data.id).toBe("user-001");
        expect(result.data.isNewUser).toBe(false);
      }
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it("providerAccountId로 찾은 유저가 탈퇴 후 7일 미만이면 재활성화해야 한다", async () => {
      const reactivated = {
        ...DELETED_USER_RECENT,
        isActive: true,
        deletedAt: null,
        nickname: "user_5678",
      };
      vi.mocked(prisma.userOAuthAccount.findFirst).mockResolvedValue({
        id: "oauth-002",
        userId: DELETED_USER_RECENT.id,
        provider: "google",
        providerAccountId: "google-uid-001",
        createdAt: new Date(),
        user: DELETED_USER_RECENT,
      } as never);
      vi.mocked(prisma.user.update).mockResolvedValue(reactivated as never);

      const result = await syncOAuthUserService(BASE_INPUT);

      expect(result.success).toBe(true);
      if (result.success && result.data.type === "success") {
        expect(result.data.id).toBe("user-002");
        expect(result.data.isNewUser).toBe(false);
      }
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "user-002" },
          data: expect.objectContaining({
            isActive: true,
            deletedAt: null,
            nickname: "user_5678",
          }),
        }),
      );
    });

    it("providerAccountId로 찾은 유저가 탈퇴 후 7일 이상이면 OAuth 계정을 해제하고 신규 생성해야 한다", async () => {
      const newUser = {
        id: "user-new",
        email: "test@example.com",
        nickname: "user_4321",
        isActive: true,
        deletedAt: null,
      };
      vi.mocked(prisma.userOAuthAccount.findFirst).mockResolvedValueOnce({
        id: "oauth-003",
        userId: DELETED_USER_OLD.id,
        provider: "google",
        providerAccountId: "google-uid-001",
        createdAt: new Date(),
        user: DELETED_USER_OLD,
      } as never);
      vi.mocked(prisma.user.update).mockResolvedValue({
        ...DELETED_USER_OLD,
        email: null,
      } as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null); // email 조회 → 없음
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null); // nickname 중복 검사
      vi.mocked(prisma.user.create).mockResolvedValue(newUser as never);
      vi.mocked(prisma.userOAuthAccount.create).mockResolvedValue({} as never);

      const result = await syncOAuthUserService(BASE_INPUT);

      expect(result.success).toBe(true);
      if (result.success && result.data.type === "success") {
        expect(result.data.isNewUser).toBe(true);
      }
      expect(prisma.userOAuthAccount.deleteMany).toHaveBeenCalledWith({
        where: { provider: "google", providerAccountId: "google-uid-001" },
      });
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { email: null } }),
      );
      expect(prisma.user.create).toHaveBeenCalled();
      expect(prisma.userOAuthAccount.create).toHaveBeenCalled();
    });
  });

  describe("email로 기존 유저 조회 (이메일 중복)", () => {
    it("OAuth 계정 없고 email로 활성 유저를 찾으면 pendingOAuthLink를 생성하고 email_conflict를 반환해야 한다", async () => {
      vi.mocked(prisma.userOAuthAccount.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(ACTIVE_USER as never);
      vi.mocked(prisma.pendingOAuthLink.create).mockResolvedValue({
        id: "pending-001",
        token: "token-abc-123",
      } as never);

      const result = await syncOAuthUserService(BASE_INPUT);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe("email_conflict");
        if (result.data.type === "email_conflict") {
          expect(result.data.token).toBe("token-abc-123");
        }
      }
      expect(prisma.pendingOAuthLink.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            provider: "google",
            providerAccountId: "google-uid-001",
            targetEmail: "test@example.com",
          }),
        }),
      );
      expect(prisma.userOAuthAccount.create).not.toHaveBeenCalled();
    });

    it("OAuth 계정 없고 email로 찾은 유저가 탈퇴 후 7일 미만이면 재활성화 + OAuth 계정 연결해야 한다", async () => {
      const reactivated = {
        ...DELETED_USER_RECENT,
        isActive: true,
        deletedAt: null,
        nickname: "user_5678",
      };
      vi.mocked(prisma.userOAuthAccount.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(
        DELETED_USER_RECENT as never,
      );
      vi.mocked(prisma.user.update).mockResolvedValue(reactivated as never);
      vi.mocked(prisma.userOAuthAccount.create).mockResolvedValue({} as never);

      const result = await syncOAuthUserService(BASE_INPUT);

      expect(result.success).toBe(true);
      if (result.success && result.data.type === "success") {
        expect(result.data.id).toBe("user-002");
        expect(result.data.isNewUser).toBe(false);
      }
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ isActive: true, deletedAt: null }),
        }),
      );
      expect(prisma.userOAuthAccount.create).toHaveBeenCalledWith({
        data: {
          userId: "user-002",
          provider: "google",
          providerAccountId: "google-uid-001",
        },
      });
      expect(prisma.pendingOAuthLink.create).not.toHaveBeenCalled();
    });

    it("OAuth 계정 없고 email로 찾은 유저가 탈퇴 후 7일 이상이면 email 해제 후 신규 생성해야 한다", async () => {
      const newUser = {
        id: "user-new",
        email: "test@example.com",
        nickname: "user_4321",
        isActive: true,
        deletedAt: null,
      };
      vi.mocked(prisma.userOAuthAccount.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.user.findUnique)
        .mockResolvedValueOnce(DELETED_USER_OLD as never) // email 조회
        .mockResolvedValueOnce(null); // nickname 중복 검사
      vi.mocked(prisma.user.update).mockResolvedValue({
        ...DELETED_USER_OLD,
        email: null,
      } as never);
      vi.mocked(prisma.user.create).mockResolvedValue(newUser as never);
      vi.mocked(prisma.userOAuthAccount.create).mockResolvedValue({} as never);

      const result = await syncOAuthUserService(BASE_INPUT);

      expect(result.success).toBe(true);
      if (result.success && result.data.type === "success") {
        expect(result.data.isNewUser).toBe(true);
      }
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { email: null } }),
      );
      expect(prisma.user.create).toHaveBeenCalled();
      expect(prisma.userOAuthAccount.create).toHaveBeenCalled();
    });
  });

  describe("신규 유저 생성", () => {
    it("OAuth 계정도 없고 email로도 찾을 수 없으면 신규 유저와 OAuth 계정을 생성해야 한다", async () => {
      const newUser = {
        id: "user-new",
        email: "test@example.com",
        nickname: "user_4321",
        isActive: true,
        deletedAt: null,
      };
      vi.mocked(prisma.userOAuthAccount.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.user.findUnique)
        .mockResolvedValueOnce(null) // email 검색
        .mockResolvedValueOnce(null); // nickname 중복 검사
      vi.mocked(prisma.user.create).mockResolvedValue(newUser as never);
      vi.mocked(prisma.userOAuthAccount.create).mockResolvedValue({} as never);

      const result = await syncOAuthUserService(BASE_INPUT);

      expect(result.success).toBe(true);
      if (result.success && result.data.type === "success") {
        expect(result.data.isNewUser).toBe(true);
      }
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            nickname: "플로럴토끼4821",
            email: "test@example.com",
            name: "",
            totalPoints: 100,
          }),
        }),
      );
      expect(prisma.userOAuthAccount.create).toHaveBeenCalledWith({
        data: {
          userId: "user-new",
          provider: "google",
          providerAccountId: "google-uid-001",
        },
      });
    });

    it("nickname 후보가 중복이면 authId 기반 폴백 nickname으로 생성해야 한다", async () => {
      const newUser = {
        id: "user-new",
        email: "test@example.com",
        nickname: "user_test-aut",
        isActive: true,
        deletedAt: null,
      };
      vi.mocked(prisma.userOAuthAccount.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.user.findUnique)
        .mockResolvedValueOnce(null) // email 검색
        .mockResolvedValueOnce({ id: "existing" } as never); // nickname 중복
      vi.mocked(prisma.user.create).mockResolvedValue(newUser as never);
      vi.mocked(prisma.userOAuthAccount.create).mockResolvedValue({} as never);

      const result = await syncOAuthUserService(BASE_INPUT);

      expect(result.success).toBe(true);
      // uuid mock: "test-auth-id-1234-5678" → authId.slice(0, 8) = "test-aut"
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ nickname: "user_test-aut" }),
        }),
      );
    });
  });

  describe("에러 처리", () => {
    it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      vi.mocked(prisma.userOAuthAccount.findFirst).mockRejectedValue(
        new Error("DB connection failed"),
      );

      const result = await syncOAuthUserService(BASE_INPUT);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });

    it("재활성화 중 user.update 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      vi.mocked(prisma.userOAuthAccount.findFirst).mockResolvedValue({
        id: "oauth-002",
        userId: DELETED_USER_RECENT.id,
        provider: "google",
        providerAccountId: "google-uid-001",
        createdAt: new Date(),
        user: DELETED_USER_RECENT,
      } as never);
      vi.mocked(prisma.user.update).mockRejectedValue(new Error("DB error"));

      const result = await syncOAuthUserService(BASE_INPUT);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });
  });
});

describe("confirmOAuthLinkService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const VALID_PENDING = {
    id: "pending-001",
    token: "valid-token-uuid",
    provider: "naver",
    providerAccountId: "naver-uid-001",
    targetEmail: "test@example.com",
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5분 후
    createdAt: new Date(),
  };

  it("유효한 토큰으로 OAuthAccount를 생성하고 pending 레코드를 삭제해야 한다", async () => {
    vi.mocked(prisma.pendingOAuthLink.findUnique).mockResolvedValue(
      VALID_PENDING as never,
    );
    vi.mocked(prisma.user.findUnique).mockResolvedValue(ACTIVE_USER as never);
    vi.mocked(prisma.userOAuthAccount.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.userOAuthAccount.create).mockResolvedValue({} as never);
    vi.mocked(prisma.pendingOAuthLink.delete).mockResolvedValue({} as never);

    const result = await confirmOAuthLinkService("valid-token-uuid");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.userId).toBe("user-001");
    }
    expect(prisma.userOAuthAccount.create).toHaveBeenCalledWith({
      data: {
        userId: "user-001",
        provider: "naver",
        providerAccountId: "naver-uid-001",
      },
    });
    expect(prisma.pendingOAuthLink.delete).toHaveBeenCalledWith({
      where: { token: "valid-token-uuid" },
    });
  });

  it("존재하지 않는 토큰이면 NOT_FOUND를 반환해야 한다", async () => {
    vi.mocked(prisma.pendingOAuthLink.findUnique).mockResolvedValue(null);

    const result = await confirmOAuthLinkService("invalid-token");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("NOT_FOUND");
    }
  });

  it("만료된 토큰이면 BAD_REQUEST를 반환하고 pending 레코드를 삭제해야 한다", async () => {
    const expiredPending = {
      ...VALID_PENDING,
      expiresAt: new Date(Date.now() - 1000), // 이미 만료
    };
    vi.mocked(prisma.pendingOAuthLink.findUnique).mockResolvedValue(
      expiredPending as never,
    );
    vi.mocked(prisma.pendingOAuthLink.delete).mockResolvedValue({} as never);

    const result = await confirmOAuthLinkService("expired-token");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("BAD_REQUEST");
    }
    expect(prisma.pendingOAuthLink.delete).toHaveBeenCalled();
  });

  it("OAuthAccount가 이미 존재하면 create를 건너뛰고 성공을 반환해야 한다", async () => {
    vi.mocked(prisma.pendingOAuthLink.findUnique).mockResolvedValue(
      VALID_PENDING as never,
    );
    vi.mocked(prisma.user.findUnique).mockResolvedValue(ACTIVE_USER as never);
    vi.mocked(prisma.userOAuthAccount.findUnique).mockResolvedValue({
      id: "existing-oauth",
    } as never);
    vi.mocked(prisma.pendingOAuthLink.delete).mockResolvedValue({} as never);

    const result = await confirmOAuthLinkService("valid-token-uuid");

    expect(result.success).toBe(true);
    expect(prisma.userOAuthAccount.create).not.toHaveBeenCalled();
    expect(prisma.pendingOAuthLink.delete).toHaveBeenCalled();
  });
});

describe("getSessionUserService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const ACTIVE_SESSION_USER = {
    id: "user-001",
    isActive: true,
    nickname: "user_1234",
    imageUrl: null,
  };

  it("활성 유저의 최신 정보를 반환해야 한다", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(
      ACTIVE_SESSION_USER as never,
    );

    const result = await getSessionUserService("user-001");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe("user-001");
      expect(result.data.isActive).toBe(true);
      expect(result.data.nickname).toBe("user_1234");
    }
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-001" },
      select: { id: true, isActive: true, nickname: true, imageUrl: true },
    });
  });

  it("비활성 유저도 데이터를 반환해야 한다 (활성 여부 판단은 호출자 책임)", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...ACTIVE_SESSION_USER,
      isActive: false,
    } as never);

    const result = await getSessionUserService("user-001");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isActive).toBe(false);
    }
  });

  it("존재하지 않는 유저는 NOT_FOUND를 반환해야 한다", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const result = await getSessionUserService("nonexistent");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("NOT_FOUND");
    }
  });

  it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
    vi.mocked(prisma.user.findUnique).mockRejectedValue(
      new Error("DB connection failed"),
    );

    const result = await getSessionUserService("user-001");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("INTERNAL_ERROR");
    }
  });
});
