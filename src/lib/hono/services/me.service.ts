import { ImageFormat, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  ServiceResult,
  serviceSuccess,
  serviceInternalError,
  serviceNotFound,
  serviceForbidden,
} from "../utils/service.utils";
import { BasePost } from "./community.service";
import { BasePerfume } from "./perfume.service";
import { FullReview, reviewIncludeArgs } from "./review.service";
import {
  ApiMyProfileResponse,
  ApiUpdateMyProfileRequest,
  ApiUpdateMyProfileRequestSchema,
} from "../schemas/me.schema";
import { deleteImageByUrl } from "./file.service";
import {
  COLLECTION_BUCKET_NAME,
  PROFILE_BUCKET_NAME,
} from "@/lib/constants/buckets";

const UUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const postIncludeArgs = {
  author: {
    select: { id: true, nickname: true, imageUrl: true },
  },
} satisfies Prisma.PostInclude;

const perfumeBaseInclude = {
  brand: { select: { nameEn: true, nameKo: true } },
  perfumeImage: { select: { imageUrl: true } },
} satisfies Prisma.PerfumeInclude;

const myCollectionInclude = {
  image: true,
} satisfies Prisma.UserCollectionInclude;
export type MyCollection = Prisma.UserCollectionGetPayload<{
  include: typeof myCollectionInclude;
}>;

const myCommentInclude = {
  post: { select: { id: true, title: true } },
} satisfies Prisma.CommentInclude;
export type MyComment = Prisma.CommentGetPayload<{
  include: typeof myCommentInclude;
}>;

/**
 * 인증된 사용자가 북마크한 게시글 목록을 조회합니다.
 * @param userId - 인증된 사용자의 ID
 */
