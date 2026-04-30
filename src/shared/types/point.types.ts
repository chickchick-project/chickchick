import { PointActivityType } from "@prisma/client";

/**
 * 포인트 적립 결과 데이터
 */
export interface PointEarnData {
  pointAmount: number;
  totalPoints: number;
  consecutiveLoginDays?: number;
}

/**
 * 포인트 이력 데이터
 */
export interface PointHistoryData {
  histories: Array<{
    id: string;
    pointAmount: number;
    activityType: PointActivityType;
    referenceId: string | null;
    description: string | null;
    createdAt: Date;
  }>;
  totalCount: number;
  nextCursor: string | null;
}

/**
 * 사용자 포인트 데이터
 */
export interface UserPointsData {
  totalPoints: number;
  consecutiveLoginDays: number;
}

/**
 * 포인트 통계 데이터
 */
export interface PointStatisticsData {
  statistics: Array<{
    activityType: PointActivityType;
    totalPoints: number;
    count: number;
  }>;
}
