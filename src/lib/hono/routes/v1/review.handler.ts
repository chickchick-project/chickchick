import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import * as ReviewServices from "@/lib/hono/services/review.service";
import {
  ReviewResponseSchema,
  CreateReviewSchema,
  CreateReviewBodySchema,
} from "@/lib/hono/schemas/review.schema";
import { AppContext } from "@/lib/hono/app";
import { createStandardApiResponses } from "@/lib/hono/utils/createStandardApiResponses";
import { authMiddleware } from "@/lib/hono/middleware/auth.middleware";
import { transformReviewToResponse } from "@/lib/hono/utils/transformReviewToResponse";
import { getAuthenticatedUser } from "@/lib/hono/utils/service.utils";
import {
  apiBadRequest,
  apiConflict,
  apiCreated,
  apiInternalError,
  apiNotFound,
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
  responses: createStandardApiResponses(
    {
      schema: z.array(ReviewResponseSchema),
      description: "리뷰 목록",
    },
    ["404"]
  ),
  tags: ["Review"],
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
  responses: createStandardApiResponses(
    {
      schema: z.array(ReviewResponseSchema),
      description: "리뷰 목록 (페이지네이션)",
    },
    ["404"]
  ),
  tags: ["Review"],
});

reviewsApi.openapi(getReviewRoute, async (c) => {
  const { perfumeId } = c.req.param();

  const result = await ReviewServices.getReviewsByPerfumeIdService(perfumeId);

  if (!result.success) {
    return c.json(
      { success: false, error: result.error, message: result.message },
      { status: 404 }
    );
  }

  return c.json(
    {
      success: true,
      data: result.data.map(transformReviewToResponse),
      message: "리뷰를 성공적으로 불러왔습니다.",
    },
    { status: 200 }
  );
});

reviewsApi.openapi(getReviewWithPaginationRoute, async (c) => {
  const { perfumeId } = c.req.param();
  const { take, cursor } = c.req.valid("query");

  const result = await ReviewServices.getPaginatedReviewsByPerfumeIdService(
    perfumeId,
    {
      limit: take,
      cursor: cursor,
    }
  );

  if (!result.success) {
    return c.json(
      { success: false, error: result.error, message: result.message },
      { status: 404 }
    );
  }

  const transformedData = {
    data: result.data.data.map(transformReviewToResponse),
    totalCount: result.data.totalCount,
    nextCursor: result.data.nextCursor,
  };

  return c.json(
    {
      success: true,
      data: transformedData,
      message: "리뷰를 성공적으로 불러왔습니다.",
    },
    { status: 200 }
  );
});

const createReviewRoute = createRoute({
  method: "post",
  path: "/{perfumeId}",
  summary: "새로운 리뷰 생성",
  description: "새로운 리뷰를 생성함",
  request: {
    params: z.object({
      perfumeId: z
        .string()
        .uuid()
        .openapi({
          param: { name: "perfumeId", in: "path" },
          example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        }),
    }),
    query: CreateReviewSchema,
    body: {
      content: {
        "application/json": {
          schema: CreateReviewBodySchema,
        },
      },
      description: "생성할 리뷰 정보",
    },
  },
  responses: createStandardApiResponses(
    {
      schema: ReviewResponseSchema,
      description: "리뷰",
    },
    ["400", "404"]
  ),
  tags: ["Review"],
});

authenticatedApi.openapi(createReviewRoute, async (c) => {
  const { perfumeId } = c.req.param();
  const queryData = c.req.valid("query");
  const bodyData = c.req.valid("json");
  const user = getAuthenticatedUser(c);

  const payload = {
    ...queryData,
    ...bodyData,
    perfumeId,
    authorId: user.id,
  } as const;

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

  const responseData = transformReviewToResponse(result.data);

  return apiCreated(c, responseData, "리뷰가 성공적으로 작성되었습니다.");
});

reviewsApi.route("/", authenticatedApi);

export default reviewsApi;
