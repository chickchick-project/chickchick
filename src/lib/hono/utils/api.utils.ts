import { Context } from "hono";
import { ZodError } from "zod";
import { HTTPException } from "hono/http-exception";
import { HTTP_STATUS, ERROR_MESSAGES } from "./http.constants";
import { ApiErrorResponse, ApiSuccessResponse } from "../schemas/common.schema";

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

// --- 전역 에러 핸들러 ---
export function handleApiError(error: unknown, c: Context): Response {
  if (error instanceof ZodError) {
    const details = error.flatten().fieldErrors;
    return c.json(
      createErrorResponse(
        ERROR_MESSAGES.INVALID_INPUT,
        "Validation failed",
        details
      ),
      HTTP_STATUS.BAD_REQUEST
    );
  }

  if (error instanceof HTTPException) {
    return c.json(createErrorResponse(error.message), error.status);
  }

  if (error instanceof Error) {
    return c.json(
      createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, error.message),
      HTTP_STATUS.INTERNAL_ERROR
    );
  }

  return c.json(
    createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR),
    HTTP_STATUS.INTERNAL_ERROR
  );
}
