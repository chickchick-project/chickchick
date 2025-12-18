import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppContext } from "../app";
import {
  authMiddleware,
  optionalAuthMiddleware,
} from "../middleware/auth.middleware";

/**
 * 도메인 라우터 세트를 생성합니다.
 * @returns public, authenticated, optionalAuth 라우터와 이를 하나로 합치는 merge 함수를 포함한 객체
 */
export function createDomainRouters() {
  const publicRouter = new OpenAPIHono<AppContext>();
  const authenticatedRouter = new OpenAPIHono<AppContext>();
  const optionalAuthRouter = new OpenAPIHono<AppContext>();

  authenticatedRouter.use("*", authMiddleware);
  optionalAuthRouter.use("*", optionalAuthMiddleware);

  return {
    public: publicRouter,
    authenticated: authenticatedRouter,
    optionalAuth: optionalAuthRouter,

    merge: () => {
      publicRouter.route("/", optionalAuthRouter);
      publicRouter.route("/", authenticatedRouter);
      return publicRouter;
    },
  };
}

/**
 * 인증이 필수인 라우터를 생성합니다.
 * @returns 인증 미들웨어가 적용된 Hono 라우터 인스턴스
 */
export function createAuthenticatedRouter(): OpenAPIHono<AppContext> {
  const router = new OpenAPIHono<AppContext>();
  router.use("*", authMiddleware);
  return router;
}

/**
 * 인증이 선택인 라우터를 생성합니다.
 * @returns 선택적 인증 미들웨어가 적용된 Hono 라우터 인스턴스
 */
export function createOptionalAuthRouter(): OpenAPIHono<AppContext> {
  const router = new OpenAPIHono<AppContext>();
  router.use("*", optionalAuthMiddleware);
  return router;
}

/**
 * 공개 라우터를 생성합니다.
 * @returns 미들웨어가 적용되지 않은 공개 Hono 라우터 인스턴스
 */
export function createPublicRouter(): OpenAPIHono<AppContext> {
  return new OpenAPIHono<AppContext>();
}
