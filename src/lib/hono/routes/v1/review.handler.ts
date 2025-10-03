import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import * as ReviewServices from "@/lib/hono/services/review.service";
import {
  ApiReviewResponseSchema,
  CreateReviewInputSchema,
  PaginatedApiReviewResponseSchema,
} from "@/lib/hono/schemas/review.schema";
import { AppContext } from "@/lib/hono/app";
import { createStandardApiResponses } from "@/lib/hono/utils/createStandardApiResponses";
import { authMiddleware } from "@/lib/hono/middleware/auth.middleware";
import { getAuthenticatedUser } from "@/lib/hono/utils/service.utils";
import {
  apiBadRequest,
  apiConflict,
  apiCreated,
  apiInternalError,
  apiNotFound,
  apiSuccess,
} from "@/lib/hono/utils/apiResponse.utils";

const reviewsApi = new OpenAPIHono<AppContext>();
const authenticatedApi = new OpenAPIHono<AppContext>();

authenticatedApi.use("*", authMiddleware);

const perfumeIdParam = z.object({
  perfumeId: z
    .string()
    .uuid()
    .openapi({
      param: { name: "perfumeId", in: "path" },
      example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    }),
});

const getReviewRoute = createRoute({
  method: "get",
  path: "/{perfumeId}",
  summary: "특정 향수의 모든 리뷰 조회",
  description: "등록된 향수의 모든 리뷰 데이터를 조회합니다.",
  request: {
    params: perfumeIdParam,
  },
  responses: createStandardApiResponses({
    schema: z.array(ApiReviewResponseSchema),
  }),
  tags: ["Review"],
});

reviewsApi.openapi(getReviewRoute, async (c) => {
  const { perfumeId } = c.req.param();

  const result = await ReviewServices.getReviewsByPerfumeIdService(perfumeId);

  if (!result.success) {
    return apiNotFound(c, result.message);
  }

  return apiSuccess(c, result.data, "리뷰를 성공적으로 불러왔습니다.");
});

const getReviewWithPaginationRoute = createRoute({
  method: "get",
  path: "/{perfumeId}/pagination",
  summary: "특정 향수의 리뷰 조회 (페이지네이션)",
  description: "등록된 향수의 모든 리뷰 데이터를 페이지네이션으로 조회합니다.",
  request: {
    params: perfumeIdParam,
    query: z.object({
      take: z.string().optional().default("12").transform(Number),
      cursor: z.string().uuid("유효하지 않은 커서 ID입니다.").optional(),
    }),
  },
  responses: createStandardApiResponses({
    schema: PaginatedApiReviewResponseSchema,
  }),
  tags: ["Review"],
});

reviewsApi.openapi(getReviewWithPaginationRoute, async (c) => {
  const { perfumeId } = c.req.param();
  const { take, cursor } = c.req.valid("query");
  const result = await ReviewServices.getPaginatedReviewsByPerfumeIdService(
    perfumeId,
    { limit: take, cursor }
  );

  if (!result.success) {
    return apiNotFound(c, result.message);
  }

  return apiSuccess(c, result.data, "리뷰를 성공적으로 불러왔습니다.");
});

const createReviewRoute = createRoute({
  method: "post",
  path: "/{perfumeId}",
  summary: "새로운 리뷰 생성",
  description: "새로운 리뷰를 생성함",
  request: {
    params: perfumeIdParam,
    body: {
      content: { "application/json": { schema: CreateReviewInputSchema } },
    },
  },
  responses: createStandardApiResponses({ schema: ApiReviewResponseSchema }),
  tags: ["Review"],
});

authenticatedApi.openapi(createReviewRoute, async (c) => {
  const { perfumeId } = c.req.param();
  const validatedData = c.req.valid("json");
  const user = getAuthenticatedUser(c);

  const payload = { ...validatedData, perfumeId, authorId: user.id };

  const result = await ReviewServices.createReviewService(payload);

  if (!result.success) {
    switch (result.error) {
      case "NOT_FOUND":
        return apiNotFound(c, result.message);
      case "ALREADY_EXISTS":
        return apiConflict(c, result.message);
      case "BAD_REQUEST":
        return apiBadRequest(c, result.message);
      default:
        return apiInternalError(c, result.message);
    }
  }

  return apiCreated(c, result.data, "리뷰가 성공적으로 작성되었습니다.");
});

reviewsApi.route("/", authenticatedApi);

export default reviewsApi;
