import { z } from "@hono/zod-openapi";

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
