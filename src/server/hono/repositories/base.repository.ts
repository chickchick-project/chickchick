import { prisma } from "@/server/prisma";
import {
  serviceNotFound,
  serviceSuccess,
  ServiceResult,
} from "@/server/result";

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
