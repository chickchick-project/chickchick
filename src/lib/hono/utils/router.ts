import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppContext } from "../app";
import {
  authMiddleware,
  optionalAuthMiddleware,
} from "../middleware/auth.middleware";

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

export function createAuthenticatedRouter(): OpenAPIHono<AppContext> {
  const router = new OpenAPIHono<AppContext>();
  router.use("*", authMiddleware);
  return router;
}

export function createOptionalAuthRouter(): OpenAPIHono<AppContext> {
  const router = new OpenAPIHono<AppContext>();
  router.use("*", optionalAuthMiddleware);
  return router;
}

export function createPublicRouter(): OpenAPIHono<AppContext> {
  return new OpenAPIHono<AppContext>();
}
