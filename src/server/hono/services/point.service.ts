import { PointActivityType } from "@prisma/client";
import { prisma } from "@/server/prisma";
import {
  serviceInternalError,
  serviceNotFound,
  ServiceResult,
  serviceSuccess,
  serviceError,
} from "../utils/service.utils";
import { POINT_POLICY, POINT_DESCRIPTIONS } from "@/shared/constants/point";
import type {
  PointEarnData,
  PointHistoryData,
  UserPointsData,
  PointStatisticsData,
} from "@/shared/types/point.types";
import dayjs from "dayjs";

/**
 * 클라이언트 타임스탬프 검증
 * @param clientTimestamp - 클라이언트에서 전송한 타임스탬프
 * @param maxDiffMs - 허용 가능한 최대 시간 차이 (밀리초, 미만)
 * @returns 검증 성공 여부
 */
export function validateTimestamp(
  clientTimestamp: Date,
  maxDiffMs: number = 5 * 60 * 1000 // 기본값: 5분
): boolean {
  const serverTimestamp = new Date();
  const timeDiff = Math.abs(
    serverTimestamp.getTime() - clientTimestamp.getTime()
  );
  return timeDiff < maxDiffMs;
}

/**
 * 사용자에게 포인트를 적립하는 서비스
 * @param userId - 포인트를 적립할 사용자 ID
 * @param activityType - 활동 타입
 * @param referenceId - 관련된 리소스 ID (게시물, 댓글 등)
 * @param description - 커스텀 설명 (선택사항)
 * @returns 포인트 적립 결과
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

    // 사용자 존재 여부 확인
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      return serviceNotFound("사용자를 찾을 수 없습니다.");
    }

    // 트랜잭션으로 포인트 이력 생성 및 총 포인트 업데이트
    const result = await prisma.$transaction(async (tx) => {
      // 포인트 이력 생성
      await tx.pointHistory.create({
        data: {
          userId,
          pointAmount,
          activityType,
          referenceId,
          description: description || POINT_DESCRIPTIONS[activityType],
        },
      });

      // 사용자 총 포인트 업데이트
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          totalPoints: {
            increment: pointAmount,
          },
        },
        select: {
          totalPoints: true,
        },
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
 * 연속 로그인 일수를 계산하고 포인트를 적립하는 서비스
 * @param userId - 사용자 ID
 * @param currentLoginDate - 현재 로그인 날짜
 * @returns 포인트 적립 결과
 */
export async function processConsecutiveLoginService(
  userId: string,
  currentLoginDate: Date = new Date()
): Promise<ServiceResult<PointEarnData>> {
  try {
    // 필요한 모든 정보를 한번에 조회
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

    // 오늘 이미 로그인한 경우 (DB 조회가 불필요하므로 가장 먼저 처리)
    if (lastLoginDate && dayjs(lastLoginDate).isSame(currentLoginDate, "day")) {
      return serviceSuccess({
        pointAmount: 0,
        totalPoints,
        consecutiveLoginDays,
      });
    }

    // 새로운 연속 로그인 일수 계산 (메모리 상에서)
    let newConsecutiveDays = 1;
    const yesterday = dayjs(currentLoginDate).subtract(1, "day");
    if (lastLoginDate && dayjs(lastLoginDate).isSame(yesterday, "day")) {
      newConsecutiveDays = consecutiveLoginDays + 1;
    }

    // 지급할 보상 결정
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

    // DB 업데이트와 포인트 지급을 트랜잭션으로 처리
    const earnedPointData = await prisma.$transaction(async (tx) => {
      // 사용자 연속 로그인 정보 업데이트
      await tx.user.update({
        where: { id: userId },
        data: {
          lastLoginDate: currentLoginDate,
          consecutiveLoginDays: newConsecutiveDays,
        },
      });

      // 보상이 있는 경우, 포인트 지급 처리 (트랜잭션 내부에서 직접 실행)
      if (activityType) {
        const pointAmount = POINT_POLICY[activityType];

        // 포인트 이력 생성
        await tx.pointHistory.create({
          data: {
            userId,
            pointAmount,
            activityType,
            referenceId: undefined,
            description: customDescription || POINT_DESCRIPTIONS[activityType],
          },
        });

        // 사용자 총 포인트 업데이트
        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: {
            totalPoints: {
              increment: pointAmount,
            },
          },
          select: {
            totalPoints: true,
          },
        });

        return {
          pointAmount,
          totalPoints: updatedUser.totalPoints,
          consecutiveLoginDays: newConsecutiveDays,
        };
      }

      return null; // 보상이 없는 경우 null 반환
    });

    // 5. 트랜잭션 결과에 따라 최종 응답 생성
    if (earnedPointData) {
      // 포인트가 지급된 경우
      return serviceSuccess(earnedPointData);
    } else {
      // 포인트 지급 없이 연속 로그인 정보만 갱신된 경우
      return serviceSuccess({
        pointAmount: 0,
        totalPoints: totalPoints, // 미리 조회해둔 값 사용
        consecutiveLoginDays: newConsecutiveDays,
      });
    }
  } catch (error) {
    // findUnique 실패 또는 트랜잭션 실패 시 여기서 처리
    return serviceInternalError(error);
  }
}

/**
 * 사용자의 포인트 이력을 조회하는 서비스 (커서 기반 페이지네이션)
 * @param userId - 사용자 ID
 * @param options - 조회 옵션
 * @returns 포인트 이력 목록
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

    // 사용자 존재 여부 확인
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      return serviceNotFound("사용자를 찾을 수 없습니다.");
    }

    // limit + 1개를 조회하여 다음 페이지 존재 여부 확인
    const histories = await prisma.pointHistory.findMany({
      where: {
        userId,
        ...(activityType && { activityType }),
        ...(cursor && {
          id: {
            lt: cursor,
          },
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit + 1,
    });

    // 다음 페이지가 있는지 확인
    const hasNextPage = histories.length > limit;
    const resultHistories = hasNextPage ? histories.slice(0, limit) : histories;
    const nextCursor = hasNextPage
      ? resultHistories[resultHistories.length - 1].id
      : null;

    // 전체 개수 조회
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
 * 사용자의 현재 포인트를 조회하는 서비스
 * @param userId - 사용자 ID
 * @returns 현재 포인트
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
 * 활동 타입별 포인트 적립 통계를 조회하는 서비스
 * @param userId - 사용자 ID
 * @returns 활동 타입별 통계
 */
export async function getPointStatisticsService(
  userId: string
): Promise<ServiceResult<PointStatisticsData>> {
  try {
    // 사용자 존재 여부 확인
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      return serviceNotFound("사용자를 찾을 수 없습니다.");
    }

    const statistics = await prisma.pointHistory.groupBy({
      by: ["activityType"],
      where: {
        userId,
      },
      _sum: {
        pointAmount: true,
      },
      _count: {
        id: true,
      },
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