export async function getMyBookmarkedPostsService(
  userId: string
): Promise<ServiceResult<BasePost[]>> {
  try {
    const bookmarks = await prisma.postBookmark.findMany({
      where: { userId },
      include: { post: { include: postIncludeArgs } },
      orderBy: { createdAt: "desc" },
    });

    const posts = bookmarks.map((b) => b.post);
    return serviceSuccess(posts);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 인증된 사용자가 최근 본 향수 목록을 조회합니다.
 * @param userId - 인증된 사용자의 ID
 */
export async function getRecentPerfumesService(userId: string): Promise<
  ServiceResult<{
    items: Array<{ id: string; viewedAt: Date; perfume: BasePerfume }>;
  }>
> {
  try {
    const views = await prisma.recentPerfumeView.findMany({
      where: { userId },
      orderBy: { viewedAt: "desc" },
      include: { perfume: { include: perfumeBaseInclude } },
    });

    const items = views.map((v) => ({
      id: v.perfumeId,
      viewedAt: v.viewedAt,
      perfume: v.perfume as unknown as BasePerfume,
    }));

    return serviceSuccess({ items });
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 인증된 사용자가 최근 본 게시글 목록을 조회합니다.
 * @param userId - 인증된 사용자의 ID
 */
export async function getRecentPostsService(userId: string): Promise<
  ServiceResult<{
    items: Array<{ id: string; viewedAt: Date; post: BasePost }>;
  }>
> {
  try {
    const views = await prisma.recentPostView.findMany({
      where: { userId },
      orderBy: { viewedAt: "desc" },
      include: { post: { include: postIncludeArgs } },
    });

    const items = views.map((v) => ({
      id: v.postId,
      viewedAt: v.viewedAt,
      post: v.post as unknown as BasePost,
    }));

    return serviceSuccess({ items });
  } catch (error) {
    return serviceInternalError(error);
  }
}

// 최근 본 항목 동기화 로직
const MAX_RECENT_ITEMS = 50;

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
 * 인증된 사용자가 북마크한 향수 목록을 조회합니다.
 * @param userId - 인증된 사용자의 ID
 */
export async function getMyBookmarkedPerfumesService(
  userId: string
): Promise<ServiceResult<BasePerfume[]>> {
  try {
    const bookmarks = await prisma.perfumeBookmark.findMany({
      where: { userId },
      include: { perfume: { include: perfumeBaseInclude } },
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
 * @param payload.imageInfo - 이미지 정보
 * @param payload.comment - 댓글
 */

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

export async function postPhotoCollectionService(
  payload: PostCollectionPayload
): Promise<ServiceResult<MyCollection>> {
  // 입력값 검증
  if (!payload.perfumeId || !UUID_REGEX.test(payload.perfumeId)) {
    return serviceInternalError(new Error("향수 ID가 올바르지 않습니다."));
  }
  if (!payload.imageInfo.imageUrl) {
    return serviceInternalError(new Error("이미지 URL이 필요합니다."));
  }

  try {
    // 0. 중복 체크
    const existingCollection = await prisma.userCollection.findUnique({
      where: {
        user_collections_user_id_perfume_id_key: {
          userId: payload.userId,
          perfumeId: payload.perfumeId,
        },
      },
      include: { image: true },
    });
    // console.log("existingCollection", existingCollection);
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
      where: {
        id: collectionId,
      },
    });

    return serviceSuccess({ message: "컬렉션을 삭제했습니다." });
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 사용자가 작성한 리뷰 목록을 조회합니다.
 * @param userId - 사용자의 ID
 * @returns 사용자의 향수 컬렉션
 */
export async function getMyReviewsService(
  userId: string
): Promise<ServiceResult<FullReview[]>> {
  try {
    const reviews = await prisma.review.findMany({
      where: { authorId: userId },
      include: reviewIncludeArgs,
      orderBy: { createdAt: "desc" },
    });
    return serviceSuccess(reviews);
  } catch (error) {
    return serviceInternalError(error);
  }
}
/**
 * 사용자의 작성한 게시글 목록을 조회합니다.
 * @param userId - 사용자의 ID
 * @returns 사용자의 작성한 게시글 목록
 */
export async function getMyPostsService(
  userId: string
): Promise<ServiceResult<BasePost[]>> {
  try {
    const posts = await prisma.post.findMany({
      where: { userId },
      include: postIncludeArgs,
      orderBy: { createdAt: "desc" },
    });
    return serviceSuccess(posts);
  } catch (error) {
    return serviceInternalError(error);
  }
}

/**
 * 사용자의 작성한 댓글 목록을 조회합니다.
 * @param userId - 사용자의 ID
 * @returns 사용자의 작성한 댓글 목록
 */
export async function getMyCommentsService(
  userId: string
): Promise<ServiceResult<MyComment[]>> {
  try {
    const comments = await prisma.comment.findMany({
      where: { authorId: userId },
      include: myCommentInclude,
      orderBy: { createdAt: "desc" },
    });
    return serviceSuccess(comments);
  } catch (error) {
    return serviceInternalError(error);
  }
}
/**
 * 사용자가 좋아요한 향수 목록을 조회합니다.
 * @param userId - 사용자의 ID
 * @returns 사용자의 좋아요한 향수 목록
 */
export async function getMyLikedPerfumesService(
  userId: string
): Promise<ServiceResult<BasePerfume[]>> {
  try {
    const likes = await prisma.perfumeLike.findMany({
      where: { userId },
      include: { perfume: { include: perfumeBaseInclude } },
      orderBy: { createdAt: "desc" },
    });
    // 5. 사용자가 원하는 '향수' 데이터를 반환
    return serviceSuccess(likes.map((like) => like.perfume));
  } catch (error) {
    return serviceInternalError(error);
  }
}
/**
 * 사용자가 좋아요한 게시글 목록을 조회합니다.
 * @param userId - 사용자의 ID
 * @returns 사용자의 좋아요한 게시글 목록
 */
export async function getMyLikedPostsService(
  userId: string
): Promise<ServiceResult<BasePost[]>> {
  try {
    const likes = await prisma.postLike.findMany({
      where: { userId },
      include: { post: { include: postIncludeArgs } },
      orderBy: { createdAt: "desc" },
    });
    // 5. 사용자가 원하는 '게시글' 데이터를 반환
    return serviceSuccess(likes.map((like) => like.post));
  } catch (error) {
    return serviceInternalError(error);
  }
}

export async function getMyProfileService(
  id: string
): Promise<ServiceResult<ApiMyProfileResponse>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        nickname: true,
        age: true,
        gender: true,
        imageUrl: true,
      },
    });

    if (!user) {
      return serviceNotFound("사용자를 찾을 수 없습니다.");
    }

    return serviceSuccess(user);
  } catch (error) {
    return serviceInternalError(error);
  }
}

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

    // 기존 프로필 이미지가 있다면 삭제
    if (user.imageUrl && user.imageUrl.includes(PROFILE_BUCKET_NAME)) {
      await deleteImageByUrl(PROFILE_BUCKET_NAME, user.imageUrl);
    }
    // undefined 값 제거
    let cleanedData;
    try {
      cleanedData = ApiUpdateMyProfileRequestSchema.partial()
        .strip()
        .parse(updateData);
    } catch (parseError) {
      console.error("[updateMyProfileService] Schema parse 에러:", parseError);
      throw parseError;
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
      },
    });

    return serviceSuccess(updatedUser);
  } catch (error) {
    console.error("[updateMyProfileService] 에러 발생:", error);
    return serviceInternalError(error);
  }
}
