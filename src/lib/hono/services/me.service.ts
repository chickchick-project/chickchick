import sharp from "sharp";
import { Prisma } from "@prisma/client";
import { supabaseAdmin } from "@/lib/supabase/init";
import { prisma } from "@/lib/prisma";
import {
  ServiceResult,
  serviceSuccess,
  serviceInternalError,
} from "../utils/serviceResult.utils";
import { PostWithAuthor } from "./community.service";
import { PerfumeBaseResponse } from "../schemas/perfume.schema";
import { getImageFormat } from "../utils/service.utils";

const UUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const bucketName = "collection_image";
const filePath = (userId: string, file: File) =>
  `collections/${userId}/${crypto.randomUUID()}-${file.name}`;

const postIncludeArgs = {
  author: {
    select: { id: true, nickname: true, imageUrl: true },
  },
} satisfies Prisma.PostInclude;

const perfumeBaseInclude = {
  brand: { select: { nameEn: true, nameKo: true } },
  perfumeImage: { select: { imageUrl: true } },
} satisfies Prisma.PerfumeInclude;

const postWithAuthorArgs = { include: postIncludeArgs };

/**
 * 인증된 사용자가 북마크한 게시글 목록을 조회합니다.
 * @param userId - 인증된 사용자의 ID
 */
