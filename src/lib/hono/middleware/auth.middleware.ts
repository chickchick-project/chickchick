import { createMiddleware } from "hono/factory";
import { getSession } from "../../database/getSession";
import { apiUnauthorized } from "../utils/apiResponse.utils";
import type { AppContext } from "../app";

export const authMiddleware = createMiddleware<AppContext>(async (c, next) => {
  const session = await getSession();
  if (!session || !session.user) {
    return apiUnauthorized(c);
  }
  c.set("user", session.user);
  c.set("session", session);

  await next();
});

export const optionalAuthMiddleware = createMiddleware<AppContext>(
  async (c, next) => {
    const session = await getSession();

    if (session && session.user) {
      c.set("user", session.user);
      c.set("session", session);
    }

    await next();
  }
);
