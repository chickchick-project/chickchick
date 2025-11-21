import { z } from "@hono/zod-openapi";
import { PointActivityType } from "@prisma/client";
import { PointHistorySchema } from "@zod/modelSchema";

/**
 * 포인트 활동 타입 스키마
 */
export const PointActivityTypeSchema = z.nativeEnum(PointActivityType).openapi({
  description: "포인트 활동 타입",
  example: PointActivityType.CREATE_POST,
});

/**
 * 포인트 적립 응답 스키마
 */
export const ApiPointEarnResponseSchema = z
  .object({
    pointAmount: z.number().int().openapi({
      description: "적립된 포인트",
      example: 5,
    }),
    totalPoints: z.number().int().openapi({
      description: "총 보유 포인트",
      example: 105,
    }),
    consecutiveLoginDays: z.number().int().optional().openapi({
      description: "연속 로그인 일수 (연속 로그인 API에서만 반환)",
      example: 3,
    }),
  })
  .openapi("ApiPointEarnResponse");

/**
 * 포인트 이력 아이템 스키마
 */
export const ApiPointHistoryItemSchema = PointHistorySchema.pick({
  id: true,
  pointAmount: true,
  activityType: true,
  referenceId: true,
  description: true,
  createdAt: true,
}).openapi("ApiPointHistoryItem");

/**
 * 포인트 이력 조회 쿼리 파라미터 스키마
 */
export const GetPointHistoryQuerySchema = z
  .object({
    cursor: z
      .string()
      .uuid()
      .openapi({
        description: "커서 (이전 응답의 nextCursor 값)",
        example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      })
      .optional(),
    limit: z.coerce
      .number()
      .int()
      .positive()
      .default(20)
      .openapi({
        description: "조회할 이력 개수",
        example: 20,
      })
      .optional(),
    activityType: PointActivityTypeSchema.optional(),
  })
  .openapi("GetPointHistoryQuery");

/**
 * 포인트 이력 조회 응답 스키마
 */
export const ApiPointHistoryResponseSchema = z
  .object({
    histories: z.array(ApiPointHistoryItemSchema),
    totalCount: z.number().int().openapi({
      description: "총 이력 개수",
      example: 50,
    }),
    nextCursor: z
      .string()
      .uuid()
      .nullable()
      .openapi({
        description: "다음 페이지 커서",
        example: "b2c3d4e5-f6a7-8901-2345-678901bcdef0",
      }),
  })
  .openapi("ApiPointHistoryResponse");

/**
 * 사용자 포인트 정보 응답 스키마
 */
export const ApiUserPointsResponseSchema = z
  .object({
    totalPoints: z.number().int().openapi({
      description: "총 보유 포인트",
      example: 150,
    }),
    consecutiveLoginDays: z.number().int().openapi({
      description: "연속 로그인 일수",
      example: 5,
    }),
  })
  .openapi("ApiUserPointsResponse");

/**
 * 포인트 통계 아이템 스키마
 */
export const ApiPointStatisticsItemSchema = z
  .object({
    activityType: PointActivityTypeSchema,
    totalPoints: z.number().int().openapi({
      description: "해당 활동으로 획득한 총 포인트",
      example: 25,
    }),
    count: z.number().int().openapi({
      description: "해당 활동 횟수",
      example: 5,
    }),
  })
  .openapi("ApiPointStatisticsItem");

/**
 * 포인트 통계 응답 스키마
 */
export const ApiPointStatisticsResponseSchema = z
  .object({
    statistics: z.array(ApiPointStatisticsItemSchema),
  })
  .openapi("ApiPointStatisticsResponse");

/**
 * 연속 로그인 처리 요청 스키마
 */
export const ApiProcessLoginRequestSchema = z
  .object({
    timestamp: z.string().datetime().openapi({
      description: "클라이언트 요청 시각 (ISO 8601)",
      example: "2024-11-15T12:00:00.000Z",
    }),
  })
  .openapi("ApiProcessLoginRequest");

/**
 * 연속 로그인 처리 응답 스키마
 */
export const ApiProcessLoginResponseSchema = ApiPointEarnResponseSchema.openapi(
  "ApiProcessLoginResponse"
);

// Type exports
export type ApiPointEarnResponse = z.infer<typeof ApiPointEarnResponseSchema>;
export type ApiPointHistoryItem = z.infer<typeof ApiPointHistoryItemSchema>;
export type GetPointHistoryQuery = z.infer<typeof GetPointHistoryQuerySchema>;
export type ApiPointHistoryResponse = z.infer<
  typeof ApiPointHistoryResponseSchema
>;
export type ApiUserPointsResponse = z.infer<typeof ApiUserPointsResponseSchema>;
export type ApiPointStatisticsItem = z.infer<
  typeof ApiPointStatisticsItemSchema
>;
export type ApiPointStatisticsResponse = z.infer<
  typeof ApiPointStatisticsResponseSchema
>;
export type ApiProcessLoginRequest = z.infer<
  typeof ApiProcessLoginRequestSchema
>;
export type ApiProcessLoginResponse = z.infer<
  typeof ApiProcessLoginResponseSchema
>;
