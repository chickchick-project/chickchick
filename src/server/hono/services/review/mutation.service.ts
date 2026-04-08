import { prisma } from "@/server/prisma";
import type {
  CreateReviewInput,
  UpdateReviewInput,
} from "../../schemas/review.schema";
import {
  ServiceResult,
  serviceSuccess,
  serviceNotFound,
  serviceAlreadyExists,
  serviceInternalError,
} from "@/server/result";
import { checkResourceExists } from "../../repositories/base.repository";
import { validateUuid } from "@/shared/utils/validate.utils";
import { reviewIncludeArgs, FullReview } from "../../repositories/review.repository";

async function getOptionIdsFromAttributes(
  attributes: CreateReviewInput["attributes"]
): Promise<number[]> {
  const allOptions = await prisma.attributeOption.findMany({
    include: { attribute: true },
  });
  const optionMap = new Map<string, number>();
  allOptions.forEach((opt) => {
    const key = `${opt.attribute.key}-${opt.value}`;
    optionMap.set(key, opt.id);
  });

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

    const selectionIds = await getOptionIdsFromAttributes(attributes);

    const newReview = await prisma.$transaction(async (tx) => {
      const createdReview = await tx.review.create({
        data: { content, usageStatus, perfumeId, authorId },
      });

      await tx.reviewAttributeSelection.createMany({
        data: selectionIds.map((optionId) => ({
          reviewId: createdReview.id,
          attributeOptionId: optionId,
        })),
      });

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

    const selectionIds = attributes
      ? await getOptionIdsFromAttributes(attributes as CreateReviewInput["attributes"])
      : [];

    const updatedReview = await prisma.$transaction(async (tx) => {
      if (content || usageStatus) {
        await tx.review.update({
          where: { id: reviewId },
          data: { content, usageStatus },
        });
      }

      if (attributes) {
        await tx.reviewAttributeSelection.deleteMany({ where: { reviewId } });

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
