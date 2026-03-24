import { describe, it, expect, beforeEach, vi } from "vitest";
import { processConsecutiveLoginService } from "../point.service";
import { prisma } from "@/server/prisma";
import dayjs from "dayjs";

/**
 * 연속 로그인 서비스 테스트 (MVP)
 *
 * 테스트 전략:
 * - 핵심 비즈니스 로직만 검증
 * - 중복 제거 및 필수 케이스만 유지
 *
 * 주요 시나리오:
 * 1. 포인트 지급 기준 (2일, 3일, 7일)
 * 2. 연속 끊김 리셋
 * 3. 중복 로그인 방지
 * 4. 에러 처리
 */

// 테스트용 날짜 헬퍼 함수
const getTestDates = (baseDate = "2025-11-15") => ({
  today: dayjs(baseDate).toDate(),
  yesterday: dayjs(baseDate).subtract(1, "day").toDate(),
  twoDaysAgo: dayjs(baseDate).subtract(2, "day").toDate(),
  todayMorning: dayjs(`${baseDate}T09:00:00`).toDate(),
  todayAfternoon: dayjs(`${baseDate}T14:30:00`).toDate(),
  yesterdayBeforeMidnight: dayjs(baseDate)
    .subtract(1, "day")
    .hour(23)
    .minute(59)
    .second(0)
    .toDate(),
  todayAfterMidnight: dayjs(`${baseDate}T00:01:00`).toDate(),
});

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

describe("processConsecutiveLoginService", () => {
  const TEST_USER_ID = "test-user-123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("포인트 지급 로직", () => {
    it("첫 로그인 시 1일로 설정되고 포인트는 지급되지 않아야 한다", async () => {
      const { today } = getTestDates();

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        lastLoginDate: null,
        consecutiveLoginDays: 0,
        totalPoints: 100,
      });

      (prisma.$transaction as ReturnType<typeof vi.fn>).mockImplementation(
        async (callback) => await callback(prisma)
      );

      (prisma.user.update as ReturnType<typeof vi.fn>).mockResolvedValue({
        consecutiveLoginDays: 1,
        totalPoints: 100,
      });

      const result = await processConsecutiveLoginService(TEST_USER_ID, today);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pointAmount).toBe(0);
        expect(result.data.consecutiveLoginDays).toBe(1);
      }
    });

    it("2일 연속 로그인 시 1포인트가 지급되어야 한다", async () => {
      const { today, yesterday } = getTestDates();

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        lastLoginDate: yesterday,
        consecutiveLoginDays: 1,
        totalPoints: 100,
      });

      (prisma.$transaction as ReturnType<typeof vi.fn>).mockResolvedValue({
        pointAmount: 1,
        totalPoints: 101,
        consecutiveLoginDays: 2,
      });

      const result = await processConsecutiveLoginService(TEST_USER_ID, today);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pointAmount).toBe(1);
        expect(result.data.totalPoints).toBe(101);
        expect(result.data.consecutiveLoginDays).toBe(2);
      }
    });

    it("3일 연속 로그인 시 2포인트가 지급되어야 한다", async () => {
      const { today, yesterday } = getTestDates();

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        lastLoginDate: yesterday,
        consecutiveLoginDays: 2,
        totalPoints: 102,
      });

      (prisma.$transaction as ReturnType<typeof vi.fn>).mockResolvedValue({
        pointAmount: 2,
        totalPoints: 104,
        consecutiveLoginDays: 3,
      });

      const result = await processConsecutiveLoginService(TEST_USER_ID, today);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pointAmount).toBe(2);
        expect(result.data.consecutiveLoginDays).toBe(3);
      }
    });

    it("7일 연속 로그인 시 5포인트가 지급되어야 한다", async () => {
      const { today, yesterday } = getTestDates();

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        lastLoginDate: yesterday,
        consecutiveLoginDays: 6,
        totalPoints: 110,
      });

      (prisma.$transaction as ReturnType<typeof vi.fn>).mockResolvedValue({
        pointAmount: 5,
        totalPoints: 115,
        consecutiveLoginDays: 7,
      });

      const result = await processConsecutiveLoginService(TEST_USER_ID, today);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pointAmount).toBe(5);
        expect(result.data.consecutiveLoginDays).toBe(7);
      }
    });

    it("14일 연속 로그인 시 5포인트가 지급되어야 한다 (7의 배수)", async () => {
      const { today, yesterday } = getTestDates();

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        lastLoginDate: yesterday,
        consecutiveLoginDays: 13,
        totalPoints: 130,
      });

      (prisma.$transaction as ReturnType<typeof vi.fn>).mockResolvedValue({
        pointAmount: 5,
        totalPoints: 135,
        consecutiveLoginDays: 14,
      });

      const result = await processConsecutiveLoginService(TEST_USER_ID, today);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pointAmount).toBe(5);
        expect(result.data.consecutiveLoginDays).toBe(14);
      }
    });

    it("보상이 없는 날(4~6일)은 포인트가 지급되지 않아야 한다", async () => {
      const { today, yesterday } = getTestDates();

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        lastLoginDate: yesterday,
        consecutiveLoginDays: 4,
        totalPoints: 100,
      });

      (prisma.$transaction as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const result = await processConsecutiveLoginService(TEST_USER_ID, today);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pointAmount).toBe(0);
        expect(result.data.consecutiveLoginDays).toBe(5);
      }
    });
  });

  describe("연속 끊김", () => {
    it("하루라도 공백이 있으면 1일로 리셋되어야 한다", async () => {
      const { today, twoDaysAgo } = getTestDates();

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        lastLoginDate: twoDaysAgo,
        consecutiveLoginDays: 7,
        totalPoints: 120,
      });

      (prisma.$transaction as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const result = await processConsecutiveLoginService(TEST_USER_ID, today);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pointAmount).toBe(0);
        expect(result.data.consecutiveLoginDays).toBe(1);
      }
    });
  });

  describe("중복 로그인", () => {
    it("같은 날 중복 로그인 시 포인트가 지급되지 않고 트랜잭션도 실행되지 않아야 한다", async () => {
      const { todayAfternoon, todayMorning } = getTestDates();

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        lastLoginDate: todayMorning,
        consecutiveLoginDays: 5,
        totalPoints: 110,
      });

      const result = await processConsecutiveLoginService(
        TEST_USER_ID,
        todayAfternoon
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pointAmount).toBe(0);
        expect(result.data.totalPoints).toBe(110);
        expect(result.data.consecutiveLoginDays).toBe(5);
      }

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it("자정을 넘으면 다른 날로 처리되어야 한다", async () => {
      const { todayAfterMidnight, yesterdayBeforeMidnight } = getTestDates();

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        lastLoginDate: yesterdayBeforeMidnight,
        consecutiveLoginDays: 1,
        totalPoints: 100,
      });

      (prisma.$transaction as ReturnType<typeof vi.fn>).mockResolvedValue({
        pointAmount: 1,
        totalPoints: 101,
        consecutiveLoginDays: 2,
      });

      const result = await processConsecutiveLoginService(
        TEST_USER_ID,
        todayAfterMidnight
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pointAmount).toBe(1);
        expect(result.data.consecutiveLoginDays).toBe(2);
      }
    });
  });

  describe("에러 처리", () => {
    it("존재하지 않는 사용자는 NOT_FOUND 에러를 반환해야 한다", async () => {
      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(
        null
      );

      const result = await processConsecutiveLoginService(TEST_USER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe("사용자를 찾을 수 없습니다.");
      }
    });

    it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error("Database connection failed")
      );

      const result = await processConsecutiveLoginService(TEST_USER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });
  });
});
