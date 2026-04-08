import { describe, it, expect, beforeEach, vi } from "vitest";
import { earnPointsService } from "../point";
import { prisma } from "@/server/prisma";
import { PointActivityType } from "@prisma/client";

/**
 * 포인트 적립 서비스 테스트 (MVP)
 *
 * 테스트 전략:
 * - 핵심 비즈니스 로직만 검증
 * - 트랜잭션 일관성 확인
 *
 * 주요 시나리오:
 * 1. 정상 포인트 적립 (활동 타입별)
 * 2. 커스텀 description 처리
 * 3. referenceId 저장
 * 4. 에러 처리 (사용자 없음, 유효하지 않은 활동 타입)
 */

// 타입 정의
interface PointHistoryCreateArgs {
  data: {
    userId: string;
    pointAmount: number;
    activityType: PointActivityType;
    referenceId?: string;
    description: string | null;
  };
}

// Mock prisma
vi.mock("@/server/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    pointHistory: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

describe("earnPointsService", () => {
  const TEST_USER_ID = "test-user";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("활동 타입별 포인트 금액 검증", () => {
    const testCases = [
      {
        activityType: PointActivityType.CREATE_POST,
        expectedPoints: 5,
        referenceId: "post-123",
        label: "게시물 작성",
      },
      {
        activityType: PointActivityType.CREATE_COMMENT,
        expectedPoints: 1,
        referenceId: "comment-456",
        label: "댓글 작성",
      },
      {
        activityType: PointActivityType.LIKE_POST,
        expectedPoints: 1,
        referenceId: "post-789",
        label: "좋아요",
      },
    ];

    it.each(testCases)(
      "$label 시 $expectedPoints포인트가 적립되어야 한다",
      async ({ activityType, expectedPoints, referenceId }) => {
        const initialPoints = 100;
        const expectedTotal = initialPoints + expectedPoints;

        (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
          id: TEST_USER_ID,
        });

        (prisma.$transaction as ReturnType<typeof vi.fn>).mockImplementation(
          async (callback) => {
            await callback({
              pointHistory: { create: vi.fn() },
              user: {
                update: vi.fn().mockResolvedValue({ totalPoints: expectedTotal }),
              },
            });
            return { totalPoints: expectedTotal };
          }
        );

        const result = await earnPointsService(TEST_USER_ID, activityType, referenceId);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.pointAmount).toBe(expectedPoints);
          expect(result.data.totalPoints).toBe(expectedTotal);
        }
      }
    );
  });

  describe("커스텀 description", () => {
    it("커스텀 description이 제공되면 사용해야 한다", async () => {
      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: TEST_USER_ID,
      });

      let capturedDescription: string | null | undefined;

      (prisma.$transaction as ReturnType<typeof vi.fn>).mockImplementation(
        async (callback) => {
          const mockTx = {
            pointHistory: {
              create: vi
                .fn()
                .mockImplementation((args: PointHistoryCreateArgs) => {
                  capturedDescription = args.data.description;
                }),
            },
            user: {
              update: vi.fn().mockResolvedValue({ totalPoints: 105 }),
            },
          };
          await callback(mockTx);
          return { totalPoints: 105 };
        }
      );

      const customDescription = "특별 이벤트 게시물 작성";
      await earnPointsService(
        TEST_USER_ID,
        PointActivityType.CREATE_POST,
        "post-123",
        customDescription
      );

      expect(capturedDescription).toBe(customDescription);
    });

    it("커스텀 description이 없으면 기본 설명을 사용해야 한다", async () => {
      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: TEST_USER_ID,
      });

      let capturedDescription: string | null | undefined;

      (prisma.$transaction as ReturnType<typeof vi.fn>).mockImplementation(
        async (callback) => {
          const mockTx = {
            pointHistory: {
              create: vi
                .fn()
                .mockImplementation((args: PointHistoryCreateArgs) => {
                  capturedDescription = args.data.description;
                }),
            },
            user: {
              update: vi.fn().mockResolvedValue({ totalPoints: 105 }),
            },
          };
          await callback(mockTx);
          return { totalPoints: 105 };
        }
      );

      await earnPointsService(
        TEST_USER_ID,
        PointActivityType.CREATE_POST,
        "post-123"
      );

      expect(capturedDescription).toBe("새 게시물 작성");
    });
  });

  describe("referenceId 저장", () => {
    it("referenceId가 제공되면 저장되어야 한다", async () => {
      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: TEST_USER_ID,
      });

      let capturedReferenceId: string | undefined;

      (prisma.$transaction as ReturnType<typeof vi.fn>).mockImplementation(
        async (callback) => {
          const mockTx = {
            pointHistory: {
              create: vi
                .fn()
                .mockImplementation((args: PointHistoryCreateArgs) => {
                  capturedReferenceId = args.data.referenceId;
                }),
            },
            user: {
              update: vi.fn().mockResolvedValue({ totalPoints: 105 }),
            },
          };
          await callback(mockTx);
          return { totalPoints: 105 };
        }
      );

      const referenceId = "post-999";
      await earnPointsService(
        TEST_USER_ID,
        PointActivityType.CREATE_POST,
        referenceId
      );

      expect(capturedReferenceId).toBe(referenceId);
    });
  });

  describe("트랜잭션 일관성", () => {
    it("포인트 이력 생성과 총 포인트 업데이트가 트랜잭션으로 처리되어야 한다", async () => {
      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: TEST_USER_ID,
      });

      const createSpy = vi.fn();
      const updateSpy = vi.fn().mockResolvedValue({ totalPoints: 105 });

      (prisma.$transaction as ReturnType<typeof vi.fn>).mockImplementation(
        async (callback) => {
          const mockTx = {
            pointHistory: { create: createSpy },
            user: { update: updateSpy },
          };
          await callback(mockTx);
          return { totalPoints: 105 };
        }
      );

      await earnPointsService(
        TEST_USER_ID,
        PointActivityType.CREATE_POST,
        "post-123"
      );

      // 둘 다 호출되었는지 확인
      expect(createSpy).toHaveBeenCalledOnce();
      expect(updateSpy).toHaveBeenCalledOnce();

      // 업데이트 호출이 increment를 사용하는지 확인
      expect(updateSpy).toHaveBeenCalledWith({
        where: { id: TEST_USER_ID },
        data: {
          totalPoints: {
            increment: 5,
          },
        },
        select: {
          totalPoints: true,
        },
      });
    });
  });

  describe("에러 처리", () => {
    it("존재하지 않는 사용자는 NOT_FOUND 에러를 반환해야 한다", async () => {
      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(
        null
      );

      const result = await earnPointsService(
        TEST_USER_ID,
        PointActivityType.CREATE_POST
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe("사용자를 찾을 수 없습니다.");
      }

      // 트랜잭션이 호출되지 않았는지 확인
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it("유효하지 않은 활동 타입은 BAD_REQUEST 에러를 반환해야 한다", async () => {
      const result = await earnPointsService(
        TEST_USER_ID,
        "INVALID_TYPE" as PointActivityType
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("BAD_REQUEST");
        expect(result.message).toBe("유효하지 않은 활동 타입입니다.");
      }

      // 사용자 조회조차 하지 않았는지 확인
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error("Database connection failed")
      );

      const result = await earnPointsService(
        TEST_USER_ID,
        PointActivityType.CREATE_POST
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });
  });
});
