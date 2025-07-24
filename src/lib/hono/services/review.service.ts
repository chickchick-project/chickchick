import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  CreateReviewPayload,
  UpdateReview,
} from "../schemas/review.schema";
import {
  ServiceResult,
  serviceSuccess,
  serviceNotFound,
  serviceAlreadyExists,
  serviceInternalError,
} from "../utils/serviceResult.utils";
import { checkResourceExists, validateUuid } from "../utils/service.utils";
import { createCursorPaginationResult } from "../utils/pagination";

const DEFAULT_REVIEW_LIMIT = 12;

// --- Prisma 쿼리 인자 및 타입 정의 ---
const reviewIncludeArgs = {
  author: {
    select: { id: true, nickname: true, imageUrl: true },
  },
} satisfies Prisma.ReviewInclude;

const reviewWithAuthorArgs = { include: reviewIncludeArgs };

export type ReviewWithAuthor = Prisma.ReviewGetPayload<
  typeof reviewWithAuthorArgs
>;

// --- Prisma 쿼리 함수들 ---
async function findReviews(where: Prisma.ReviewWhereInput) {
  return prisma.review.findMany({
    where,
    orderBy: { createdAt: "desc" },
    ...reviewWithAuthorArgs,
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
    ...reviewWithAuthorArgs,
  });
}

async function countReviews(where: Prisma.ReviewWhereInput) {
  return prisma.review.count({ where });
}

async function createReview(data: CreateReviewPayload) {
  return prisma.review.create({
    data,
    ...reviewWithAuthorArgs,
  });
}

async function updateReview(reviewId: string, data: UpdateReview) {
  return prisma.review.update({
    where: { id: reviewId },
    data,
    ...reviewWithAuthorArgs,
  });
}

async function deleteReview(reviewId: string) {
  return prisma.review.delete({ where: { id: reviewId } });
}

// --- 서비스 함수들 ---

export async function getReviewsByPerfumeIdService(
  perfumeId: string
): Promise<ServiceResult<ReviewWithAuthor[]>> {
  try {
    const perfumeCheck = await checkResourceExists(
      "perfume",
      perfumeId,
      "향수"
    );
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
    const perfumeCheck = await checkResourceExists(
      "perfume",
      perfumeId,
      "향수"
    );
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

    const paginatedResult = createCursorPaginationResult(
      reviews,
      totalCount,
      limit
    );
    return serviceSuccess(paginatedResult);
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function createReviewService(
  reviewData: CreateReviewPayload
): Promise<ServiceResult<ReviewWithAuthor>> {
  try {
    const perfumeCheck = await checkResourceExists(
      "perfume",
      reviewData.perfumeId,
      "향수"
    );
    if (!perfumeCheck.success) return perfumeCheck;

    const userCheck = await checkResourceExists(
      "user",
      reviewData.authorId,
      "사용자"
    );
    if (!userCheck.success) return userCheck;

    const existingReview = await prisma.review.findFirst({
      where: { perfumeId: reviewData.perfumeId, authorId: reviewData.authorId },
    });
    if (existingReview) {
      return serviceAlreadyExists("이미 이 향수에 대한 리뷰를 작성하셨습니다.");
    }

    const newReview = await createReview(reviewData);
    return serviceSuccess(newReview);
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function updateReviewService(
  reviewId: string,
  authorId: string,
  updateData: UpdateReview
): Promise<ServiceResult<ReviewWithAuthor>> {
  try {
    const uuidValidation = validateUuid(reviewId, "리뷰");
    if (!uuidValidation.success) return uuidValidation;

    const review = await prisma.review.findFirst({
      where: { id: reviewId, authorId },
    });
    if (!review) {
      return serviceNotFound("리뷰를 찾을 수 없거나 수정 권한이 없습니다.");
    }

    const updatedReview = await updateReview(reviewId, updateData);
    return serviceSuccess(updatedReview);
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function deleteReviewService(
  reviewId: string,
  authorId: string
): Promise<ServiceResult<{ message: string }>> {
  try {
    const uuidValidation = validateUuid(reviewId, "리뷰");
    if (!uuidValidation.success) return uuidValidation;

    const review = await prisma.review.findFirst({
      where: { id: reviewId, authorId },
    });
    if (!review) {
      return serviceNotFound("리뷰를 찾을 수 없거나 삭제 권한이 없습니다.");
    }

    await deleteReview(reviewId);
    return serviceSuccess({ message: "리뷰가 성공적으로 삭제되었습니다." });
  } catch (error) {
    return serviceInternalError(error);
  }
}
