import { PointActivityType } from "@prisma/client";
import { prisma } from "@/server/prisma";
import {
  serviceInternalError,
  serviceNotFound,
  ServiceResult,
  serviceSuccess,
  serviceError,
} from "@/server/result";
import { POINT_POLICY, POINT_DESCRIPTIONS } from "@/shared/constants/point";
import type { PointEarnData } from "@/shared/types/point.types";
import dayjs from "dayjs";

/**
 * 클라이언트 타임스탬프 검증
 */
export function validateTimestamp(
  clientTimestamp: Date,
  maxDiffMs: number = 5 * 60 * 1000
): boolean {
  const serverTimestamp = new Date();
  const timeDiff = Math.abs(
    serverTimestamp.getTime() - clientTimestamp.getTime()
  );
  return timeDiff < maxDiffMs;
}

/**
 * 사용자에게 포인트를 적립합니다.
 */
export async function earnPointsService(
  userId: string,
  activityType: PointActivityType,
  referenceId?: string,
  description?: string
): Promise<ServiceResult<PointEarnData>> {
  try {
    const pointAmount = POINT_POLICY[activityType];

    if (!pointAmount) {
      return serviceError("BAD_REQUEST", "유효하지 않은 활동 타입입니다.");
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      return serviceNotFound("사용자를 찾을 수 없습니다.");
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.pointHistory.create({
        data: {
          userId,
          pointAmount,
          activityType,
          referenceId,
          description: description || POINT_DESCRIPTIONS[activityType],
        },
      });

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { totalPoints: { increment: pointAmount } },
        select: { totalPoints: true },
      });

      return updatedUser;
    });

    return serviceSuccess({
      pointAmount,
      totalPoints: result.totalPoints,
    });
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 연속 로그인 일수를 계산하고 포인트를 적립합니다.
 */
export async function processConsecutiveLoginService(
  userId: string,
  currentLoginDate: Date = new Date()
): Promise<ServiceResult<PointEarnData>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        lastLoginDate: true,
        consecutiveLoginDays: true,
        totalPoints: true,
      },
    });

    if (!user) {
      return serviceNotFound("사용자를 찾을 수 없습니다.");
    }

    const { lastLoginDate, consecutiveLoginDays, totalPoints } = user;

    if (lastLoginDate && dayjs(lastLoginDate).isSame(currentLoginDate, "day")) {
      return serviceSuccess({
        pointAmount: 0,
        totalPoints,
        consecutiveLoginDays,
      });
    }

    let newConsecutiveDays = 1;
    const yesterday = dayjs(currentLoginDate).subtract(1, "day");
    if (lastLoginDate && dayjs(lastLoginDate).isSame(yesterday, "day")) {
      newConsecutiveDays = consecutiveLoginDays + 1;
    }

    let activityType: PointActivityType | null = null;
    let customDescription: string | null = null;

    if (newConsecutiveDays > 0 && newConsecutiveDays % 7 === 0) {
      activityType = PointActivityType.CONSECUTIVE_LOGIN_7;
      customDescription = `${newConsecutiveDays}일 연속 로그인 달성!`;
    } else if (newConsecutiveDays === 3) {
      activityType = PointActivityType.CONSECUTIVE_LOGIN_3;
      customDescription = "3일 연속 로그인 달성!";
    } else if (newConsecutiveDays === 2) {
      activityType = PointActivityType.CONSECUTIVE_LOGIN_2;
      customDescription = "2일 연속 로그인 달성!";
    }

    const earnedPointData = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          lastLoginDate: currentLoginDate,
          consecutiveLoginDays: newConsecutiveDays,
        },
      });

      if (activityType) {
        const pointAmount = POINT_POLICY[activityType];

        await tx.pointHistory.create({
          data: {
            userId,
            pointAmount,
            activityType,
            referenceId: undefined,
            description: customDescription || POINT_DESCRIPTIONS[activityType],
          },
        });

        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: { totalPoints: { increment: pointAmount } },
          select: { totalPoints: true },
        });

        return {
          pointAmount,
          totalPoints: updatedUser.totalPoints,
          consecutiveLoginDays: newConsecutiveDays,
        };
      }

      return null;
    });

    if (earnedPointData) {
      return serviceSuccess(earnedPointData);
    } else {
      return serviceSuccess({
        pointAmount: 0,
        totalPoints,
        consecutiveLoginDays: newConsecutiveDays,
      });
    }
  } catch (error) {
    return serviceInternalError(error);
  }
}
