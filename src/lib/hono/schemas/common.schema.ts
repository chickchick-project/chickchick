import { z } from "@hono/zod-openapi";

export const PaginationSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .openapi({ example: 1, description: "페이지 번호" }),
  limit: z.coerce
    .number()
    .int()
    .openapi({ example: 10, description: "페이지 당 아이템 수" }),
  total: z.coerce
    .number()
    .int()
    .openapi({ example: 100, description: "총 아이템 수" }),
});

export const SuccessResponseSchema = (dataSchema: z.ZodType) =>
  z.object({
    success: z.literal(true),
    message: z.string(),
    data: dataSchema || z.null(),
  });

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.string().optional(),
  details: z.unknown().optional(),
});

export const BadRequestResponse = {
  description: "잘못된 요청 데이터 (Bad Request)",
  content: { "application/json": { schema: ErrorResponseSchema } },
};

export const UnauthorizedResponse = {
  description: "인증되지 않은 사용자 (Unauthorized)",
  content: { "application/json": { schema: ErrorResponseSchema } },
};

export const ForbiddenResponse = {
  description: "접근 권한이 없습니다 (Forbidden)",
  content: { "application/json": { schema: ErrorResponseSchema } },
};

export const NotFoundResponse = {
  description: "리소스를 찾을 수 없습니다 (Not Found)",
  content: { "application/json": { schema: ErrorResponseSchema } },
};

export const ConflictResponse = {
  description: "리소스가 이미 존재합니다 (Conflict)",
  content: { "application/json": { schema: ErrorResponseSchema } },
};
