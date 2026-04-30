import { describe, it, expect, beforeEach, vi } from "vitest";
import { prisma } from "@/server/prisma";
import {
  getPerfumesListService,
  getPerfumesListByThemeService,
  getPerfumeByIdService,
  getPostsTaggedWithPerfumeService,
  togglePerfumeBookmarkService,
  togglePerfumeLikeService,
  getAllNotesService,
  getAllAccordsService,
} from "../perfume.service";
import { getTestData } from "./helpers/perfume.test.helpers";

/**
 * Perfume 서비스 테스트 (MVP)
 *
 * 테스트 전략:
 * - 향수 CRUD 핵심 로직 검증
 * - 북마크/좋아요 토글 로직 확인
 * - 페이지네이션 검증
 * - 에러 처리
 *
 * 주요 시나리오:
 * 1. 향수 목록 조회 (nameKo 오름차순)
 * 2. 테마별 향수 조회 (MVP: mostLike - 좋아요 많은 순)
 * 3. ID로 향수 상세 조회 (존재/미존재)
 * 4. 북마크 토글 (추가/삭제)
 * 5. 좋아요 토글 (추가/삭제)
 * 6. 태그된 게시글 조회 (커서 페이지네이션)
 * 7. 노트/어코드 전체 목록 조회
 */

