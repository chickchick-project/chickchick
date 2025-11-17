import { describe, it, expect } from "vitest";
import {
  calculateLevel,
  getPointsForNextLevel,
  getLevelProgress,
  getPointsForLevel,
  POINTS_PER_LEVEL,
} from "../../../utils/level.utils";

/**
 * 레벨 유틸리티 함수 테스트
 *
 * 테스트 전략:
 * - 경계값을 중심으로 3개씩 간결하게 테스트
 * - 최소값, 경계값, 일반값으로 구성
 */

describe("Level Utils - calculateLevel", () => {
  it("경계값 테스트: 0, 99, 100", () => {
    expect(calculateLevel(0)).toBe(0); // 최소값
    expect(calculateLevel(99)).toBe(0); // 레벨 올리기 직전
    expect(calculateLevel(100)).toBe(1); // 레벨 업
  });

  it("일반값 테스트: 150, 1000, 음수", () => {
    expect(calculateLevel(150)).toBe(1); // 중간값
    expect(calculateLevel(1000)).toBe(10); // 큰 값
    expect(calculateLevel(-100)).toBe(0); // 음수
  });
});

describe("Level Utils - getPointsForNextLevel", () => {
  it("경계값 테스트: 0, 99, 100", () => {
    expect(getPointsForNextLevel(0)).toBe(100); // 시작점
    expect(getPointsForNextLevel(99)).toBe(1); // 레벨 업 직전
    expect(getPointsForNextLevel(100)).toBe(100); // 레벨 시작점
  });

  it("일반값 테스트: 50, 150, 음수", () => {
    expect(getPointsForNextLevel(50)).toBe(50); // 중간
    expect(getPointsForNextLevel(150)).toBe(50); // 다음 레벨 중간
    expect(getPointsForNextLevel(-100)).toBe(100); // 음수
  });
});

describe("Level Utils - getLevelProgress", () => {
  it("경계값 테스트: 0, 99, 100", () => {
    expect(getLevelProgress(0)).toBe(0); // 시작점
    expect(getLevelProgress(99)).toBe(99); // 거의 끝
    expect(getLevelProgress(100)).toBe(0); // 다음 레벨 시작
  });

  it("일반값 테스트: 50, 150, 음수", () => {
    expect(getLevelProgress(50)).toBe(50); // 중간
    expect(getLevelProgress(150)).toBe(50); // 다음 레벨 중간
    expect(getLevelProgress(-100)).toBe(0); // 음수
  });
});

describe("Level Utils - getPointsForLevel", () => {
  it("경계값 테스트: 0, 1, 10", () => {
    expect(getPointsForLevel(0)).toBe(0); // 최소 레벨
    expect(getPointsForLevel(1)).toBe(100); // 첫 레벨
    expect(getPointsForLevel(10)).toBe(1000); // 일반 레벨
  });

  it("특수값 테스트: 100, -1", () => {
    expect(getPointsForLevel(100)).toBe(10000); // 큰 레벨
    expect(getPointsForLevel(-1)).toBe(0); // 음수 레벨
  });
});

describe("Level Utils - 통합 시나리오", () => {
  it("포인트 1050일 때 모든 함수가 일관되게 동작", () => {
    const points = 1050;
    expect(calculateLevel(points)).toBe(10);
    expect(getPointsForNextLevel(points)).toBe(50);
    expect(getLevelProgress(points)).toBe(50);
  });

  it("상수 값 검증", () => {
    expect(POINTS_PER_LEVEL).toBe(100);
  });
});
