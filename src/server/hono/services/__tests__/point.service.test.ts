import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PointActivityType } from "@prisma/client";
import { prisma } from "@/server/prisma";
import {
  validateTimestamp,
  getPointHistoryService,
  getUserPointsService,
  getPointStatisticsService,
} from "../point.service";

// Mock prisma (validateTimestamp는 순수 함수라 영향 없음)
vi.mock("@/server/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    pointHistory: {
      findMany: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
  },
}));

/**
 * validateTimestamp 함수 테스트
 *
 * 테스트 전략:
 * - 중복 로직을 배열과 forEach로 통합하여 간결성 확보
 * - 기본 윈도우(5분)와 커스텀 윈도우를 분리하여 검증
 * - 경계값(±1ms)을 명시적으로 테스트
 * - vi.setSystemTime()을 사용하여 시간 고정
 *
 * 주요 시나리오:
 * 1. 기본 윈도우 (5분 이내 유효성 검증)
 * 2. 커스텀 윈도우 (다양한 시간 범위 검증)
 * 3. 경계값 테스트 (정확한 경계에서의 동작 검증)
 */

describe("Point Service - validateTimestamp", () => {
  const FIVE_MINUTES = 5 * 60 * 1000;
  const FIXED_TIME = new Date("2025-11-21T00:00:00.000Z");

  beforeEach(() => {
    // 시스템 시간을 고정
    vi.setSystemTime(FIXED_TIME);
  });

  afterEach(() => {
    // 시스템 시간 복원
    vi.useRealTimers();
  });

  describe("기본 윈도우 (5분)", () => {
    it("5분 미만 시간은 유효해야 한다", () => {
      const now = FIXED_TIME.getTime();
      const testCases = [
        new Date(now), // 현재
        new Date(now - 4 * 60 * 1000), // 4분 전
        new Date(now + 4 * 60 * 1000), // 4분 후
        new Date(now - (FIVE_MINUTES - 1)), // 5분 - 1ms 전
        new Date(now + (FIVE_MINUTES - 1)), // 5분 - 1ms 후
      ];

      testCases.forEach((timestamp) => {
        expect(validateTimestamp(timestamp)).toBe(true);
      });
    });

    it("5분 이상 시간은 유효하지 않아야 한다", () => {
      const now = FIXED_TIME.getTime();
      const testCases = [
        new Date(now - FIVE_MINUTES), // 정확히 5분 전
        new Date(now + FIVE_MINUTES), // 정확히 5분 후
        new Date(now - 6 * 60 * 1000), // 6분 전
        new Date(now + 6 * 60 * 1000), // 6분 후
        new Date(now - 60 * 60 * 1000), // 1시간 전
        new Date(now - 24 * 60 * 60 * 1000), // 1일 전
      ];

      testCases.forEach((timestamp) => {
        expect(validateTimestamp(timestamp)).toBe(false);
      });
    });
  });

  describe("커스텀 윈도우", () => {
    it("커스텀 윈도우 이내는 유효해야 한다", () => {
      const now = FIXED_TIME.getTime();
      const testCases = [
        {
          timestamp: new Date(now - 9 * 60 * 1000),
          window: 10 * 60 * 1000,
        }, // 10분 윈도우에서 9분 전
        { timestamp: new Date(now - 20 * 1000), window: 30 * 1000 }, // 30초 윈도우에서 20초 전
      ];

      testCases.forEach(({ timestamp, window }) => {
        expect(validateTimestamp(timestamp, window)).toBe(true);
      });
    });

    it("커스텀 윈도우 초과는 유효하지 않아야 한다", () => {
      const now = FIXED_TIME.getTime();
      const testCases = [
        {
          timestamp: new Date(now - 11 * 60 * 1000),
          window: 10 * 60 * 1000,
        }, // 10분 윈도우에서 11분 전
        {
          timestamp: new Date(now - 2 * 60 * 1000),
          window: 1 * 60 * 1000,
        }, // 1분 윈도우에서 2분 전
      ];

      testCases.forEach(({ timestamp, window }) => {
        expect(validateTimestamp(timestamp, window)).toBe(false);
      });
    });
  });

  describe("경계값", () => {
    it("정확히 경계값에서 ±1ms 검증", () => {
      const now = FIXED_TIME.getTime();
      const boundary = FIVE_MINUTES;

      expect(validateTimestamp(new Date(now - boundary))).toBe(false); // 5분 정확히 (유효하지 않음)
      expect(validateTimestamp(new Date(now + boundary))).toBe(false); // 5분 정확히 (미래, 유효하지 않음)
      expect(validateTimestamp(new Date(now - (boundary + 1)))).toBe(false); // 5분 + 1ms (유효하지 않음)
      expect(validateTimestamp(new Date(now - (boundary - 1)))).toBe(true); // 5분 - 1ms (유효함, 4분 59초 999ms)
    });
  });
});

