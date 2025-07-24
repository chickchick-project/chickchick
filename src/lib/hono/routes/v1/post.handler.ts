import { OpenAPIHono } from "@hono/zod-openapi";
import { getPostListRoute } from "@/lib/hono/api-spec/v1/post.routes";
import { getPaginatedPostListService } from "@/lib/hono/services/post.service";

const postApi = new OpenAPIHono();

postApi.openapi(getPostListRoute, async (c) => {
  const queryParams = c.req.valid("query");
  const result = await getPaginatedPostListService(queryParams);
  return c.json({
    success: true,
    message: "게시글 목록을 성공적으로 불러왔습니다.",
    ...result,
  } as const);
});
export default postApi;
