import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  ServiceResult,
  serviceSuccess,
  serviceInternalError,
  serviceAlreadyExists,
} from "../utils/serviceResult.utils";
import { PostWithAuthor } from "./community.service";
import { PerfumeBaseResponse } from "../schemas/perfume.schema";
import { supabaseAdmin } from "@/lib/supabase/init";

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
  if (!payload.perfumeId || typeof payload.perfumeId !== "string") {
    return serviceInternalError("향수 ID가 올바르지 않습니다.");
  }
  if (!payload.imageFile || !(payload.imageFile instanceof File)) {
    return serviceInternalError("이미지 파일이 필요합니다.");
  }
  const file = payload.imageFile as File;
  const filePath = `collections/${payload.userId}/${crypto.randomUUID()}-${
    file.name
  }`;
  const bucketName = "collection_image";
  try {
    // 0. 중복 체크
    const existingCollection = await prisma.userCollection.findFirst({
      where: {
        userId: payload.userId,
        perfumeId: payload.perfumeId as string,
      },
    });
    if (existingCollection) {
      return serviceAlreadyExists("이미 컬렉션에 추가된 향수입니다.");
    }

    // 1. 파일 업로드

    const { error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, file, { cacheControl: "3600", upsert: false });
    if (error) {
      return serviceInternalError(error.message);
    }
    // console.log("File uploaded successfully");
    // 2. 퍼블릭 URL 가져오기
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(bucketName).getPublicUrl(filePath);
    // console.log("Public URL:", publicUrl);
    // // 3. DB 저장
    const collection = await prisma.userCollection.create({
      data: {
        userId: payload.userId,
        perfumeId: payload.perfumeId as string,
        comment: payload.comment as string | null,
        image: {
          create: {
            imageUrl: publicUrl,
          },
        },
      },
      include: { image: true },
    });
    // console.log("Collection created successfully:", collection);
    return serviceSuccess(collection);
  } catch (err: unknown) {
    if (err instanceof Error) {
      // console.error(
      //   "Caught an exception in postPhotoCollectionService:",
      //   err.message
      // );
      // TODO: 파일 업로드 롤백 로직 추가
      // await supabaseAdmin.storage.from(bucketName).remove([filePath]);
      return serviceInternalError(err.message);
    }
    return serviceInternalError("알 수 없는 오류가 발생했습니다.");
  }
}
