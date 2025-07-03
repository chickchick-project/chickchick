import { createMiddleware } from "hono/factory";
import { checkPerfumeExistsService } from "@/lib/services/search.service";
import { GetSearchParams, PostSearchParams } from "@/lib/schemas/search.schema";

export const validateCursorExists = createMiddleware(async (c, next) => {
  const query = c.req.query();
  const json = await c.req.json().catch(() => undefined);

  const cursorId =
    (query as unknown as GetSearchParams)?.cursor ||
    (json as PostSearchParams)?.last_seen_id;

  if (cursorId) {
    const exists = await checkPerfumeExistsService(cursorId);
    if (!exists) {
      return c.json(
        {
          success: false,
          error:
            "유효하지 않은 커서입니다. 해당 ID의 데이터가 존재하지 않습니다.",
        },
        400
      );
    }
  }

  await next();
});