export async function getMyBookmarkedPostsService(
  userId: string
): Promise<ServiceResult<PostWithAuthor[]>> {
  try {
    const bookmarks = await prisma.postBookmark.findMany({
      where: { userId },
      select: {
        post: {
          ...postWithAuthorArgs,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const posts = bookmarks.map((b) => b.post);
    return serviceSuccess(posts);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 인증된 사용자가 북마크한 향수 목록을 조회합니다.
 * @param userId - 인증된 사용자의 ID
 */
export async function getMyBookmarkedPerfumesService(
  userId: string
): Promise<ServiceResult<PerfumeBaseResponse[]>> {
  try {
    const bookmarks = await prisma.perfumeBookmark.findMany({
      where: { userId },
      select: {
        perfume: {
          include: perfumeBaseInclude,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const perfumes = bookmarks.map((b) => b.perfume);
    return serviceSuccess(perfumes);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 인증된 사용자가 향수 컬렉션을 등록합니다.
 * @param payload - 향수 컬렉션 등록 정보
 * @param payload.userId - 인증된 사용자의 ID
 * @param payload.perfumeId - 향수 ID
 * @param payload.imageFile - 이미지 파일
 * @param payload.comment - 댓글
 */
export async function postPhotoCollectionService(payload: {
  userId: string;
  perfumeId: FormDataEntryValue | null;
  imageFile: FormDataEntryValue | null;
  comment: FormDataEntryValue | null;
}) {
  let uploadedPath: string | null = null;

  // 입력값 검증
  if (
    !payload.perfumeId ||
    typeof payload.perfumeId !== "string" ||
    !UUID_REGEX.test(payload.perfumeId)
  ) {
    return serviceInternalError(new Error("향수 ID가 올바르지 않습니다."));
  }
  if (!payload.imageFile || !(payload.imageFile instanceof File)) {
    return serviceInternalError(new Error("이미지 파일이 필요합니다."));
  }

  try {
    // 0. 중복 체크
    const existingCollection = await prisma.userCollection.findUnique({
      where: {
        user_collections_user_id_perfume_id_key: {
          userId: payload.userId,
          perfumeId: payload.perfumeId as string,
        },
      },
      include: { image: true },
    });
    // console.log("existingCollection", existingCollection);
    if (existingCollection?.image) {
      const oldImageUrl = existingCollection.image.imageUrl;
      const oldFilePath = oldImageUrl.substring(
        oldImageUrl.indexOf(bucketName) + bucketName.length + 1
      );
      await supabaseAdmin.storage.from(bucketName).remove([oldFilePath]);
    }

    const file = payload.imageFile as File;
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(fileBuffer).metadata();
    const imageFormat = getImageFormat(metadata.format);

    const newFilePath = filePath(payload.userId, file);

    // 1. 파일 업로드
    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(newFilePath, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
      });

    if (error) serviceInternalError(error.message);

    // console.log("File uploaded successfully");
    uploadedPath = data!.path;
    // console.log(uploadedPath);
    // 2. 퍼블릭 URL 가져오기
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(bucketName).getPublicUrl(uploadedPath);
    // console.log("Public URL:", publicUrl);

    const newImageData = {
      imageUrl: publicUrl,
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: imageFormat,
    };

    // // 3. DB 저장
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
        comment: (payload.comment as string) || null,
        image: { create: newImageData },
      },
      update: {
        comment: (payload.comment as string) || null,
        image: {
          delete: existingCollection?.image ? true : false,
          create: newImageData,
        },
      },
      include: { image: true },
    });

    // console.log("Collection created successfully:", resultCollection);
    return serviceSuccess(resultCollection);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return serviceInternalError(err.message);
    }
    return serviceInternalError("알 수 없는 오류가 발생했습니다.");
  }
}

export async function deletePhotoCollectionService(payload: {
  userId: string;
  collectionId: string;
}) {
  const { userId, collectionId } = payload;

  const collection = await prisma.userCollection.findUnique({
    where: {
      id: collectionId,
    },
    include: {
      image: true,
    },
  });

  if (!collection || collection.userId !== userId) {
    return serviceInternalError(
      "해당 컬렐션을 찾을 수 없거나 삭제 권한이 없습니다."
    );
  }

  if (collection.image) {
    const imageUrl = collection.image.imageUrl;
    const filePath = imageUrl.substring(
      imageUrl.indexOf(bucketName) + bucketName.length + 1
    );
    await supabaseAdmin.storage.from(bucketName).remove([filePath]);
  }

  await prisma.userCollection.delete({
    where: {
      id: collectionId,
    },
  });

  return serviceSuccess("컬렉션을 삭제했습니다.");
}

/**
 * 사용자가 작성한 리뷰 목록을 조회합니다.
 * @param userId - 사용자의 ID
 * @returns 사용자의 향수 컬렉션
 */
export async function getMyReviewsService(userId: string) {
  const reviews = await prisma.review.findMany({
    where: { authorId: userId },
    include: { perfume: true },
  });
  return serviceSuccess(reviews);
}
/**
 * 사용자의 작성한 게시글 목록을 조회합니다.
 * @param userId - 사용자의 ID
 * @returns 사용자의 작성한 게시글 목록
 */
export async function getMyPostsService(userId: string) {
  const posts = await prisma.post.findMany({
    where: { userId },
    include: { author: true },
  });
  return serviceSuccess(posts);
}
/**
 * 사용자의 작성한 댓글 목록을 조회합니다.
 * @param userId - 사용자의 ID
 * @returns 사용자의 작성한 댓글 목록
 */
export async function getMyCommentsService(userId: string) {
  const comments = await prisma.comment.findMany({
    where: { authorId: userId },
    include: {
      post: {
        select: { id: true, title: true },
      },
    },
  });
  return serviceSuccess(comments);
}
/**
 * 사용자가 좋아요한 향수 목록을 조회합니다.
 * @param userId - 사용자의 ID
 * @returns 사용자의 좋아요한 향수 목록
 */
export async function getMyLikedPerfumesService(userId: string) {
  const likedPerfumes = await prisma.perfumeBookmark.findMany({
    where: { userId },
    include: { perfume: true },
  });
  return serviceSuccess(likedPerfumes);
}
/**
 * 사용자가 좋아요한 게시글 목록을 조회합니다.
 * @param userId - 사용자의 ID
 * @returns 사용자의 좋아요한 게시글 목록
 */
export async function getMyLikedPostsService(userId: string) {
  const likedPosts = await prisma.postBookmark.findMany({
    where: { userId },
    include: { post: true },
  });
  return serviceSuccess(likedPosts);
}