// Mock prisma
vi.mock("@/server/prisma", () => ({
  prisma: {
    perfume: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    perfumeBookmark: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    perfumeLike: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    postPerfumeMapping: {
      findMany: vi.fn(),
    },
    perfumeNote: {
      findMany: vi.fn(),
    },
    perfumeAccord: {
      findMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

describe("Perfume Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPerfumesListService", () => {
    it("모든 향수 목록을 조회해야 한다", async () => {
      const { mockPerfumes } = getTestData();

      vi.mocked(prisma.perfume.findMany).mockResolvedValue(
        mockPerfumes(10) as never
      );

      const result = await getPerfumesListService();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(10);
      }
    });

    it("nameKo 기준 오름차순 정렬이어야 한다", async () => {
      const { mockPerfumes } = getTestData();

      vi.mocked(prisma.perfume.findMany).mockResolvedValue(
        mockPerfumes(5) as never
      );

      await getPerfumesListService();

      expect(prisma.perfume.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { nameKo: "asc" },
        })
      );
    });
  });

  describe("getPerfumesListByThemeService", () => {
    it("mostLike 테마로 좋아요 많은 순으로 향수 목록을 조회해야 한다", async () => {
      const { mockPerfumes } = getTestData();

      vi.mocked(prisma.perfume.findMany).mockResolvedValue(
        mockPerfumes(5) as never
      );

      const result = await getPerfumesListByThemeService("mostLike");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(5);
      }
      expect(prisma.perfume.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { likedByUsers: { _count: "desc" } },
          take: 5,
        })
      );
    });

    it("mostLike가 아닌 테마는 기본 정렬(nameKo asc)로 조회해야 한다", async () => {
      const { mockPerfumes } = getTestData();

      vi.mocked(prisma.perfume.findMany).mockResolvedValue(
        mockPerfumes(5) as never
      );

      const result = await getPerfumesListByThemeService("플로럴");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(5);
      }
      expect(prisma.perfume.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { nameKo: "asc" },
          take: 5,
        })
      );
    });

    it("5개로 제한되어야 한다", async () => {
      const { mockPerfumes } = getTestData();

      vi.mocked(prisma.perfume.findMany).mockResolvedValue(
        mockPerfumes(5) as never
      );

      await getPerfumesListByThemeService("mostLike");

      expect(prisma.perfume.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
        })
      );
    });

    it("빈 문자열 테마는 기본 정렬로 조회해야 한다", async () => {
      const { mockPerfumes } = getTestData();

      vi.mocked(prisma.perfume.findMany).mockResolvedValue(
        mockPerfumes(3) as never
      );

      const result = await getPerfumesListByThemeService("");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(3);
      }
      expect(prisma.perfume.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { nameKo: "asc" },
        })
      );
    });

    it("perfumeBaseInclude가 포함되어야 한다", async () => {
      const { mockPerfumes } = getTestData();

      vi.mocked(prisma.perfume.findMany).mockResolvedValue(
        mockPerfumes(5) as never
      );

      await getPerfumesListByThemeService("mostLike");

      expect(prisma.perfume.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.any(Object),
        })
      );
    });
  });

  describe("getPerfumeByIdService", () => {
    it("ID로 향수 상세 정보를 조회해야 한다", async () => {
      const { ids, mockFullPerfume } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(
        mockFullPerfume as never
      );

      const result = await getPerfumeByIdService(ids.perfumeId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(ids.perfumeId);
        expect(result.data.nameKo).toBe("샤넬 No.5");
      }
    });

    it("존재하지 않는 향수는 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(null);

      const result = await getPerfumeByIdService(ids.perfumeId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
        expect(result.message).toContain("향수");
      }
    });

    it("모든 관련 데이터(브랜드, 노트, 어코드 등)가 포함되어야 한다", async () => {
      const { ids, mockFullPerfume } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(
        mockFullPerfume as never
      );

      const result = await getPerfumeByIdService(ids.perfumeId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveProperty("brand");
        expect(result.data).toHaveProperty("noteMappings");
        expect(result.data).toHaveProperty("accordMappings");
        expect(result.data).toHaveProperty("perfumeImage");
      }
    });
  });

  describe("getPostsTaggedWithPerfumeService", () => {
    it("향수가 태그된 게시글 목록을 조회해야 한다", async () => {
      const { ids, mockPerfume, mockPostPerfumeMappings } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(
        mockPerfume as never
      );
      vi.mocked(prisma.postPerfumeMapping.findMany).mockResolvedValue(
        mockPostPerfumeMappings(5) as never
      );

      const result = await getPostsTaggedWithPerfumeService(ids.perfumeId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(5);
      }
    });

    it("커서 기반 페이지네이션이 작동해야 한다", async () => {
      const { ids, mockPerfume, mockPostPerfumeMappings } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(
        mockPerfume as never
      );
      vi.mocked(prisma.postPerfumeMapping.findMany).mockResolvedValue(
        mockPostPerfumeMappings(11) as never
      );

      const result = await getPostsTaggedWithPerfumeService(ids.perfumeId, {
        limit: 10,
        cursor: "mapping-5",
      });

      expect(result.success).toBe(true);
      expect(prisma.postPerfumeMapping.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 11,
          cursor: { id: "mapping-5" },
        })
      );
    });

    it("존재하지 않는 향수는 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(null);

      const result = await getPostsTaggedWithPerfumeService(ids.perfumeId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
        expect(result.message).toContain("향수");
      }
    });

    it("생성일 기준 내림차순 정렬이어야 한다", async () => {
      const { ids, mockPerfume, mockPostPerfumeMappings } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(
        mockPerfume as never
      );
      vi.mocked(prisma.postPerfumeMapping.findMany).mockResolvedValue(
        mockPostPerfumeMappings(3) as never
      );

      await getPostsTaggedWithPerfumeService(ids.perfumeId);

      expect(prisma.postPerfumeMapping.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: "desc" },
        })
      );
    });
  });

  describe("togglePerfumeBookmarkService", () => {
    it("북마크 추가 시 북마크 레코드가 생성되어야 한다", async () => {
      const { ids, mockPerfume, mockUser } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(
        mockPerfume as never
      );
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.perfumeBookmark.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.perfumeBookmark.create).mockResolvedValue({} as never);

      const result = await togglePerfumeBookmarkService(
        ids.perfumeId,
        ids.userId
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.bookmarked).toBe(true);
      }
      expect(prisma.perfumeBookmark.create).toHaveBeenCalledWith({
        data: { perfumeId: ids.perfumeId, userId: ids.userId },
      });
    });

    it("북마크 취소 시 북마크 레코드가 삭제되어야 한다", async () => {
      const { ids, mockPerfume, mockUser, mockBookmark } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(
        mockPerfume as never
      );
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.perfumeBookmark.findUnique).mockResolvedValue(
        mockBookmark as never
      );
      vi.mocked(prisma.perfumeBookmark.delete).mockResolvedValue({} as never);

      const result = await togglePerfumeBookmarkService(
        ids.perfumeId,
        ids.userId
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.bookmarked).toBe(false);
      }
      expect(prisma.perfumeBookmark.delete).toHaveBeenCalledWith({
        where: { id: mockBookmark.id },
      });
    });

    it("북마크 상태(bookmarked)를 반환해야 한다", async () => {
      const { ids, mockPerfume, mockUser } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(
        mockPerfume as never
      );
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.perfumeBookmark.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.perfumeBookmark.create).mockResolvedValue({} as never);

      const result = await togglePerfumeBookmarkService(
        ids.perfumeId,
        ids.userId
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveProperty("bookmarked");
        expect(typeof result.data.bookmarked).toBe("boolean");
      }
    });

    it("존재하지 않는 향수는 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { ids, mockUser } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      const result = await togglePerfumeBookmarkService(
        ids.perfumeId,
        ids.userId
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
        expect(result.message).toContain("향수");
      }
    });

    it("존재하지 않는 사용자는 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { ids, mockPerfume } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(
        mockPerfume as never
      );
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await togglePerfumeBookmarkService(
        ids.perfumeId,
        ids.userId
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
        expect(result.message).toContain("사용자");
      }
    });
  });

  describe("togglePerfumeLikeService", () => {
    it("좋아요 추가 시 좋아요 레코드가 생성되어야 한다", async () => {
      const { ids, mockPerfume, mockUser } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(
        mockPerfume as never
      );
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.perfumeLike.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.perfumeLike.create).mockResolvedValue({} as never);

      const result = await togglePerfumeLikeService(ids.perfumeId, ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.liked).toBe(true);
      }
      expect(prisma.perfumeLike.create).toHaveBeenCalledWith({
        data: { perfumeId: ids.perfumeId, userId: ids.userId },
      });
    });

    it("좋아요 취소 시 좋아요 레코드가 삭제되어야 한다", async () => {
      const { ids, mockPerfume, mockUser, mockLike } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(
        mockPerfume as never
      );
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.perfumeLike.findUnique).mockResolvedValue(
        mockLike as never
      );
      vi.mocked(prisma.perfumeLike.delete).mockResolvedValue({} as never);

      const result = await togglePerfumeLikeService(ids.perfumeId, ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.liked).toBe(false);
      }
      expect(prisma.perfumeLike.delete).toHaveBeenCalledWith({
        where: { id: mockLike.id },
      });
    });

    it("좋아요 상태(liked)를 반환해야 한다", async () => {
      const { ids, mockPerfume, mockUser } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(
        mockPerfume as never
      );
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.perfumeLike.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.perfumeLike.create).mockResolvedValue({} as never);

      const result = await togglePerfumeLikeService(ids.perfumeId, ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveProperty("liked");
        expect(typeof result.data.liked).toBe("boolean");
      }
    });

    it("존재하지 않는 향수는 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { ids, mockUser } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      const result = await togglePerfumeLikeService(ids.perfumeId, ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
        expect(result.message).toContain("향수");
      }
    });

    it("존재하지 않는 사용자는 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { ids, mockPerfume } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(
        mockPerfume as never
      );
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await togglePerfumeLikeService(ids.perfumeId, ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
        expect(result.message).toContain("사용자");
      }
    });
  });

  describe("getAllNotesService", () => {
    it("모든 향수 노트 목록을 조회해야 한다", async () => {
      const { mockNotes } = getTestData();

      vi.mocked(prisma.perfumeNote.findMany).mockResolvedValue(
        mockNotes as never
      );

      const result = await getAllNotesService();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(3);
        expect(result.data[0]).toHaveProperty("nameKo");
        expect(result.data[0]).toHaveProperty("nameEn");
      }
    });

    it("id, nameEn, nameKo 필드만 포함되어야 한다", async () => {
      const { mockNotes } = getTestData();

      vi.mocked(prisma.perfumeNote.findMany).mockResolvedValue(
        mockNotes as never
      );

      await getAllNotesService();

      expect(prisma.perfumeNote.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
        },
      });
    });
  });

  describe("getAllAccordsService", () => {
    it("모든 향수 어코드 목록을 조회해야 한다", async () => {
      const { mockAccords } = getTestData();

      vi.mocked(prisma.perfumeAccord.findMany).mockResolvedValue(
        mockAccords as never
      );

      const result = await getAllAccordsService();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(3);
        expect(result.data[0]).toHaveProperty("nameKo");
        expect(result.data[0]).toHaveProperty("nameEn");
      }
    });

    it("id, nameEn, nameKo 필드만 포함되어야 한다", async () => {
      const { mockAccords } = getTestData();

      vi.mocked(prisma.perfumeAccord.findMany).mockResolvedValue(
        mockAccords as never
      );

      await getAllAccordsService();

      expect(prisma.perfumeAccord.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          nameEn: true,
          nameKo: true,
        },
      });
    });
  });

  describe("에러 처리", () => {
    it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      vi.mocked(prisma.perfume.findMany).mockRejectedValue(
        new Error("Database connection failed")
      );

      const result = await getPerfumesListService();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });
  });
});
