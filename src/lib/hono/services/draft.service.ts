import { prisma } from "@/lib/prisma";
import {
  checkResourceExists,
  serviceForbidden,
  serviceInternalError,
  serviceNotFound,
  ServiceResult,
  serviceSuccess,
} from "../utils/service.utils";
import {
  ApiDraftListResponse,
  ApiDraftResponse,
  CreateDraftPayload,
} from "../schemas/draft.schema";

/**
 * perfumeIds를 기반으로 향수 정보 조회
 * @param perfumeIds 조회할 향수 ID 배열
 * @returns 향수 정보 배열 (perfumeIds 순서 유지)
 */
async function getPerfumesByIds(perfumeIds: string[]) {
  if (!perfumeIds || perfumeIds.length === 0) {
    return [];
  }

  const perfumeRecords = await prisma.perfume.findMany({
    where: {
      id: { in: perfumeIds },
    },
    include: {
      brand: {
        select: {
          nameEn: true,
          nameKo: true,
          brandUrl: true,
        },
      },
      perfumeImage: {
        select: {
          imageUrl: true,
        },
      },
    },
  });

  // perfumeIds 순서대로 정렬
  return perfumeIds
    .map((id) => perfumeRecords.find((p) => p.id === id))
    .filter((p) => p !== undefined)
    .map((perfume) => ({
      id: perfume!.id,
      nameEn: perfume!.nameEn,
      nameKo: perfume!.nameKo,
      brand: perfume!.brand,
      perfumeImage: perfume!.perfumeImage,
    }));
}

/**
 * 임시 저장을 생성하거나 업데이트합니다 (Upsert).
 * - postId가 있는 경우: 해당 postId에 대한 사용자의 임시 저장을 업데이트하거나 생성
 * - postId가 없는 경우: 새 게시글 작성을 위한 임시 저장을 업데이트하거나 생성
 * - perfumeIds만 저장하고, perfumes 객체는 저장하지 않음 (조회 시 perfumeIds로 조회)
 */
export const createOrUpdateDraftService = async (
  payload: CreateDraftPayload,
): Promise<ServiceResult<ApiDraftResponse>> => {
  try {
    const { userId, postId, perfumeIds, ...draftData } = payload;

    // 사용자 존재 확인
    const userCheck = await checkResourceExists("user", userId, "사용자");
    if (!userCheck.success) return userCheck;

    // postId가 제공된 경우, 해당 게시글 존재 확인
    if (postId) {
      const postCheck = await checkResourceExists("post", postId, "게시글");
      if (!postCheck.success) return postCheck;
    }

    let draft;

    if (postId) {
      // postId가 있는 경우: unique constraint를 사용하여 upsert
      draft = await prisma.postDraft.upsert({
        where: {
          post_drafts_user_id_post_id_key: {
            userId,
            postId,
          },
        },
        create: {
          userId,
          postId,
          perfumeIds: perfumeIds || [],
          ...draftData,
        },
        update: {
          perfumeIds: perfumeIds || [],
          ...draftData,
        },
      });
    } else {
      // postId가 없는 경우: 기존 새 게시글용 임시 저장 찾기
      const existingDraft = await prisma.postDraft.findFirst({
        where: {
          userId,
          postId: null,
        },
      });

      if (existingDraft) {
        // 기존 임시 저장 업데이트
        draft = await prisma.postDraft.update({
          where: { id: existingDraft.id },
          data: {
            perfumeIds: perfumeIds || [],
            ...draftData,
          },
        });
      } else {
        // 새 임시 저장 생성
        draft = await prisma.postDraft.create({
          data: {
            userId,
            postId: null,
            perfumeIds: perfumeIds || [],
            ...draftData,
          },
        });
      }
    }

    // perfumeIds를 기반으로 향수 정보 조회
    const perfumesData = await getPerfumesByIds(draft.perfumeIds);

    // API 응답 형식으로 변환
    const response: ApiDraftResponse = {
      id: draft.id,
      userId: draft.userId,
      title: draft.title,
      content: draft.content,
      contentText: draft.contentText,
      category: draft.category,
      thumbnailUrl: draft.thumbnailUrl,
      perfumeIds: draft.perfumeIds,
      perfumes: perfumesData,
      postId: draft.postId,
      createdAt: draft.createdAt.toISOString(),
      updatedAt: draft.updatedAt.toISOString(),
    };

    return serviceSuccess(response);
  } catch (error) {
    return serviceInternalError(error);
  }
};

