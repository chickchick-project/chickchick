import { Prisma } from "@prisma/client";
import { prisma } from "@/server/prisma";
import {
  ServiceResult,
  serviceSuccess,
  serviceInternalError,
} from "@/server/result";
import { checkResourceExists } from "../../repositories/base.repository";
import { createCursorPaginationResult } from "../../utils/pagination.utils";
import { reviewIncludeArgs, FullReview } from "../../repositories/review.repository";

const POPULAR_REVIEW_LIMIT = 5;
const POPULAR_REVIEW_POOL_SIZE = 20;
const DEFAULT_REVIEW_LIMIT = 12;

async function findReviews(where: Prisma.ReviewWhereInput) {
  return prisma.review.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: reviewIncludeArgs,
  });
}

async function findPaginatedReviews(params: {
  where: Prisma.ReviewWhereInput;
  limit: number;
  cursor?: string;
}) {
  return prisma.review.findMany({
    where: params.where,
    orderBy: { createdAt: "desc" },
    take: params.limit,
    cursor: params.cursor ? { id: params.cursor } : undefined,
    skip: params.cursor ? 1 : 0,
    include: reviewIncludeArgs,
  });
}

async function countReviews(where: Prisma.ReviewWhereInput) {
  return prisma.review.count({ where });
}

async function findPopularReviewsPool(): Promise<FullReview[]> {
  const popularReviewsWithCount = await prisma.review.findMany({
    include: {
      ...reviewIncludeArgs,
      _count: {
        select: { likes: true },
      },
    },
    orderBy: {
      likes: {
        _count: "desc",
      },
    },
    take: POPULAR_REVIEW_POOL_SIZE,
  });

  return popularReviewsWithCount.map((review) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _count, ...restOfReview } = review;
    return restOfReview;
  });
}

export async function getReviewsByPerfumeIdService(
  perfumeId: string
): Promise<ServiceResult<FullReview[]>> {
  try {
    const perfumeCheck = await checkResourceExists("perfume", perfumeId, "향수");
    if (!perfumeCheck.success) return perfumeCheck;

    const reviews = await findReviews({ perfumeId });
    return serviceSuccess(reviews);
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function getPaginatedReviewsByPerfumeIdService(
  perfumeId: string,
  options: { limit?: number; cursor?: string } = {}
) {
  try {
    const perfumeCheck = await checkResourceExists("perfume", perfumeId, "향수");
    if (!perfumeCheck.success) return perfumeCheck;

    const limit = options.limit ?? DEFAULT_REVIEW_LIMIT;
    const fetchLimit = limit + 1;

    const [reviews, totalCount] = await Promise.all([
      findPaginatedReviews({
        where: { perfumeId },
        limit: fetchLimit,
        cursor: options.cursor,
      }),
      countReviews({ perfumeId }),
    ]);

    const paginatedResult = createCursorPaginationResult(reviews, totalCount, limit);
    return serviceSuccess(paginatedResult);
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function getPopularReviewsService(): Promise<
  ServiceResult<FullReview[]>
> {
  try {
    const popularReviews = await findPopularReviewsPool();

    if (popularReviews.length <= POPULAR_REVIEW_LIMIT)
      return serviceSuccess(popularReviews);

    const shuffled = popularReviews.sort(() => 0.5 - Math.random());
    const selectedReviews = shuffled.slice(0, POPULAR_REVIEW_LIMIT);

    return serviceSuccess(selectedReviews);
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function getOneRandomPopularReviewService(): Promise<
  ServiceResult<FullReview>
> {
  try {
    const popularReviews = await findPopularReviewsPool();

    const randomIndex = Math.floor(Math.random() * popularReviews.length);
    const randomReview = popularReviews[randomIndex];

    return serviceSuccess(randomReview);
  } catch (error) {
    return serviceInternalError(error);
  }
}
