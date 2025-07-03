import { OpenAPIHono } from "@hono/zod-openapi";
import {
  getPerfumesListRoute,
  getPerfumeByIdRoute,
} from "@/lib/api-spec/v1/perfume.routes";
import {
  getPerfumesListService,
  getPerfumeByIdService,
} from "@/lib/services/perfume.service";

const perfumesApi = new OpenAPIHono();

perfumesApi.openapi(getPerfumesListRoute, async (c) => {
  const perfumes = await getPerfumesListService();
  return c.json({
    success: true,
    message: "Perfumes list retrieved successfully",
    data: perfumes,
  });
});

perfumesApi.openapi(getPerfumeByIdRoute, async (c) => {
  const { id } = c.req.param();
  const perfume = await getPerfumeByIdService(id);
  if (!perfume) {
    return c.json(
      {
        success: false,
        message: "Perfume not found",
      },
      404
    );
  }
  return c.json(
    {
      success: true,
      message: "Perfume found",
      data: perfume,
    },
    200
  );
});

export default perfumesApi;
