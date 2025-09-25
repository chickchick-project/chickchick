/**
 * 서비스 계층의 성공 또는 실패 결과를 나타내는 표준 타입.
 * 성공 시에는 `data`를, 실패 시에는 `error` 코드와 `message`를 포함합니다.
 */
export type ServiceErrorCode =
  | "NOT_FOUND"
  | "ALREADY_EXISTS"
  | "BAD_REQUEST"
  | "INTERNAL_ERROR"
  | "FORBIDDEN";

export type ServiceResult<T, E extends ServiceErrorCode = ServiceErrorCode> =
  | { success: true; data: T }
  | { success: false; error: E; message?: string };

/**
 * 성공적인 서비스 결과 객체를 생성합니다.
 * @param data - 성공 시 반환할 데이터
 */
export function serviceSuccess<T>(data: T): ServiceResult<T> {
  return { success: true, data };
}

/**
 * 실패 서비스 결과 객체를 생성합니다.
 * @param error - 에러를 식별하는 코드 또는 문자열
 * @param message - 클라이언트에게 보여줄 수 있는 에러 메시지
 */
export function serviceError<E extends ServiceErrorCode>(
  error: E,
  message?: string
): ServiceResult<never, E> {
  return { success: false, error, message };
}

/**
 * 'NOT_FOUND' 에러 결과 객체를 생성합니다.
 */
export const serviceNotFound = (message = "리소스를 찾을 수 없습니다.") =>
  serviceError("NOT_FOUND", message);
/**
 * 'ALREADY_EXISTS' 에러 결과 객체를 생성합니다.
 */
export const serviceAlreadyExists = (message = "이미 존재하는 리소스입니다.") =>
  serviceError("ALREADY_EXISTS", message);

/**
 * 'BAD_REQUEST' 또는 유효성 검사 에러 결과 객체를 생성합니다.
 */
export const serviceBadRequest = (message = "잘못된 요청입니다.") =>
  serviceError("BAD_REQUEST", message);

/**
 * 'FORBIDDEN' 에러 결과 객체를 생성합니다.
 */
export const serviceForbidden = (message = "요청을 수행할 권한이 없습니다.") =>
  serviceError("FORBIDDEN", message);

/**
 * 예기치 않은 내부 서버 오류 결과 객체를 생성합니다.
 */
export function serviceInternalError(
  error: unknown
): ServiceResult<never, "INTERNAL_ERROR"> {
  const err = error instanceof Error ? error : new Error(String(error));
  const message = err.message;
  console.error("[INTERNAL_ERROR]", err);
  return { success: false, error: "INTERNAL_ERROR", message };
}
