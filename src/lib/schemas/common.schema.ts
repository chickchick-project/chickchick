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
    success: z.boolean().openapi({ example: true }),
    message: z.string().openapi({ example: "성공" }),
    data: dataSchema,
  });

export const ErrorResponseSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "에러 메시지" }),
});
