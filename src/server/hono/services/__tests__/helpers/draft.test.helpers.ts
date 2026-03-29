import { DraftType, PostCategory } from "@prisma/client";

export const getTestData = () => {
  const TEST_USER_ID = "123e4567-e89b-12d3-a456-426614174000";
  const TEST_POST_ID = "223e4567-e89b-12d3-a456-426614174001";
  const TEST_DRAFT_ID = "323e4567-e89b-12d3-a456-426614174002";
  const TEST_PERFUME_ID_1 = "423e4567-e89b-12d3-a456-426614174003";
  const TEST_PERFUME_ID_2 = "523e4567-e89b-12d3-a456-426614174004";

  return {
    ids: {
      userId: TEST_USER_ID,
      postId: TEST_POST_ID,
      draftId: TEST_DRAFT_ID,
      perfumeId1: TEST_PERFUME_ID_1,
      perfumeId2: TEST_PERFUME_ID_2,
    },

    createDraftPayload: () => ({
      userId: TEST_USER_ID,
      type: DraftType.CREATE,
      title: "테스트 제목",
      content: "테스트 내용",
      contentText: "테스트 내용 텍스트",
      category: PostCategory.QUESTION,
      thumbnailUrl: null,
      perfumeIds: [TEST_PERFUME_ID_1],
    }),

    updateDraftPayload: () => ({
      userId: TEST_USER_ID,
      type: DraftType.UPDATE,
      postId: TEST_POST_ID,
      title: "수정 제목",
      content: "수정 내용",
      contentText: "수정 내용 텍스트",
      category: PostCategory.QUESTION,
      thumbnailUrl: null,
      perfumeIds: [TEST_PERFUME_ID_1, TEST_PERFUME_ID_2],
    }),

    mockDraft: () => ({
      id: TEST_DRAFT_ID,
      userId: TEST_USER_ID,
      type: DraftType.CREATE,
      title: "테스트 제목",
      content: "테스트 내용",
      contentText: "테스트 내용 텍스트",
      category: PostCategory.QUESTION,
      thumbnailUrl: null,
      perfumeIds: [TEST_PERFUME_ID_1],
      postId: null,
      createdAt: new Date("2025-01-15T10:00:00.000Z"),
      updatedAt: new Date("2025-01-15T10:00:00.000Z"),
    }),

    mockUpdateDraft: () => ({
      id: TEST_DRAFT_ID,
      userId: TEST_USER_ID,
      type: DraftType.UPDATE,
      title: "수정 제목",
      content: "수정 내용",
      contentText: "수정 내용 텍스트",
      category: PostCategory.QUESTION,
      thumbnailUrl: null,
      perfumeIds: [TEST_PERFUME_ID_1, TEST_PERFUME_ID_2],
      postId: TEST_POST_ID,
      createdAt: new Date("2025-01-15T10:00:00.000Z"),
      updatedAt: new Date("2025-01-15T11:00:00.000Z"),
    }),

    mockPerfumeRecord: (id: string = TEST_PERFUME_ID_1) => ({
      id,
      nameEn: "Test Perfume EN",
      nameKo: "테스트 향수",
      brand: {
        nameEn: "Test Brand EN",
        nameKo: "테스트 브랜드",
        brandUrl: "https://brand.test",
      },
      perfumeImage: [{ imageUrl: "https://perfume.test/image.jpg" }],
    }),

    mockDraftList: () => [
      {
        id: TEST_DRAFT_ID,
        userId: TEST_USER_ID,
        type: DraftType.CREATE,
        title: "임시 저장 1",
        content: "내용 1",
        contentText: "내용 텍스트 1",
        category: PostCategory.QUESTION,
        thumbnailUrl: null,
        perfumeIds: [TEST_PERFUME_ID_1],
        postId: null,
        createdAt: new Date("2025-01-15T11:00:00.000Z"),
        updatedAt: new Date("2025-01-15T11:00:00.000Z"),
      },
      {
        id: "draft-other-id",
        userId: TEST_USER_ID,
        type: DraftType.UPDATE,
        title: "임시 저장 2",
        content: "내용 2",
        contentText: "내용 텍스트 2",
        category: PostCategory.FREEBOARD,
        thumbnailUrl: null,
        perfumeIds: [TEST_PERFUME_ID_2],
        postId: TEST_POST_ID,
        createdAt: new Date("2025-01-14T10:00:00.000Z"),
        updatedAt: new Date("2025-01-14T10:00:00.000Z"),
      },
    ],
  };
};
