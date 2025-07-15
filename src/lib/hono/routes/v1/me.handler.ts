import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { createStandardApiResponses } from "../../utils/createStandardApiResponses";
import * as CommunitySchemas from "@/lib/hono/schemas/community.schema";
import * as PerfumeSchemas from "@/lib/hono/schemas/perfume.schema";
import * as MeServices from "@/lib/hono/services/me.service";
import type { AppContext } from "@/lib/hono/app";
import { authMiddleware } from "@/lib/hono/middleware/auth.middleware";

const meApi = new OpenAPIHono<AppContext>();

meApi.use("*", authMiddleware);

/**
 * @method GET
 * @path /me/bookmarks/posts
 * @summary 내 북마크 게시글 목록 조회
 */
const bookmarkListRoute = createRoute({
  method: "get",
  path: "/bookmarks/posts",
  summary: "내 북마크 게시글 목록 조회",
  responses: createStandardApiResponses(
    {
      schema: CommunitySchemas.PaginatedPostListResponseSchema,
      description: "게시글 목록",
    },
    ["404"]
  ),
  tags: ["Me"],
});

meApi.openapi(bookmarkListRoute, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json(
      {
        success: false,
        message: "인증되지 않은 사용자 입니다.",
      },
      401
    );
  }
  const bookmarks = await MeServices.getBookmarkedPostMeService(
    user!.id as string
  );
  if (!bookmarks) {
    return c.json(
      {
        success: false,
        message: "북마크 목록을 찾을 수 없습니다.",
      },
      404
    );
  }
  return c.json(
    {
      success: true,
      message: "북마크 목록을 성공적으로 불러왔습니다.",
      data: bookmarks,
    },
    200
  );
});

/**
 * @method GET
 * @path /me/bookmarks/perfumes
 * @summary 내 북마크 향수 목록 조회
 */
const bookmarkPerfumeListRoute = createRoute({
  method: "get",
  path: "/bookmarks/perfumes",
  summary: "내 북마크 향수 목록 조회",
  responses: createStandardApiResponses(
    {
      schema: PerfumeSchemas.PerfumeListResponseSchema,
      description: "향수 목록",
    },
    ["404"]
  ),
  tags: ["Me"],
});

meApi.openapi(bookmarkPerfumeListRoute, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json(
      {
        success: false,
        message: "인증되지 않은 사용자 입니다.",
      },
      401
    );
  }
  const bookmarks = await MeServices.getBookmarkedPerfumeMeService(
    user!.id as string
  );
  if (!bookmarks) {
    return c.json(
      {
        success: false,
        message: "북마크 목록을 찾을 수 없습니다.",
      },
      404
    );
  }
  return c.json(
    {
      success: true,
      message: "북마크 목록을 성공적으로 불러왔습니다.",
      data: bookmarks,
    },
    200
  );
});

export default meApi;
