import { describe, it, expect, beforeEach, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  getUserProfileService,
  getUserPostsService,
  getUserPublicBookmarkedPerfumesService,
  getUserCollectionsService,
} from "../user.service";
import { getTestData } from "./helpers/user.test.helpers";

/**
 * User 서비스 테스트 (MVP)
 *
 * 테스트 전략:
 * - 사용자 프로필 및 데이터 조회 로직 검증
 * - 레벨 계산 로직 확인
 * - 공개/비공개 필터링 검증
 * - 에러 처리
 *
 * 주요 시나리오:
 * 1. 사용자 프로필 조회 (레벨 계산 포함)
 * 2. 사용자 게시글 목록 조회 (published만)
 * 3. 공개 북마크 향수 목록 조회 (isPublic 필터)
 * 4. 사용자 컬렉션 조회
 * 5. 존재하지 않는 사용자 처리 (NOT_FOUND)
 */

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    post: {
      findMany: vi.fn(),
    },
    perfumeBookmark: {
      findMany: vi.fn(),
    },
    userCollection: {
      findMany: vi.fn(),
    },
  },
}));

// Mock level utils
vi.mock("../../../utils/level.utils", () => ({
  calculateLevel: vi.fn((points: number) => Math.floor(points / 100)),
}));

describe("User Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUserProfileService", () => {
    it("사용자 프로필을 조회하고 레벨을 계산해야 한다", async () => {
      const { ids, mockUser } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      const result = await getUserProfileService(ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(ids.userId);
        expect(result.data.nickname).toBe("테스트유저");
        expect(result.data.totalPoints).toBe(250);
        expect(result.data.level).toBe(2); // 250 / 100 = 2
      }
    });

    it("존재하지 않는 사용자는 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await getUserProfileService(ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
        expect(result.message).toContain("사용자");
      }
    });
  });

  describe("getUserPostsService", () => {
    it("사용자의 게시글 목록을 조회해야 한다", async () => {
      const { ids, mockUser, mockPosts } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.post.findMany).mockResolvedValue(
        mockPosts.filter((p) => p.published) as never
      );

      const result = await getUserPostsService(ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1);
        expect(result.data[0].title).toBe("향수 추천 게시글");
      }
    });

    it("published=true인 게시글만 조회되어야 한다", async () => {
      const { ids, mockUser, mockPosts } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.post.findMany).mockResolvedValue(
        mockPosts.filter((p) => p.published) as never
      );

      const result = await getUserPostsService(ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.every((post) => post.published === true)).toBe(true);
      }
      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            published: true,
          }),
        })
      );
    });

    it("존재하지 않는 사용자는 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await getUserPostsService(ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
        expect(result.message).toContain("사용자");
      }
    });

    it("생성일 기준 내림차순 정렬이어야 한다", async () => {
      const { ids, mockUser, mockPosts } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.post.findMany).mockResolvedValue(
        mockPosts.filter((p) => p.published) as never
      );

      await getUserPostsService(ids.userId);

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: "desc" },
        })
      );
    });
  });

  describe("getUserPublicBookmarkedPerfumesService", () => {
    it("공개 북마크 향수 목록을 조회해야 한다", async () => {
      const { ids, mockUser, mockBookmarks } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.perfumeBookmark.findMany).mockResolvedValue(
        mockBookmarks.filter((b) => b.isPublic) as never
      );

      const result = await getUserPublicBookmarkedPerfumesService(ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1);
        expect(result.data[0].nameKo).toBe("샤넬 넘버5");
      }
    });

    it("isPublic=true인 북마크만 조회되어야 한다", async () => {
      const { ids, mockUser, mockBookmarks } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.perfumeBookmark.findMany).mockResolvedValue(
        mockBookmarks.filter((b) => b.isPublic) as never
      );

      const result = await getUserPublicBookmarkedPerfumesService(ids.userId);

      expect(result.success).toBe(true);
      expect(prisma.perfumeBookmark.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isPublic: true,
          }),
        })
      );
    });

    it("존재하지 않는 사용자는 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await getUserPublicBookmarkedPerfumesService(ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
        expect(result.message).toContain("사용자");
      }
    });

    it("생성일 기준 내림차순 정렬이어야 한다", async () => {
      const { ids, mockUser, mockBookmarks } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.perfumeBookmark.findMany).mockResolvedValue(
        mockBookmarks.filter((b) => b.isPublic) as never
      );

      await getUserPublicBookmarkedPerfumesService(ids.userId);

      expect(prisma.perfumeBookmark.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: "desc" },
        })
      );
    });
  });

  describe("getUserCollectionsService", () => {
    it("사용자 컬렉션을 조회해야 한다", async () => {
      const { ids, mockUser, mockCollections } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.userCollection.findMany).mockResolvedValue(
        mockCollections as never
      );

      const result = await getUserCollectionsService(ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1);
        expect(result.data[0].perfumeId).toBe(ids.perfumeId);
      }
    });

    it("존재하지 않는 사용자는 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await getUserCollectionsService(ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
        expect(result.message).toContain("사용자");
      }
    });

    it("이미지와 향수 정보가 포함되어야 한다", async () => {
      const { ids, mockUser, mockCollections } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.userCollection.findMany).mockResolvedValue(
        mockCollections as never
      );

      const result = await getUserCollectionsService(ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data[0].image).toBeDefined();
        expect(result.data[0].perfumeId).toBeDefined();
        expect(result.data[0].image?.imageUrl).toBe(
          "https://example.com/collection.jpg"
        );
        expect(result.data[0].perfume.nameKo).toBe("샤넬 넘버5");
      }
      expect(prisma.userCollection.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: {
            image: true,
            perfume: true,
          },
        })
      );
    });
  });

  describe("에러 처리", () => {
    it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.user.findUnique).mockRejectedValue(
        new Error("Database connection failed")
      );

      const result = await getUserProfileService(ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });
  });
});
