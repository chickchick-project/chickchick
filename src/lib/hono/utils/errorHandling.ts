import { Context } from "hono";

interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  details?: unknown;
}

interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}
/**
 * Error codes with standardized messages
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

const HTTP_STATUS = {
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

function createSuccessResponse<T>(
  data: T,
  message: string
): ApiSuccessResponse<T> {
  return { success: true, message, data };
}

function createErrorResponse(
  message: string,
  error?: string,
  details?: unknown
): ApiErrorResponse {
  const response: ApiErrorResponse = { success: false, message };
  if (error) response.error = error;
  if (details) response.details = details;
  return response;
}

export function apiSuccess<T>(
  c: Context,
  data: T,
  message = "요청이 성공적으로 처리되었습니다.",
  status = HTTP_STATUS.OK
) {
  return c.json(createSuccessResponse(data, message), status);
}

export function apiCreated<T>(
  c: Context,
  data: T,
  message = "성공적으로 생성되었습니다."
) {
  return c.json(createSuccessResponse(data, message), HTTP_STATUS.CREATED);
}

export function apiNotFound(
  c: Context,
  message: string = ERROR_MESSAGES.NOT_FOUND
) {
  return c.json(createErrorResponse(message), HTTP_STATUS.NOT_FOUND);
}

export function apiBadRequest(
  c: Context,
  message: string = ERROR_MESSAGES.BAD_REQUEST,
  details?: unknown
) {
  return c.json(
    createErrorResponse(message, "Bad Request", details),
    HTTP_STATUS.BAD_REQUEST
  );
}

export function apiUnauthorized(
  c: Context,
  message: string = ERROR_MESSAGES.UNAUTHORIZED
) {
  return c.json(createErrorResponse(message), HTTP_STATUS.UNAUTHORIZED);
}

export function apiForbidden(
  c: Context,
  message: string = ERROR_MESSAGES.FORBIDDEN
) {
  return c.json(createErrorResponse(message), HTTP_STATUS.FORBIDDEN);
}

export function apiConflict(
  c: Context,
  message: string = ERROR_MESSAGES.ALREADY_EXISTS
) {
  return c.json(createErrorResponse(message), HTTP_STATUS.CONFLICT);
}

export function apiInternalError(
  c: Context,
  message: string = ERROR_MESSAGES.INTERNAL_ERROR
) {
  return c.json(createErrorResponse(message), HTTP_STATUS.INTERNAL_ERROR);
}
export type ServiceResult<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E; message: string };

export function serviceSuccess<T>(data: T): ServiceResult<T> {
  return { success: true, data };
}

export function serviceError<E = string>(
  error: E,
  message: string
): ServiceResult<never, E> {
  return { success: false, error, message };
}

export function serviceNotFound(
  message = "리소스를 찾을 수 없습니다."
): ServiceResult<never, "NOT_FOUND"> {
  return { success: false, error: "NOT_FOUND", message };
}

export function serviceAlreadyExists(
  message = "이미 존재하는 리소스입니다."
): ServiceResult<never, "ALREADY_EXISTS"> {
  return { success: false, error: "ALREADY_EXISTS", message };
}

export function serviceBadRequest(
  message = "잘못된 요청입니다."
): ServiceResult<never, "BAD_REQUEST"> {
  return { success: false, error: "BAD_REQUEST", message };
}

export function serviceInternalError(
  error: unknown
): ServiceResult<never, "INTERNAL_ERROR"> {
  const message =
    error instanceof Error
      ? error.message
      : "알 수 없는 내부 오류가 발생했습니다.";
  console.error("Internal Service Error:", error); // 에러 로깅
  return { success: false, error: "INTERNAL_ERROR", message };
}