/**
 * 특정 임시 저장을 조회합니다.
 * 소유권을 확인합니다.
 * perfumeIds를 기반으로 향수 정보를 조회하여 반환합니다.
 */
export const getDraftService = async (
  id: string,
  userId: string,
): Promise<ServiceResult<ApiDraftResponse>> => {
  try {
    const draft = await prisma.postDraft.findUnique({
      where: { id },
    });

    if (!draft) {
      return serviceNotFound("임시 저장을 찾을 수 없습니다.");
    }

    // 소유권 확인
    if (draft.userId !== userId) {
      return serviceForbidden("임시 저장을 조회할 권한이 없습니다.");
    }

    // perfumeIds를 기반으로 향수 정보 조회
    const perfumes = await getPerfumesByIds(draft.perfumeIds);

    const response: ApiDraftResponse = {
      id: draft.id,
      userId: draft.userId,
      title: draft.title,
      content: draft.content,
      contentText: draft.contentText,
      category: draft.category,
      thumbnailUrl: draft.thumbnailUrl,
      perfumeIds: draft.perfumeIds,
      perfumes: perfumes,
      postId: draft.postId,
      createdAt: draft.createdAt.toISOString(),
      updatedAt: draft.updatedAt.toISOString(),
    };

    return serviceSuccess(response);
  } catch (error) {
    return serviceInternalError(error);
  }
};

/**
 * 현재 사용자의 모든 임시 저장 목록을 조회합니다.
 * 최근 업데이트 순으로 정렬합니다.
 * perfumeIds를 기반으로 향수 정보를 조회하여 반환합니다.
 */
export const listDraftsService = async (
  userId: string,
): Promise<ServiceResult<ApiDraftListResponse>> => {
  try {
    const drafts = await prisma.postDraft.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    // 모든 draft의 perfumeIds를 수집
    const allPerfumeIds = Array.from(
      new Set(drafts.flatMap((draft) => draft.perfumeIds)),
    );

    // 한 번에 모든 향수 정보 조회
    const perfumeData =
      allPerfumeIds.length > 0
        ? await prisma.perfume.findMany({
            where: {
              id: {
                in: allPerfumeIds,
              },
            },
            include: {
              brand: {
                select: {
                  nameEn: true,
                  nameKo: true,
                  brandUrl: true,
                },
              },
              perfumeImage: {
                select: {
                  imageUrl: true,
                },
              },
            },
          })
        : [];

    // perfume 데이터를 ID로 매핑
    const perfumeMap = new Map(
      perfumeData.map((p) => [
        p.id,
        {
          id: p.id,
          nameEn: p.nameEn,
          nameKo: p.nameKo,
          brand: p.brand,
          perfumeImage: p.perfumeImage,
        },
      ]),
    );

    const response: ApiDraftListResponse = drafts.map((draft) => {
      // perfumeIds 순서대로 향수 정보 조회
      const perfumes = draft.perfumeIds
        .map((id) => perfumeMap.get(id))
        .filter((p) => p !== undefined);

      return {
        id: draft.id,
        userId: draft.userId,
        title: draft.title,
        content: draft.content,
        contentText: draft.contentText,
        category: draft.category,
        thumbnailUrl: draft.thumbnailUrl,
        perfumeIds: draft.perfumeIds,
        perfumes: perfumes,
        postId: draft.postId,
        createdAt: draft.createdAt.toISOString(),
        updatedAt: draft.updatedAt.toISOString(),
      };
    });

    return serviceSuccess(response);
  } catch (error) {
    return serviceInternalError(error);
  }
};

/**
 * 임시 저장을 삭제합니다.
 * 소유권을 확인합니다.
 */
export const deleteDraftService = async (
  id: string,
  userId: string,
): Promise<ServiceResult<{ message: string }>> => {
  try {
    const draft = await prisma.postDraft.findUnique({
      where: { id },
    });

    if (!draft) {
      return serviceNotFound("임시 저장을 찾을 수 없습니다.");
    }

    // 소유권 확인
    if (draft.userId !== userId) {
      return serviceForbidden("임시 저장을 삭제할 권한이 없습니다.");
    }

    await prisma.postDraft.delete({
      where: { id },
    });

    return serviceSuccess({ message: "임시 저장이 삭제되었습니다." });
  } catch (error) {
    return serviceInternalError(error);
  }
};
