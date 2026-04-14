import { Prisma } from "@prisma/client";
import { prisma } from "@/server/prisma";
import {
  ServiceResult,
  serviceSuccess,
  serviceInternalError,
  serviceBadRequest,
  serviceNotFound,
  serviceError,
} from "@/server/result";
import {
  ApiMyProfileResponse,
  ApiUpdateMyProfileRequest,
  ApiUpdateMyProfileRequestSchema,
} from "../../schemas/me.schema";
import { PROFILE_BUCKET_NAME } from "@/shared/constants/buckets";
import { deleteImageByUrl } from "../file.service";
import { calculateLevel, getPointsForNextLevel } from "@/shared/utils/level.utils";

const MAX_RECENT_ITEMS = 50;

/**
 * 최근 본 향수 목록을 동기화합니다.
 */
export async function syncRecentPerfumesService(payload: {
  userId: string;
  perfumeIds: string[];
}): Promise<ServiceResult<{ syncedCount: number }>> {
  const { userId, perfumeIds } = payload;
  try {
    const now = new Date();

    for (const perfumeId of perfumeIds) {
      await prisma.recentPerfumeView.upsert({
        where: {
          recent_perfume_user_id_perfume_id_key: { userId, perfumeId },
        },
        create: { userId, perfumeId, viewedAt: now },
        update: { viewedAt: now },
      });
    }

    const toDelete = await prisma.recentPerfumeView.findMany({
      where: { userId },
      orderBy: { viewedAt: "desc" },
      skip: MAX_RECENT_ITEMS,
      select: { id: true },
    });
    if (toDelete.length > 0) {
      await prisma.recentPerfumeView.deleteMany({
        where: { id: { in: toDelete.map((r: { id: string }) => r.id) } },
      });
    }

    return serviceSuccess({ syncedCount: perfumeIds.length });
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 최근 본 게시글 목록을 동기화합니다.
 */
export async function syncRecentPostsService(payload: {
  userId: string;
  postIds: string[];
}): Promise<ServiceResult<{ syncedCount: number }>> {
  const { userId, postIds } = payload;
  try {
    const now = new Date();

    for (const postId of postIds) {
      await prisma.recentPostView.upsert({
        where: {
          recent_post_user_id_post_id_key: { userId, postId },
        },
        create: { userId, postId, viewedAt: now },
        update: { viewedAt: now },
      });
    }

    const toDelete = await prisma.recentPostView.findMany({
      where: { userId },
      orderBy: { viewedAt: "desc" },
      skip: MAX_RECENT_ITEMS,
      select: { id: true },
    });
    if (toDelete.length > 0) {
      await prisma.recentPostView.deleteMany({
        where: { id: { in: toDelete.map((r: { id: string }) => r.id) } },
      });
    }

    return serviceSuccess({ syncedCount: postIds.length });
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 내 계정을 탈퇴 처리합니다 (소프트 삭제).
 */
export async function deleteMyAccountService(
  userId: string
): Promise<ServiceResult<{ message: string }>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isActive: true, imageUrl: true, nickname: true },
    });

    if (!user) {
      return serviceNotFound("사용자를 찾을 수 없습니다.");
    }

    if (!user.isActive) {
      return serviceError("BAD_REQUEST", "이미 탈퇴한 계정입니다.");
    }

    if (user.imageUrl && user.imageUrl.includes(PROFILE_BUCKET_NAME)) {
      await deleteImageByUrl(PROFILE_BUCKET_NAME, user.imageUrl);
    }

    const now = new Date();
    await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        deletedAt: now,
        imageUrl: null,
        nickname: `${user.nickname}_deleted_${now.getTime()}`,
      },
    });

    return serviceSuccess({ message: "회원 탈퇴가 완료되었습니다." });
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 내 프로필 정보를 수정합니다.
 */
export async function updateMyProfileService(
  formData: ApiUpdateMyProfileRequest & { id: string }
): Promise<ServiceResult<ApiMyProfileResponse>> {
  try {
    const { id, ...updateData } = formData;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    if (!user) {
      return serviceNotFound("사용자를 찾을 수 없습니다.");
    }

    const cleanedData = ApiUpdateMyProfileRequestSchema.partial()
      .strip()
      .parse(updateData);

    // 새 이미지로 교체하는 경우에만 기존 파일 삭제
    if (
      cleanedData.imageUrl !== undefined &&
      user.imageUrl &&
      user.imageUrl.includes(PROFILE_BUCKET_NAME)
    ) {
      await deleteImageByUrl(PROFILE_BUCKET_NAME, user.imageUrl);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: cleanedData,
      select: {
        id: true,
        name: true,
        nickname: true,
        age: true,
        gender: true,
        imageUrl: true,
        totalPoints: true,
        consecutiveLoginDays: true,
      },
    });

    const level = calculateLevel(updatedUser.totalPoints);
    const nextLevelPoints = getPointsForNextLevel(updatedUser.totalPoints);

    return serviceSuccess({
      ...updatedUser,
      level,
      nextLevelPoints,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return serviceBadRequest("이미 사용 중인 닉네임입니다.");
    }
    return serviceInternalError(error);
  }
}