describe("getPointHistoryService", () => {
  const TEST_USER_ID = "test-user-123";

  const makeHistoryItem = (id: string) => ({
    id,
    userId: TEST_USER_ID,
    pointAmount: 5,
    activityType: PointActivityType.CREATE_POST,
    referenceId: null,
    description: "게시물 작성",
    createdAt: new Date(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("포인트 이력을 페이지네이션하여 반환해야 한다", async () => {
    const items = Array.from({ length: 5 }, (_, i) => makeHistoryItem(`history-${i}`));

    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: TEST_USER_ID } as never);
    vi.mocked(prisma.pointHistory.findMany).mockResolvedValue(items as never);
    vi.mocked(prisma.pointHistory.count).mockResolvedValue(5);

    const result = await getPointHistoryService(TEST_USER_ID, { limit: 10 });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.histories).toHaveLength(5);
      expect(result.data.totalCount).toBe(5);
    }
  });

  it("limit+1 조회로 다음 페이지 여부를 확인해야 한다 (nextCursor 있음)", async () => {
    // limit=5 요청 → 6개 반환 → hasNextPage=true
    const items = Array.from({ length: 6 }, (_, i) => makeHistoryItem(`history-${i}`));

    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: TEST_USER_ID } as never);
    vi.mocked(prisma.pointHistory.findMany).mockResolvedValue(items as never);
    vi.mocked(prisma.pointHistory.count).mockResolvedValue(10);

    const result = await getPointHistoryService(TEST_USER_ID, { limit: 5 });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.histories).toHaveLength(5); // 마지막 1개 제거
      expect(result.data.nextCursor).toBe("history-4"); // 5번째 항목 id
    }
    expect(prisma.pointHistory.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 6 }) // limit + 1
    );
  });

  it("마지막 페이지에서는 nextCursor가 null이어야 한다", async () => {
    const items = Array.from({ length: 3 }, (_, i) => makeHistoryItem(`history-${i}`));

    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: TEST_USER_ID } as never);
    vi.mocked(prisma.pointHistory.findMany).mockResolvedValue(items as never);
    vi.mocked(prisma.pointHistory.count).mockResolvedValue(3);

    const result = await getPointHistoryService(TEST_USER_ID, { limit: 5 });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.nextCursor).toBeNull();
    }
  });

  it("cursor가 있으면 해당 id 미만의 이력을 조회해야 한다", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: TEST_USER_ID } as never);
    vi.mocked(prisma.pointHistory.findMany).mockResolvedValue([] as never);
    vi.mocked(prisma.pointHistory.count).mockResolvedValue(0);

    await getPointHistoryService(TEST_USER_ID, { cursor: "cursor-id" });

    expect(prisma.pointHistory.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: { lt: "cursor-id" },
        }),
      })
    );
  });

  it("activityType 필터가 적용되어야 한다", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: TEST_USER_ID } as never);
    vi.mocked(prisma.pointHistory.findMany).mockResolvedValue([] as never);
    vi.mocked(prisma.pointHistory.count).mockResolvedValue(0);

    await getPointHistoryService(TEST_USER_ID, {
      activityType: PointActivityType.CREATE_POST,
    });

    expect(prisma.pointHistory.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          activityType: PointActivityType.CREATE_POST,
        }),
      })
    );
  });

  it("존재하지 않는 사용자는 NOT_FOUND를 반환해야 한다", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const result = await getPointHistoryService(TEST_USER_ID);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("NOT_FOUND");
    }
  });

  it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
    vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error("Database error"));

    const result = await getPointHistoryService(TEST_USER_ID);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("INTERNAL_ERROR");
    }
  });
});

describe("getUserPointsService", () => {
  const TEST_USER_ID = "test-user-123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("totalPoints와 consecutiveLoginDays를 반환해야 한다", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      totalPoints: 350,
      consecutiveLoginDays: 5,
    } as never);

    const result = await getUserPointsService(TEST_USER_ID);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.totalPoints).toBe(350);
      expect(result.data.consecutiveLoginDays).toBe(5);
    }
  });

  it("존재하지 않는 사용자는 NOT_FOUND를 반환해야 한다", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const result = await getUserPointsService(TEST_USER_ID);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("NOT_FOUND");
    }
  });

  it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
    vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error("Database error"));

    const result = await getUserPointsService(TEST_USER_ID);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("INTERNAL_ERROR");
    }
  });
});

describe("getPointStatisticsService", () => {
  const TEST_USER_ID = "test-user-123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("활동 타입별 포인트 통계를 반환해야 한다", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: TEST_USER_ID } as never);
    vi.mocked(prisma.pointHistory.groupBy).mockResolvedValue([
      {
        activityType: PointActivityType.CREATE_POST,
        _sum: { pointAmount: 15 },
        _count: { id: 3 },
      },
      {
        activityType: PointActivityType.CREATE_COMMENT,
        _sum: { pointAmount: 5 },
        _count: { id: 5 },
      },
    ] as never);

    const result = await getPointStatisticsService(TEST_USER_ID);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.statistics).toHaveLength(2);
      expect(result.data.statistics[0]).toEqual({
        activityType: PointActivityType.CREATE_POST,
        totalPoints: 15,
        count: 3,
      });
    }
  });

  it("_sum.pointAmount가 null이면 0으로 처리해야 한다", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: TEST_USER_ID } as never);
    vi.mocked(prisma.pointHistory.groupBy).mockResolvedValue([
      {
        activityType: PointActivityType.CREATE_COMMENT,
        _sum: { pointAmount: null },
        _count: { id: 1 },
      },
    ] as never);

    const result = await getPointStatisticsService(TEST_USER_ID);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.statistics[0].totalPoints).toBe(0);
    }
  });

  it("포인트 이력이 없으면 빈 statistics 배열을 반환해야 한다", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: TEST_USER_ID } as never);
    vi.mocked(prisma.pointHistory.groupBy).mockResolvedValue([] as never);

    const result = await getPointStatisticsService(TEST_USER_ID);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.statistics).toHaveLength(0);
    }
  });

  it("존재하지 않는 사용자는 NOT_FOUND를 반환해야 한다", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const result = await getPointStatisticsService(TEST_USER_ID);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("NOT_FOUND");
    }
  });

  it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
    vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error("Database error"));

    const result = await getPointStatisticsService(TEST_USER_ID);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("INTERNAL_ERROR");
    }
  });
});
