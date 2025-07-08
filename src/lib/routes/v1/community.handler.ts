import { OpenAPIHono, z } from "@hono/zod-openapi";
import { getPostsRoute } from "@/lib/api-spec/v1/community.routes";
import { getPostsService } from "@/lib/services/community.service";
import PostScalarFieldEnumSchema from "@zod/inputTypeSchemas/PostScalarFieldEnumSchema";

type OrderablePostFields = z.infer<typeof PostScalarFieldEnumSchema>;

const communityApi = new OpenAPIHono();

communityApi.openapi(getPostsRoute, async (c) => {
  const posts = await getPostsService({
    searchInput: c.req.query("searchInput") ?? "",
    order: (c.req.query("order") as OrderablePostFields) ?? "createdAt",
    skip: Number(c.req.query("skip") ?? 0),
    take: Number(c.req.query("take") ?? 10),
  });
  if (!posts) {
    return c.json(
      {
        success: false,
        message: "Posts not found",
      },
      404
    );
  }
  return c.json(
    {
      success: true,
      message: "Posts retrieved successfully",
      data: posts,
    },
    200
  );
});

export default communityApi;
