import { z } from "@hono/zod-openapi";
import * as CommonSchemas from "@/lib/hono/schemas/common.schema";

type ErrorResponses = "400" | "401" | "403" | "404";

type ResponseConfig = {
  description: string;
  content: {
    "application/json": {
      schema: z.ZodTypeAny;
    };
  };
};

const getErrorResponseConfig = {
  "400": CommonSchemas.BadRequestResponse,
  "401": CommonSchemas.UnauthorizedResponse,
  "403": CommonSchemas.ForbiddenResponse,
  "404": CommonSchemas.NotFoundResponse,
};

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
