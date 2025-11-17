/**
 * 레벨당 필요한 포인트 (100포인트 = 1레벨)
 */
export const POINTS_PER_LEVEL = 100;

/**
 * 포인트를 기반으로 현재 레벨을 계산합니다.
 * @param points - 사용자의 총 포인트
 * @returns 계산된 레벨 (0부터 시작)
 *
 */
export function calculateLevel(points: number): number {
  if (points < 0) {
    return 0;
  }
  return Math.floor(points / POINTS_PER_LEVEL);
}

/**
 * 다음 레벨까지 필요한 포인트를 계산합니다.
 * @param currentPoints - 사용자의 현재 총 포인트
 * @returns 다음 레벨까지 필요한 포인트
 *
 */
export function getPointsForNextLevel(currentPoints: number): number {
  if (currentPoints < 0) {
    return POINTS_PER_LEVEL;
  }
  const currentLevel = calculateLevel(currentPoints);
  const nextLevelPoints = (currentLevel + 1) * POINTS_PER_LEVEL;
  return nextLevelPoints - currentPoints;
}

/**
 * 현재 레벨에서의 포인트 진행도를 백분율로 계산합니다.
 * @param currentPoints - 사용자의 현재 총 포인트
 * @returns 현재 레벨 내에서의 진행도 (0~100)
 *
 */
export function getLevelProgress(currentPoints: number): number {
  if (currentPoints < 0) {
    return 0;
  }
  const pointsInCurrentLevel = currentPoints % POINTS_PER_LEVEL;
  return Math.floor((pointsInCurrentLevel / POINTS_PER_LEVEL) * 100);
}

/**
 * 특정 레벨에 도달하기 위해 필요한 총 포인트를 계산합니다.
 * @param targetLevel - 목표 레벨
 * @returns 해당 레벨에 도달하기 위한 최소 포인트
 *
 */
export function getPointsForLevel(targetLevel: number): number {
  if (targetLevel < 0) {
    return 0;
  }
  return targetLevel * POINTS_PER_LEVEL;
}
