import { ImageFormat } from "@prisma/client";
import { prisma } from "@/server/prisma";
import {
  ServiceResult,
  serviceSuccess,
  serviceInternalError,
  serviceNotFound,
  serviceForbidden,
} from "@/server/result";
import { COLLECTION_BUCKET_NAME } from "@/shared/constants/buckets";
import { deleteImageByUrl } from "../file.service";
import {
  MyCollection,
  myCollectionInclude,
} from "../../repositories/user.repository";
import { validateUuid } from "@/shared/utils/validate.utils";

interface PostCollectionPayload {
  userId: string;
  perfumeId: string;
  comment?: string;
  imageInfo: {
    imageUrl: string;
    width: number;
    height: number;
    format: ImageFormat;
  };
}

/**
 * 향수 컬렉션 사진을 등록합니다.
 */
export async function postPhotoCollectionService(
  payload: PostCollectionPayload
): Promise<ServiceResult<MyCollection>> {
  const uuidValidation = validateUuid(payload.perfumeId, "향수");
  if (!uuidValidation.success) return uuidValidation;
  if (!payload.imageInfo.imageUrl) {
    return serviceInternalError(new Error("이미지 URL이 필요합니다."));
  }

  try {
    const existingCollection = await prisma.userCollection.findUnique({
      where: {
        user_collections_user_id_perfume_id_key: {
          userId: payload.userId,
          perfumeId: payload.perfumeId,
        },
      },
      include: { image: true },
    });
    if (existingCollection?.image) {
      await deleteImageByUrl(
        COLLECTION_BUCKET_NAME,
        existingCollection.image.imageUrl
      );
    }

    const newImageData = {
      imageUrl: payload.imageInfo.imageUrl,
      width: payload.imageInfo.width,
      height: payload.imageInfo.height,
      format: payload.imageInfo.format,
    };

    const resultCollection = await prisma.userCollection.upsert({
      where: {
        user_collections_user_id_perfume_id_key: {
          userId: payload.userId,
          perfumeId: payload.perfumeId,
        },
      },
      create: {
        userId: payload.userId,
        perfumeId: payload.perfumeId,
        comment: payload.comment || null,
        image: { create: newImageData },
      },
      update: {
        comment: payload.comment || null,
        image: {
          delete: existingCollection?.image ? true : false,
          create: newImageData,
        },
      },
      include: myCollectionInclude,
    });

    return serviceSuccess(resultCollection);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 향수 컬렉션 사진을 삭제합니다.
 */
export async function deletePhotoCollectionService(payload: {
  userId: string;
  collectionId: string;
}): Promise<ServiceResult<{ message: string }>> {
  const { userId, collectionId } = payload;
  try {
    const collection = await prisma.userCollection.findUnique({
      where: { id: collectionId },
      include: { image: true },
    });

    if (!collection) {
      return serviceNotFound("해당 컬렉션을 찾을 수 없습니다.");
    }
    if (collection.userId !== userId) {
      return serviceForbidden("컬렉션을 삭제할 권한이 없습니다.");
    }

    if (collection.image) {
      await deleteImageByUrl(COLLECTION_BUCKET_NAME, collection.image.imageUrl);
    }

    await prisma.userCollection.delete({
      where: { id: collectionId },
    });

    return serviceSuccess({ message: "컬렉션을 삭제했습니다." });
  } catch (error) {
    return serviceInternalError(error);
  }
}
