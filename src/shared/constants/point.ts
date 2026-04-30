/**
 * 포인트 시스템 정책 상수
 */
export const POINT_POLICY = {
  CREATE_POST: 5,
  CREATE_COMMENT: 1,
  LIKE_POST: 1,
  CONSECUTIVE_LOGIN_2: 1,
  CONSECUTIVE_LOGIN_3: 2,
  CONSECUTIVE_LOGIN_7: 5,
} as const;

/**
 * 활동 타입별 포인트 설명
 */
export const POINT_DESCRIPTIONS = {
  CREATE_POST: "새 게시물 작성",
  CREATE_COMMENT: "댓글 작성",
  LIKE_POST: "게시물 좋아요",
  CONSECUTIVE_LOGIN_2: "2일 연속 로그인",
  CONSECUTIVE_LOGIN_3: "3일 연속 로그인",
  CONSECUTIVE_LOGIN_7: "7일 연속 로그인",
} as const;
