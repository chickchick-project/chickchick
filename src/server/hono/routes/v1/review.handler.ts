import { createRoute, z } from "@hono/zod-openapi";

import * as CommonSchemas from "@/server/hono/schemas/common.schema";
import * as ReviewSchemas from "@/server/hono/schemas/review.schema";

import * as ReviewServices from "@/server/hono/services/review.service";

import {
  apiBadRequest,
  apiConflict,
  apiCreated,
  apiInternalError,
  apiNotFound,
  apiSuccess,
} from "@/server/hono/utils/api.utils";
import { createStandardApiResponses } from "@/server/hono/utils/openapi.schema";
import { createDomainRouters } from "@/server/hono/utils/router";


const routers = createDomainRouters();

/**
 * @method GET
 * @path /popular
 * @summary 인기 리뷰 조회
 * @description 인기 리뷰를 조회합니다.
 */
const getPopularReviewsRoute = createRoute({
  method: "get",
  path: "/popular",
  summary: "인기 리뷰 조회",
  description: "인기 리뷰를 조회합니다.",
  responses: createStandardApiResponses({
    schema: z.array(ReviewSchemas.ApiPopularReviewResponseSchema),
  }),
  tags: ["Review"],
});

routers.public.openapi(getPopularReviewsRoute, async (c) => {
  const result = await ReviewServices.getOneRandomPopularReviewService();

  if (!result.success) {
    return apiNotFound(c, result.message);
  }

  return apiSuccess(c, result.data, "인기 리뷰를 성공적으로 불러왔습니다.");
});

/**
 * @method GET
 * @path /{perfumeId}
 * @summary 특정 향수의 모든 리뷰 조회
 * @description 등록된 향수의 모든 리뷰 데이터를 조회.
 */
const getReviewRoute = createRoute({
  method: "get",
  path: "/{perfumeId}",
  summary: "특정 향수의 모든 리뷰 조회",
  description: "등록된 향수의 모든 리뷰 데이터를 조회합니다.",
  request: {
    params: CommonSchemas.ReviewPerfumeIdParamSchema,
  },
  responses: createStandardApiResponses({
    schema: z.array(ReviewSchemas.ApiReviewResponseSchema),
  }),
  tags: ["Review"],
});

routers.public.openapi(getReviewRoute, async (c) => {
  const { perfumeId } = c.req.param();

  const result = await ReviewServices.getReviewsByPerfumeIdService(perfumeId);

  if (!result.success) {
    return apiNotFound(c, result.message);
  }

  return apiSuccess(c, result.data, "리뷰를 성공적으로 불러왔습니다.");
});
/**
 * @method GET
 * @path /{perfumeId}/pagination
 * @summary 특정 향수의 리뷰 조회 (페이지네이션)
 * @description 등록된 향수의 모든 리뷰 데이터를 페이지네이션으로 조회.
 */
const getReviewWithPaginationRoute = createRoute({
  method: "get",
  path: "/{perfumeId}/pagination",
  summary: "특정 향수의 리뷰 조회 (페이지네이션)",
  description: "등록된 향수의 모든 리뷰 데이터를 페이지네이션으로 조회합니다.",
  request: {
    params: CommonSchemas.ReviewPerfumeIdParamSchema,
    query: z.object({
      take: z.string().optional().default("12").transform(Number),
      cursor: z.string().uuid("유효하지 않은 커서 ID입니다.").optional(),
    }),
  },
  responses: createStandardApiResponses({
    schema: ReviewSchemas.PaginatedApiReviewResponseSchema,
  }),
  tags: ["Review"],
});

routers.public.openapi(getReviewWithPaginationRoute, async (c) => {
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

/**
 * @method POST
 * @path /{perfumeId}
 * @summary 새로운 리뷰 생성
 * @description 새로운 리뷰를 생성함
 */
const createReviewRoute = createRoute({
  method: "post",
  path: "/{perfumeId}",
  summary: "새로운 리뷰 생성",
  description: "새로운 리뷰를 생성함",
  request: {
    params: CommonSchemas.ReviewPerfumeIdParamSchema,
    body: {
      content: {
        "application/json": { schema: ReviewSchemas.CreateReviewInputSchema },
      },
    },
  },
  responses: createStandardApiResponses({
    schema: ReviewSchemas.ApiReviewResponseSchema,
  }),
  tags: ["Review"],
});

routers.authenticated.openapi(createReviewRoute, async (c) => {
  const { perfumeId } = c.req.param();
  const validatedData = c.req.valid("json");
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");

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

/**
 * @method POST
 * @path /{reviewId}/like
 * @summary 리뷰 좋아요/싫어요 토글
 * @description 리뷰에 대해 좋아요/싫어요를 토글합니다.
 */
const toggleLikeRoute = createRoute({
  method: "post",
  path: "/{reviewId}/like",
  summary: "리뷰 좋아요/싫어요 토글",
  description: "리뷰에 대해 좋아요/싫어요를 토글합니다.",
  request: {
    params: ReviewSchemas.ReviewIdParamSchema,
  },
  responses: createStandardApiResponses({
    schema: ReviewSchemas.ApiReviewResponseSchema,
  }),
  tags: ["Review"],
});

routers.authenticated.openapi(toggleLikeRoute, async (c) => {
  const { reviewId } = c.req.param();
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");

  const result = await ReviewServices.toggleLikeService(reviewId, user.id);

  if (!result.success) {
    return apiNotFound(c, result.message);
  }

  return apiSuccess(
    c,
    result.data,
    "리뷰 좋아요/싫어요가 성공적으로 변경되었습니다."
  );
});

export default routers.merge();
