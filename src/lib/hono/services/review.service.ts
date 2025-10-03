import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
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
} from "../utils/serviceResult.utils";
import { checkResourceExists, validateUuid } from "../utils/service.utils";
import { createCursorPaginationResult } from "../utils/pagination";

let optionMap = new Map<string, number>();

async function initializeOptionMap() {
  console.log("Initializing AttributeOption map...");
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
    // console.log(
    //   `AttributeOption map initialized with ${optionMap.size} entries.`
    // );
  } catch (error) {
    console.error("Failed to initialize AttributeOption map:", error);
  }
}
// 서버 시작 시 한번만 실행되도록 호출
initializeOptionMap();

const DEFAULT_REVIEW_LIMIT = 12;

// --- Prisma 쿼리 인자 및 타입 정의 ---
export const reviewIncludeArgs = {
  author: {
    select: { id: true, nickname: true, imageUrl: true },
  },
  perfume: {
    select: { id: true, nameKo: true, nameEn: true },
  },
  attributeSelections: {
    include: {
      option: {
        include: {
          attribute: true,
        },
      },
    },
  },
} satisfies Prisma.ReviewInclude;

export type FullReview = Prisma.ReviewGetPayload<{
  include: typeof reviewIncludeArgs;
}>;

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

    console.log("review", reviews);

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
      if (selectionIds.length > 0) {
        await tx.reviewAttributeSelection.createMany({
          data: selectionIds.map((optionId) => ({
            reviewId: createdReview.id,
            attributeOptionId: optionId,
          })),
        });
      }

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
        const selectionIds = getOptionIdsFromAttributes(attributes);

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
