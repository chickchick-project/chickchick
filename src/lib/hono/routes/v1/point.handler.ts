import { createRoute } from "@hono/zod-openapi";
import * as PointSchemas from "@/lib/hono/schemas/point.schema";
import * as PointServices from "@/lib/hono/services/point.service";
import { createStandardApiResponses } from "@/lib/hono/utils/openapi.schema";
import { getAuthenticatedUser } from "@/lib/hono/utils/service.utils";
import {
  apiInternalError,
  apiSuccess,
  apiNotFound,
  apiBadRequest,
} from "@/lib/hono/utils/api.utils";
import { createAuthenticatedRouter } from "@/lib/hono/utils/router";

const pointApi = createAuthenticatedRouter();

/**
 * @method GET
 * @path /points
 * @summary 사용자 포인트 정보 조회
 */
const getUserPointsRoute = createRoute({
  method: "get",
  path: "/",
  summary: "사용자 포인트 정보 조회",
  description: "현재 사용자의 총 포인트와 연속 로그인 일수를 조회합니다.",
  responses: createStandardApiResponses({
    schema: PointSchemas.ApiUserPointsResponseSchema,
  }),
  tags: ["Points"],
});

pointApi.openapi(getUserPointsRoute, async (c) => {
  const user = getAuthenticatedUser(c);
  const result = await PointServices.getUserPointsService(user.id);

  if (!result.success) {
    if (result.error === "NOT_FOUND") {
      return apiNotFound(c, result.message);
    }
    return apiInternalError(c, result.message);
  }

  return apiSuccess(c, result.data, "포인트 정보를 성공적으로 조회했습니다.");
});

/**
 * @method GET
 * @path /points/history
 * @summary 포인트 이력 조회
 */
const getPointHistoryRoute = createRoute({
  method: "get",
  path: "/history",
  summary: "포인트 이력 조회",
  description: "사용자의 포인트 적립/사용 이력을 커서 기반 페이지네이션으로 조회합니다.",
  request: {
    query: PointSchemas.GetPointHistoryQuerySchema,
  },
  responses: createStandardApiResponses({
    schema: PointSchemas.ApiPointHistoryResponseSchema,
  }),
  tags: ["Points"],
});

pointApi.openapi(getPointHistoryRoute, async (c) => {
  const user = getAuthenticatedUser(c);
  const query = c.req.valid("query");

  const result = await PointServices.getPointHistoryService(user.id, {
    cursor: query.cursor,
    limit: query.limit,
    activityType: query.activityType,
  });

  if (!result.success) {
    if (result.error === "NOT_FOUND") {
      return apiNotFound(c, result.message);
    }
    return apiInternalError(c, result.message);
  }

  return apiSuccess(c, result.data, "포인트 이력을 성공적으로 조회했습니다.");
});

/**
 * @method GET
 * @path /points/statistics
 * @summary 포인트 통계 조회
 */
const getPointStatisticsRoute = createRoute({
  method: "get",
  path: "/statistics",
  summary: "포인트 통계 조회",
  description: "사용자의 활동 타입별 포인트 적립 통계를 조회합니다.",
  responses: createStandardApiResponses({
    schema: PointSchemas.ApiPointStatisticsResponseSchema,
  }),
  tags: ["Points"],
});

pointApi.openapi(getPointStatisticsRoute, async (c) => {
  const user = getAuthenticatedUser(c);
  const result = await PointServices.getPointStatisticsService(user.id);

  if (!result.success) {
    if (result.error === "NOT_FOUND") {
      return apiNotFound(c, result.message);
    }
    return apiInternalError(c, result.message);
  }

  return apiSuccess(c, result.data, "포인트 통계를 성공적으로 조회했습니다.");
});

/**
 * @method POST
 * @path /points/login
 * @summary 연속 로그인 처리
 */
const processLoginRoute = createRoute({
  method: "post",
  path: "/login",
  summary: "연속 로그인 처리",
  description: "사용자의 로그인을 처리하고 연속 로그인 보상을 지급합니다.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: PointSchemas.ApiProcessLoginRequestSchema,
        },
      },
    },
  },
  responses: createStandardApiResponses({
    schema: PointSchemas.ApiProcessLoginResponseSchema,
  }),
  tags: ["Points"],
});

pointApi.openapi(processLoginRoute, async (c) => {
  const user = getAuthenticatedUser(c);
  const body = c.req.valid("json");

  // 클라이언트 타임스탬프 검증 (5분 이내의 요청만 허용)
  const clientTimestamp = new Date(body.timestamp);

  if (!PointServices.validateTimestamp(clientTimestamp)) {
    return apiBadRequest(
      c,
      "요청 시간이 유효하지 않습니다. 시스템 시간을 확인해주세요."
    );
  }

  const result = await PointServices.processConsecutiveLoginService(
    user.id,
    clientTimestamp
  );

  if (!result.success) {
    if (result.error === "NOT_FOUND") {
      return apiNotFound(c, result.message);
    }
    if (result.error === "BAD_REQUEST") {
      return apiBadRequest(c, result.message);
    }
    return apiInternalError(c, result.message);
  }

  // 연속 로그인 일수에 따른 메시지 생성
  const { pointAmount, consecutiveLoginDays } = result.data;
  let message: string;

  if (pointAmount === 0 && consecutiveLoginDays === 0) {
    message = "오늘 이미 로그인했습니다.";
  } else if (pointAmount > 0) {
    message = `${consecutiveLoginDays}일 연속 로그인! ${pointAmount} 포인트를 획득했습니다!`;
  } else {
    message = `${consecutiveLoginDays}일 연속 로그인 중입니다.`;
  }

  return apiSuccess(c, result.data, message);
});

export default pointApi;
