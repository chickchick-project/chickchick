import { prisma } from "@/lib/prisma";

type FindUniqueMethod = {
  findUnique: (args: {
    where: { id: string };
    select: { id: boolean };
  }) => Promise<{ id: string } | null>;
};
import {
  ServiceResult,
  serviceSuccess,
  serviceNotFound,
  serviceBadRequest,
} from "./serviceResult.utils";
import { z } from "zod";
import { Context } from "hono";

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
 * @returns 인증된 사용자 정보
 */
export function getAuthenticatedUser(c: Context) {
  const user = c.get("user");
  if (!user) {
    throw new Error("인증 되지 않은 사용자입니다.");
  }
  return user;
}
