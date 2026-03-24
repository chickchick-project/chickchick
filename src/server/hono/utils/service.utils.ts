import { prisma } from "@/server/prisma";
import { z } from "zod";
import { Context } from "hono";
import { ImageFormat } from "@prisma/client";
import { User } from "next-auth";

const IMAGE_FORMAT_MAP: Record<string, ImageFormat> = {
  JPEG: ImageFormat.JPEG,
  JPG: ImageFormat.JPEG,
  PNG: ImageFormat.PNG,
  WEBP: ImageFormat.WEBP,
  HEIF: ImageFormat.HEIC,
  HEIC: ImageFormat.HEIC,
} as const;

/**
 * 인증된 사용자 타입 - id가 반드시 존재함
 */
export type AuthenticatedUser = Required<Pick<User, "id">> & Omit<User, "id">;

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

type FindUniqueMethod = {
  findUnique: (args: {
    where: { id: string };
    select: { id: boolean };
  }) => Promise<{ id: string } | null>;
};

/**
 * 특정 리소스가 데이터베이스에 존재하는지 확인합니다.
 * @param model - Prisma 모델 이름 (예: "perfume", "user")
 * @param id - 확인할 리소스의 ID
 * @param resourceName - 오류 메시지에 사용할 리소스의 한글 이름 (예: "향수")
 */
export async function checkResourceExists(
  model: keyof typeof prisma,
  id: string,
  resourceName: string
): Promise<ServiceResult<true>> {
  const resource = await (
    prisma[model] as unknown as FindUniqueMethod
  ).findUnique({
    where: { id },
    select: { id: true },
  });

  if (!resource) {
    return serviceNotFound(`${resourceName}을(를) 찾을 수 없습니다.`);
  }
  return serviceSuccess(true);
}

/**
 * UUID 형식이 유효한지 Zod를 사용하여 검사합니다.
 * @param id - 검사할 ID
 * @param resourceName - 오류 메시지에 사용할 리소스의 이름
 */
export function validateUuid(
  id: string,
  resourceName: string
): ServiceResult<string> {
  const uuidSchema = z
    .string()
    .uuid({ message: `유효하지 않은 ${resourceName} ID 형식입니다.` });
  const result = uuidSchema.safeParse(id);

  if (!result.success) {
    return serviceBadRequest(result.error.flatten().formErrors[0]);
  }
  return serviceSuccess(result.data);
}

/**
 * 인증된 사용자 정보를 가져옵니다.
 * @param c - Hono 컨텍스트
 * @returns 인증된 사용자 정보 (id가 보장됨)
 * @throws 인증되지 않은 사용자이거나 id가 없는 경우 에러를 throw합니다
 */
export function getAuthenticatedUser(c: Context): AuthenticatedUser {
  const user = c.get("user");
  if (!user || !user.id) {
    throw new Error("인증되지 않은 사용자입니다.");
  }
  return user as AuthenticatedUser;
}
/**
 * 이미지 형식을 가져옵니다.
 * @param formatString - 이미지 형식 문자열
 * @returns 이미지 형식
 */

export function getImageFormat(formatString?: string): ImageFormat {
  if (!formatString) return ImageFormat.UNKNOWN;
  return IMAGE_FORMAT_MAP[formatString.toUpperCase()] ?? ImageFormat.UNKNOWN;
}
