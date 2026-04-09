import { createMiddleware } from "hono/factory";
import { getSession } from "../../database/getSession";
import { apiUnauthorized } from "../utils/api.utils";
import type { AppContext } from "../app";

export const authMiddleware = createMiddleware<AppContext>(async (c, next) => {
  console.log(`[HONO][auth] 미들웨어 진입 — path=${c.req.path}`);
  let session;
  try {
    session = await getSession();
    console.log(`[HONO][auth] getSession 완료 — userId=${session?.user?.id ?? "없음"} email=${session?.user?.email ?? "없음"}`);
  } catch (err) {
    console.error(`[HONO][auth] getSession 오류:`, err);
    return apiUnauthorized(c);
  }
  if (!session || !session.user) {
    console.warn(`[HONO][auth] 세션 없음 — 401 반환`);
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
