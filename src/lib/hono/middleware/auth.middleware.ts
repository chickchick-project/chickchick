import { createMiddleware } from "hono/factory";
import { getSession } from "../../database/getSession";
import type { AppContext } from "../app";

export const authMiddleware = createMiddleware<AppContext>(async (c, next) => {
  const session = await getSession();
  if (!session || !session.user) {
    return c.json({ message: "Unauthorized" }, 401);
  }
  c.set("user", session.user);
  c.set("session", session);

  await next();
});
