import { z } from "zod";
import {
  serviceBadRequest,
  serviceSuccess,
  ServiceResult,
} from "@/server/result";

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
