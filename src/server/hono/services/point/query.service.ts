import { PointActivityType } from "@prisma/client";
import { prisma } from "@/server/prisma";
import {
  serviceInternalError,
  serviceNotFound,
  ServiceResult,
  serviceSuccess,
} from "@/server/result";
import type {
  PointHistoryData,
  UserPointsData,
  PointStatisticsData,
} from "@/shared/types/point.types";

/**
 * 사용자의 포인트 이력을 조회합니다 (커서 기반 페이지네이션).
 */
export async function getPointHistoryService(
  userId: string,
  options?: {
    cursor?: string;
    limit?: number;
    activityType?: PointActivityType;
  }
): Promise<ServiceResult<PointHistoryData>> {
  try {
    const { cursor, limit = 20, activityType } = options || {};

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      return serviceNotFound("사용자를 찾을 수 없습니다.");
    }

    const histories = await prisma.pointHistory.findMany({
      where: {
        userId,
        ...(activityType && { activityType }),
        ...(cursor && { id: { lt: cursor } }),
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
    });

    const hasNextPage = histories.length > limit;
    const resultHistories = hasNextPage ? histories.slice(0, limit) : histories;
    const nextCursor = hasNextPage
      ? resultHistories[resultHistories.length - 1].id
      : null;

    const totalCount = await prisma.pointHistory.count({
      where: {
        userId,
        ...(activityType && { activityType }),
      },
    });

    return serviceSuccess({
      histories: resultHistories,
      totalCount,
      nextCursor,
    });
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 사용자의 현재 포인트를 조회합니다.
 */
export async function getUserPointsService(
  userId: string
): Promise<ServiceResult<UserPointsData>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        totalPoints: true,
        consecutiveLoginDays: true,
      },
    });

    if (!user) {
      return serviceNotFound("사용자를 찾을 수 없습니다.");
    }

    return serviceSuccess({
      totalPoints: user.totalPoints,
      consecutiveLoginDays: user.consecutiveLoginDays,
    });
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 활동 타입별 포인트 적립 통계를 조회합니다.
 */
export async function getPointStatisticsService(
  userId: string
): Promise<ServiceResult<PointStatisticsData>> {
  try {
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      return serviceNotFound("사용자를 찾을 수 없습니다.");
    }

    const statistics = await prisma.pointHistory.groupBy({
      by: ["activityType"],
      where: { userId },
      _sum: { pointAmount: true },
      _count: { id: true },
    });

    return serviceSuccess({
      statistics: statistics.map((stat) => ({
        activityType: stat.activityType,
        totalPoints: stat._sum.pointAmount || 0,
        count: stat._count.id,
      })),
    });
  } catch (error) {
    return serviceInternalError(error);
  }
}
