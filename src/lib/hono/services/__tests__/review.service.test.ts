import { describe, it, expect, beforeEach, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import type { PrismaClient } from "@prisma/client";
import {
  createReviewService,
  updateReviewService,
  deleteReviewService,
  getPopularReviewsService,
  toggleLikeService,
  getReviewsByPerfumeIdService,
  getPaginatedReviewsByPerfumeIdService,
  getOneRandomPopularReviewService,
} from "../review.service";

// Prisma Interactive Transaction 타입 정의
type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

/**
 * Review 서비스 테스트 (MVP)
 *
 * 테스트 전략:
 * - 리뷰 CRUD 핵심 로직 검증
 * - 복잡한 트랜잭션 (Review + ReviewAttributeSelection) 일관성 확인
 * - 비즈니스 제약 검증 (사용자당 향수별 리뷰 1개)
 * - 인기 리뷰 랜덤 알고리즘 검증
 *
 * 주요 시나리오:
 * 1. 리뷰 생성 (attribute selections, 중복 방지)
 * 2. 리뷰 수정 (속성 재처리, 부분 업데이트)
 * 3. 리뷰 삭제
 * 4. 인기 리뷰 조회 (랜덤 샘플링)
 * 5. 좋아요 토글
 * 6. 에러 처리
 */

// 테스트용 공통 데이터 헬퍼 함수
const getTestData = () => {
  const TEST_USER_ID = "123e4567-e89b-12d3-a456-426614174000";
  const TEST_PERFUME_ID = "223e4567-e89b-12d3-a456-426614174001";
  const TEST_REVIEW_ID = "323e4567-e89b-12d3-a456-426614174002";

  return {
    ids: {
      userId: TEST_USER_ID,
      perfumeId: TEST_PERFUME_ID,
      reviewId: TEST_REVIEW_ID,
    },
    mockUser: {
      id: TEST_USER_ID,
    },
    mockPerfume: {
      id: TEST_PERFUME_ID,
    },
    mockExistingReview: {
      id: "423e4567-e89b-12d3-a456-426614174003",
      perfumeId: TEST_PERFUME_ID,
      authorId: TEST_USER_ID,
    },
    createReviewInput: () => ({
      authorId: TEST_USER_ID,
      perfumeId: TEST_PERFUME_ID,
      content: "Great perfume!",
      usageStatus: "CURRENTLY_USING" as const,
      attributes: {
        feeling: "fresh",
        longevity: "long",
        sillage: "strong",
        genderTone: "unisex",
        season: ["spring", "summer"],
        timeOfDay: "daytime",
        pricePerception: "reasonable",
      },
    }),
    mockCreatedReview: () => ({
      id: TEST_REVIEW_ID,
      content: "Great perfume!",
      usageStatus: "CURRENTLY_USING",
      perfumeId: TEST_PERFUME_ID,
      authorId: TEST_USER_ID,
      createdAt: new Date(),
      author: {
        id: TEST_USER_ID,
        nickname: "TestUser",
        imageUrl: "test.jpg",
      },
      perfume: {
        id: TEST_PERFUME_ID,
        nameKo: "테스트 향수",
        nameEn: "Test Perfume",
        brand: {
          nameEn: "TestBrand",
          nameKo: "테스트브랜드",
          brandUrl: null,
        },
        perfumeImage: [{ imageUrl: "perfume.jpg" }],
      },
      attributeSelections: [],
    }),
    mockUpdatedReview: () => ({
      id: TEST_REVIEW_ID,
      content: "Updated content",
      usageStatus: "USED_BEFORE",
      perfumeId: TEST_PERFUME_ID,
      authorId: TEST_USER_ID,
      createdAt: new Date(),
      author: {
        id: TEST_USER_ID,
        nickname: "TestUser",
        imageUrl: "test.jpg",
      },
      perfume: {
        id: TEST_PERFUME_ID,
        nameKo: "테스트 향수",
        nameEn: "Test Perfume",
        brand: {
          nameEn: "TestBrand",
          nameKo: "테스트브랜드",
          brandUrl: null,
        },
        perfumeImage: [{ imageUrl: "perfume.jpg" }],
      },
      attributeSelections: [],
    }),
    mockReviews: (count: number) =>
      Array.from({ length: count }, (_, i) => ({
        id: `review-${i}`,
        content: `Review ${i}`,
        usageStatus: "CURRENTLY_USING",
        perfumeId: TEST_PERFUME_ID,
        authorId: TEST_USER_ID,
        createdAt: new Date(),
        author: {
          id: TEST_USER_ID,
          nickname: "TestUser",
          imageUrl: "test.jpg",
        },
        perfume: {
          id: TEST_PERFUME_ID,
          nameKo: "테스트 향수",
          nameEn: "Test Perfume",
          brand: {
            nameEn: "TestBrand",
            nameKo: "테스트브랜드",
            brandUrl: null,
          },
          perfumeImage: [{ imageUrl: "perfume.jpg" }],
        },
        attributeSelections: [],
      })),
    mockLike: {
      id: "523e4567-e89b-12d3-a456-426614174004",
      reviewId: TEST_REVIEW_ID,
      userId: TEST_USER_ID,
    },
  };
};

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    perfume: {
      findUnique: vi.fn(),
    },
    review: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    reviewAttributeSelection: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    reviewLike: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    attributeOption: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 1,
          value: "fresh",
          attribute: { key: "feeling" },
        },
        {
          id: 2,
          value: "long",
          attribute: { key: "longevity" },
        },
        {
          id: 3,
          value: "strong",
          attribute: { key: "sillage" },
        },
        {
          id: 4,
          value: "unisex",
          attribute: { key: "genderTone" },
        },
        {
          id: 5,
          value: "spring",
          attribute: { key: "season" },
        },
        {
          id: 6,
          value: "summer",
          attribute: { key: "season" },
        },
        {
          id: 7,
          value: "daytime",
          attribute: { key: "timeOfDay" },
        },
        {
          id: 8,
          value: "reasonable",
          attribute: { key: "pricePerception" },
        },
        {
          id: 9,
          value: "warm",
          attribute: { key: "feeling" },
        },
        {
          id: 10,
          value: "medium",
          attribute: { key: "longevity" },
        },
      ]),
    },
    $transaction: vi.fn(),
  },
}));

