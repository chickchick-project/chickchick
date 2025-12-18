import { z } from "@hono/zod-openapi";

export const PaginationSchema = z
  .object({
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
  })
  .openapi("Pagination");

export const CursorPaginationSchema = z
  .object({
    cursor: z.string().uuid("유효하지 않은 커서 ID입니다.").optional(),
    limit: z.coerce.number().int().positive().default(12),
  })
  .openapi("CursorPagination");

export const UploadedImageInfoSchema = z
  .object({
    imageUrl: z.string().url(),
    width: z.number().int(),
    height: z.number().int(),
    format: z.enum(["JPEG", "PNG", "WEBP", "HEIC", "UNKNOWN"]),
  })
  .openapi("UploadedImageInfo");

export const MapLocationSchema = z
  .object({
    latitude: z.number().openapi({
      example: 37.5665,
      description: "위도",
    }),
    longitude: z.number().openapi({
      example: 126.978,
      description: "경도",
    }),
  })
  .nullable()
  .openapi("MapLocation");

/**
 * 향수 ID 경로 파라미터 스키마 (공통)
 */
export const PerfumeIdParamSchema = z.object({
  id: z
    .string()
    .uuid()
    .openapi({
      param: { name: "id", in: "path" },
      example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    }),
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    data: z.array(dataSchema),
    totalCount: z.number().int(),
    nextCursor: z.string().nullable(),
  });

export const SuccessResponseSchema = (dataSchema: z.ZodType) =>
  z.object({
    success: z.literal(true),
    message: z.string(),
    data: dataSchema,
  });

export const ErrorResponseSchema = z
  .object({
    success: z.literal(false),
    message: z.string(),
    error: z.string().optional(),
    details: z.unknown().optional(),
  })
  .openapi("ErrorResponse");

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

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiErrorResponse = z.infer<typeof ErrorResponseSchema>;

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type UploadedImageInfo = z.infer<typeof UploadedImageInfoSchema>;

export type PaginatedResponse<T> = z.infer<
  ReturnType<typeof PaginatedResponseSchema<z.ZodType<T>>>
>;

export type MapLocation = z.infer<typeof MapLocationSchema>;
