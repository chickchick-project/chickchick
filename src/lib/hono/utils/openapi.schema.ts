import { z } from "@hono/zod-openapi";
import * as CommonSchemas from "@/lib/hono/schemas/common.schema";

const getErrorResponseConfig = {
  "400": CommonSchemas.BadRequestResponse,
  "401": CommonSchemas.UnauthorizedResponse,
  "403": CommonSchemas.ForbiddenResponse,
  "404": CommonSchemas.NotFoundResponse,
  "409": CommonSchemas.ConflictResponse,
};

type ErrorResponses = keyof typeof getErrorResponseConfig;

type ResponseConfig = {
  description: string;
  content: {
    "application/json": {
      schema: z.ZodTypeAny;
    };
  };
};

/**
 * 표준화된 API 응답 스키마 맵을 생성합니다.
 * @param success - 성공 응답 설정 (스키마, 설명, 상태코드)
 * @param errors - 추가할 오류 응답 코드 목록 (예: ["400", "401"])
 * @returns OpenAPI용 responses 객체 맵
 */
export function createStandardApiResponses<T extends z.ZodTypeAny>(
  success: {
    schema: T;
    description?: string;
    statusCode?: 200 | 201;
  },
  errors: ErrorResponses[] = []
) {
  const responses: Record<string, ResponseConfig> = {};

  // 성공 응답
  responses[success.statusCode?.toString() || "200"] = {
    description: success.description || "요청 성공",
    content: {
      "application/json": {
        schema: CommonSchemas.SuccessResponseSchema(success.schema),
      },
    },
  };

  // 에러 응답
  errors.forEach((code) => {
    responses[code] = getErrorResponseConfig[code];
  });
  return responses;
}
