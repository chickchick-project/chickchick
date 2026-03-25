import { Prisma } from "@prisma/client";
import { prisma } from "@/server/prisma";
import type {
  CreateReviewInput,
  UpdateReviewInput,
} from "../schemas/review.schema";
import {
  ServiceResult,
  serviceSuccess,
  serviceNotFound,
  serviceAlreadyExists,
  serviceInternalError,
} from "../utils/service.utils";
import { checkResourceExists, validateUuid } from "../utils/service.utils";
import { createCursorPaginationResult } from "../utils/pagination.utils";
import { reviewIncludeArgs, FullReview } from "../repositories/review.repository";

const POPULAR_REVIEW_LIMIT = 5;
const POPULAR_REVIEW_POOL_SIZE = 20;

let optionMap = new Map<string, number>();

async function initializeOptionMap() {
  try {
    const allOptions = await prisma.attributeOption.findMany({
      include: { attribute: true },
    });
    const newMap = new Map<string, number>();
    allOptions.forEach((opt) => {
      const key = `${opt.attribute.key}-${opt.value}`;
      newMap.set(key, opt.id);
    });
    optionMap = newMap;
  } catch (error) {
    console.error("Failed to initialize AttributeOption map:", error);
  }
}
// 서버 시작 시 한번만 실행되도록 호출
initializeOptionMap();

const DEFAULT_REVIEW_LIMIT = 12;

function getOptionIdsFromAttributes(
  attributes: CreateReviewInput["attributes"]
): number[] {
  const selectionIds: number[] = [];
  for (const [key, value] of Object.entries(attributes)) {
    if (!value) continue;
    const processValue = (val: string) => {
      const mapKey = `${key}-${val}`;
      const id = optionMap.get(mapKey);
      if (id) selectionIds.push(id);
    };
    if (Array.isArray(value)) {
      value.forEach(processValue);
    } else {
      processValue(value as string);
    }
  }
  return selectionIds;
}

// --- Prisma 쿼리 함수들 ---
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

// --- 서비스 함수들 ---
export async function getReviewsByPerfumeIdService(
  perfumeId: string
): Promise<ServiceResult<FullReview[]>> {
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
  payload: CreateReviewInput & { authorId: string; perfumeId: string }
): Promise<ServiceResult<FullReview>> {
  const { authorId, perfumeId, content, usageStatus, attributes } = payload;
  try {
    const [perfumeCheck, userCheck] = await Promise.all([
      checkResourceExists("perfume", perfumeId, "향수"),
      checkResourceExists("user", authorId, "사용자"),
    ]);
    if (!perfumeCheck.success) return perfumeCheck;
    if (!userCheck.success) return userCheck;

    const existingReview = await prisma.review.findFirst({
      where: { perfumeId, authorId },
    });
    if (existingReview) {
      return serviceAlreadyExists("이미 이 향수에 대한 리뷰를 작성하셨습니다.");
    }

    const selectionIds = getOptionIdsFromAttributes(attributes);

    // 트랜잭션 시작
    const newReview = await prisma.$transaction(async (tx) => {
      // 1. 핵심 Review 레코드 생성
      const createdReview = await tx.review.create({
        data: { content, usageStatus, perfumeId, authorId },
      });

      // 2. ReviewAttributeSelection 레코드들 생성
      await tx.reviewAttributeSelection.createMany({
        data: selectionIds.map((optionId) => ({
          reviewId: createdReview.id,
          attributeOptionId: optionId,
        })),
      });

      // 3. 완성된 리뷰 데이터를 조회하여 반환
      return tx.review.findUniqueOrThrow({
        where: { id: createdReview.id },
        include: reviewIncludeArgs,
      });
    });

    return serviceSuccess(newReview);
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function updateReviewService(
  reviewId: string,
  authorId: string,
  updateData: UpdateReviewInput
): Promise<ServiceResult<FullReview>> {
  try {
    const uuidValidation = validateUuid(reviewId, "리뷰");
    if (!uuidValidation.success) return uuidValidation;

    const review = await prisma.review.findFirst({
      where: { id: reviewId, authorId },
    });
    if (!review) {
      return serviceNotFound("리뷰를 찾을 수 없거나 수정 권한이 없습니다.");
    }

    const { content, usageStatus, attributes } = updateData;

    const updatedReview = await prisma.$transaction(async (tx) => {
      if (content || usageStatus) {
        await tx.review.update({
          where: { id: reviewId },
          data: {
            content,
            usageStatus,
          },
        });
      }

      if (attributes) {
        await tx.reviewAttributeSelection.deleteMany({ where: { reviewId } });
        const selectionIds = getOptionIdsFromAttributes(
          attributes as CreateReviewInput["attributes"]
        );

        if (selectionIds.length > 0) {
          await tx.reviewAttributeSelection.createMany({
            data: selectionIds.map((optionId) => ({
              reviewId: reviewId,
              attributeOptionId: optionId,
            })),
          });
        }
      }

      return await tx.review.findUniqueOrThrow({
        where: { id: reviewId },
        include: reviewIncludeArgs,
      });
    });
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

    await prisma.review.delete({
      where: { id: reviewId },
    });
    return serviceSuccess({ message: "리뷰가 성공적으로 삭제되었습니다." });
  } catch (error) {
    return serviceInternalError(error);
  }
}

//상위 리뷰 조회 서비스
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
    //_count 제거
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _count, ...restOfReview } = review;
    return restOfReview;
  });
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

//메인 베너에서 가져올 리뷰
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

export async function toggleLikeService(
  reviewId: string,
  userId: string
): Promise<ServiceResult<{ liked: boolean }>> {
  try {
    const [reviewCheck, userCheck] = await Promise.all([
      checkResourceExists("review", reviewId, "리뷰"),
      checkResourceExists("user", userId, "사용자"),
    ]);
    if (!reviewCheck.success) return reviewCheck;
    if (!userCheck.success) return userCheck;

    const like = await prisma.reviewLike.findUnique({
      where: { review_likes_user_id_review_id_key: { reviewId, userId } },
    });

    if (like) {
      await prisma.reviewLike.delete({ where: { id: like.id } });
      return serviceSuccess({ liked: false });
    } else {
      await prisma.reviewLike.create({ data: { reviewId, userId } });
      return serviceSuccess({ liked: true });
    }
  } catch (error) {
    return serviceInternalError(error);
  }
}