describe("Review Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createReviewService", () => {
    it("트랜잭션으로 리뷰와 attribute selections을 생성해야 한다", async () => {
      const {
        ids,
        mockUser,
        mockPerfume,
        createReviewInput,
        mockCreatedReview,
      } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(
        mockPerfume as never
      );
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.review.findFirst).mockResolvedValue(null);

      const createManySpy = vi.fn().mockResolvedValue({ count: 7 });

      vi.mocked(prisma.$transaction).mockImplementation(
        (async (callback: (tx: PrismaTransactionClient) => Promise<unknown>) => {
          return callback({
            review: {
              create: vi.fn().mockResolvedValue({
                id: ids.reviewId,
                content: "Great perfume!",
                usageStatus: "CURRENTLY_USING",
                perfumeId: ids.perfumeId,
                authorId: ids.userId,
              }),
              findUniqueOrThrow: vi.fn().mockResolvedValue(mockCreatedReview()),
            },
            reviewAttributeSelection: {
              createMany: createManySpy,
            },
          } as unknown as PrismaTransactionClient);
        }) as never
      );

      const result = await createReviewService(createReviewInput());

      expect(result.success).toBe(true);
      // attribute selections 생성이 호출되었는지 확인
      expect(createManySpy).toHaveBeenCalled();
    });

    it("중복 리뷰를 방지해야 한다 (동일 사용자 + 향수)", async () => {
      const { mockUser, mockPerfume, mockExistingReview, createReviewInput } =
        getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(
        mockPerfume as never
      );
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.review.findFirst).mockResolvedValue(
        mockExistingReview as never
      );

      const result = await createReviewService(createReviewInput());

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("ALREADY_EXISTS");
        expect(result.message).toContain("이미 이 향수에 대한 리뷰");
      }
    });

    it("존재하지 않는 사용자는 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { mockPerfume, createReviewInput } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(
        mockPerfume as never
      );
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await createReviewService(createReviewInput());

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
        expect(result.message).toContain("사용자");
      }
    });

    it("존재하지 않는 향수는 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { createReviewInput } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(null);

      const result = await createReviewService(createReviewInput());

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
        expect(result.message).toContain("향수");
      }
    });
  });

  describe("updateReviewService", () => {
    it("기존 attributes를 삭제하고 새로운 attributes를 트랜잭션으로 생성해야 한다", async () => {
      const { ids, mockExistingReview, mockUpdatedReview } = getTestData();

      vi.mocked(prisma.review.findFirst).mockResolvedValue(
        mockExistingReview as never
      );

      const deleteManySpy = vi.fn().mockResolvedValue({ count: 5 });
      const createManySpy = vi.fn().mockResolvedValue({ count: 7 });

      vi.mocked(prisma.$transaction).mockImplementation(
        (async (callback: (tx: PrismaTransactionClient) => Promise<unknown>) => {
          return callback({
            review: {
              update: vi.fn().mockResolvedValue({}),
              findUniqueOrThrow: vi.fn().mockResolvedValue(mockUpdatedReview()),
            },
            reviewAttributeSelection: {
              deleteMany: deleteManySpy,
              createMany: createManySpy,
            },
          } as unknown as PrismaTransactionClient);
        }) as never
      );

      const result = await updateReviewService(ids.reviewId, ids.userId, {
        content: "Updated content",
        attributes: {
          feeling: "warm",
          longevity: "medium",
        },
      });

      expect(result.success).toBe(true);
      expect(deleteManySpy).toHaveBeenCalledWith({
        where: { reviewId: ids.reviewId },
      });
      expect(createManySpy).toHaveBeenCalled();
    });

    it("존재하지 않는 리뷰 또는 작성자가 아닌 경우 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.review.findFirst).mockResolvedValue(null);

      const result = await updateReviewService(ids.reviewId, ids.userId, {
        content: "test",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
      }
    });
  });

  describe("deleteReviewService", () => {
    it("작성자가 리뷰를 삭제할 수 있어야 한다", async () => {
      const { ids, mockExistingReview } = getTestData();

      vi.mocked(prisma.review.findFirst).mockResolvedValue(
        mockExistingReview as never
      );
      vi.mocked(prisma.review.delete).mockResolvedValue({} as never);

      const result = await deleteReviewService(ids.reviewId, ids.userId);

      expect(result.success).toBe(true);
      expect(prisma.review.delete).toHaveBeenCalledWith({
        where: { id: ids.reviewId },
      });
    });

    it("존재하지 않는 리뷰 또는 작성자가 아닌 경우 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.review.findFirst).mockResolvedValue(null);

      const result = await deleteReviewService(ids.reviewId, ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
      }
    });
  });

  describe("getPopularReviewsService", () => {
    it("좋아요 수 기준 상위 20개를 조회하고 랜덤으로 5개를 반환해야 한다", async () => {
      const { mockReviews } = getTestData();

      vi.mocked(prisma.review.findMany).mockResolvedValue(
        mockReviews(20).map((r) => ({ ...r, _count: { likes: 10 } })) as never
      );

      const result = await getPopularReviewsService();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.length).toBe(5);
        expect(prisma.review.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            take: 20,
            orderBy: { likes: { _count: "desc" } },
          })
        );
      }
    });
  });

  describe("toggleLikeService", () => {
    it("좋아요를 추가해야 한다", async () => {
      const { ids, mockUser, mockExistingReview } = getTestData();

      vi.mocked(prisma.review.findUnique).mockResolvedValue(
        mockExistingReview as never
      );
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.reviewLike.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.reviewLike.create).mockResolvedValue({} as never);

      const result = await toggleLikeService(ids.reviewId, ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.liked).toBe(true);
      }
      expect(prisma.reviewLike.create).toHaveBeenCalledWith({
        data: { reviewId: ids.reviewId, userId: ids.userId },
      });
    });

    it("좋아요를 삭제해야 한다", async () => {
      const { ids, mockUser, mockExistingReview, mockLike } = getTestData();

      vi.mocked(prisma.review.findUnique).mockResolvedValue(
        mockExistingReview as never
      );
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.reviewLike.findUnique).mockResolvedValue(
        mockLike as never
      );
      vi.mocked(prisma.reviewLike.delete).mockResolvedValue({} as never);

      const result = await toggleLikeService(ids.reviewId, ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.liked).toBe(false);
      }
      expect(prisma.reviewLike.delete).toHaveBeenCalledWith({
        where: { id: mockLike.id },
      });
    });

    it("존재하지 않는 리뷰는 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.review.findUnique).mockResolvedValue(null);

      const result = await toggleLikeService(ids.reviewId, ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
      }
    });

    it("존재하지 않는 사용자는 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { ids, mockExistingReview } = getTestData();

      vi.mocked(prisma.review.findUnique).mockResolvedValue(
        mockExistingReview as never
      );
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await toggleLikeService(ids.reviewId, ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
      }
    });
  });

  describe("getReviewsByPerfumeIdService", () => {
    it("향수에 대한 모든 리뷰를 반환해야 한다", async () => {
      const { ids, mockPerfume, mockReviews } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(
        mockPerfume as never
      );
      vi.mocked(prisma.review.findMany).mockResolvedValue(
        mockReviews(1) as never
      );

      const result = await getReviewsByPerfumeIdService(ids.perfumeId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1);
        expect(prisma.review.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { perfumeId: ids.perfumeId },
          })
        );
      }
    });

    it("존재하지 않는 향수는 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(null);

      const result = await getReviewsByPerfumeIdService(ids.perfumeId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
      }
    });
  });

  describe("getPaginatedReviewsByPerfumeIdService", () => {
    it("커서 기반 페이지네이션이 정상 작동해야 한다", async () => {
      const { ids, mockPerfume, mockReviews } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(
        mockPerfume as never
      );
      vi.mocked(prisma.review.findMany).mockResolvedValue(
        mockReviews(13) as never
      );
      vi.mocked(prisma.review.count).mockResolvedValue(20);

      const result = await getPaginatedReviewsByPerfumeIdService(
        ids.perfumeId,
        { limit: 12 }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.data).toHaveLength(12);
        expect(prisma.review.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            take: 13,
          })
        );
      }
    });

    it("존재하지 않는 향수는 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.perfume.findUnique).mockResolvedValue(null);

      const result = await getPaginatedReviewsByPerfumeIdService(ids.perfumeId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
      }
    });
  });

  describe("getOneRandomPopularReviewService", () => {
    it("인기 리뷰 풀에서 랜덤으로 1개를 반환해야 한다", async () => {
      const { mockReviews } = getTestData();

      vi.mocked(prisma.review.findMany).mockResolvedValue(
        mockReviews(20).map((r) => ({ ...r, _count: { likes: 10 } })) as never
      );

      const result = await getOneRandomPopularReviewService();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveProperty("id");
        expect(result.data).toHaveProperty("content");
      }
    });
  });
});
