/**
 * 표준 API 에러 응답 포맷 타입
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  details?: unknown;
}

/**
 * 표준 API 성공 응답 포맷 타입
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

/**
 * 표준 에러 메시지 상수
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "인증되지 않은 사용자입니다.",
  FORBIDDEN: "접근 권한이 없습니다.",
  NOT_FOUND: "리소스를 찾을 수 없습니다.",
  ALREADY_EXISTS: "이미 존재하는 리소스입니다.",
  INVALID_INPUT: "잘못된 입력 데이터입니다.",
  INTERNAL_ERROR: "서버 내부 오류가 발생했습니다.",
  BAD_REQUEST: "잘못된 요청입니다.",
} as const;

/**
 * HTTP 상태 코드 상수
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const;
