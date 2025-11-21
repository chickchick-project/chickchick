import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { validateTimestamp } from "../point.service";

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
