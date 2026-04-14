import { createRoute, z } from "@hono/zod-openapi";
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  syncOAuthUserService,
  getSessionUserService,
} from "@/server/hono/services/auth.service";
import {
  apiBadRequest,
  apiForbidden,
  apiInternalError,
  apiNotFound,
  apiSuccess,
} from "@/server/hono/utils/api.utils";
import { createStandardApiResponses } from "@/server/hono/utils/openapi.schema";
import type { AppContext } from "@/server/hono/app";

const router = new OpenAPIHono<AppContext>();

// 내부 시크릿 검증 미들웨어
router.use("*", async (c, next) => {
  const secret = c.req.header("x-internal-secret");
  if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
    return apiForbidden(c, "접근이 거부되었습니다.");
  }
  await next();
});

const SyncOAuthUserBodySchema = z.object({
  provider: z.string().min(1),
  providerAccountId: z.string().min(1),
  name: z.string(),
  email: z.string().email(),
  imageUrl: z.string().url().optional(),
});

const SyncOAuthUserResponseSchema = z.object({
  id: z.string(),
  isNewUser: z.boolean(),
});

const syncOAuthUserRoute = createRoute({
  method: "post",
  path: "/sync",
  summary: "[내부] OAuth 유저 동기화",
  request: { body: { content: { "application/json": { schema: SyncOAuthUserBodySchema } } } },
  responses: createStandardApiResponses({ schema: SyncOAuthUserResponseSchema }),
  tags: ["Auth (Internal)"],
});

router.openapi(syncOAuthUserRoute, async (c) => {
  const body = c.req.valid("json");
  const result = await syncOAuthUserService(body);

  if (!result.success) {
    switch (result.error) {
      case "BAD_REQUEST":
        return apiBadRequest(c, result.message);
      default:
        return apiInternalError(c, result.message);
    }
  }

  return apiSuccess(c, result.data, "유저 동기화가 완료되었습니다.");
});

const SessionUserParamSchema = z.object({
  userId: z.string().uuid(),
});

const SessionUserResponseSchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
  nickname: z.string(),
  imageUrl: z.string().nullable(),
});

const getSessionUserRoute = createRoute({
  method: "get",
  path: "/session-user/{userId}",
  summary: "[내부] 세션 유저 최신 정보 조회",
  request: { params: SessionUserParamSchema },
  responses: createStandardApiResponses({ schema: SessionUserResponseSchema }),
  tags: ["Auth (Internal)"],
});

router.openapi(getSessionUserRoute, async (c) => {
  const { userId } = c.req.valid("param");
  const result = await getSessionUserService(userId);

  if (!result.success) {
    switch (result.error) {
      case "NOT_FOUND":
        return apiNotFound(c, result.message);
      default:
        return apiInternalError(c, result.message);
    }
  }

  return apiSuccess(c, result.data, "세션 유저 정보를 성공적으로 불러왔습니다.");
});

export default router;
