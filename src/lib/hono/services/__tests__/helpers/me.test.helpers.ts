import type { ImageFormat } from "@prisma/client";

export const getTestData = () => {
  const TEST_USER_ID = "123e4567-e89b-12d3-a456-426614174000";
  const TEST_PERFUME_ID = "223e4567-e89b-12d3-a456-426614174001";
  const TEST_POST_ID = "323e4567-e89b-12d3-a456-426614174002";
  const TEST_REVIEW_ID = "423e4567-e89b-12d3-a456-426614174003";
  const TEST_COMMENT_ID = "523e4567-e89b-12d3-a456-426614174004";
  const TEST_COLLECTION_ID = "623e4567-e89b-12d3-a456-426614174005";

  return {
    ids: {
      userId: TEST_USER_ID,
      perfumeId: TEST_PERFUME_ID,
      postId: TEST_POST_ID,
      reviewId: TEST_REVIEW_ID,
      commentId: TEST_COMMENT_ID,
      collectionId: TEST_COLLECTION_ID,
    },
    mockUser: {
      id: TEST_USER_ID,
      name: "테스트 사용자",
      nickname: "테스터",
      age: 25,
      gender: "MALE" as const,
      imageUrl: "https://example.com/profile.jpg",
      totalPoints: 250,
      consecutiveLoginDays: 5,
    },
    mockPerfume: {
      id: TEST_PERFUME_ID,
      nameKo: "테스트 향수",
      nameEn: "Test Perfume",
      brand: { nameEn: "TestBrand", nameKo: "테스트브랜드", brandUrl: null },
      perfumeImage: [{ imageUrl: "perfume.jpg" }],
    },
    mockPost: {
      id: TEST_POST_ID,
      title: "테스트 게시글",
      content: "테스트 내용",
      userId: TEST_USER_ID,
      createdAt: new Date(),
    },
    mockReview: {
      id: TEST_REVIEW_ID,
      content: "좋은 향수입니다",
      usageStatus: "CURRENTLY_USING",
      perfumeId: TEST_PERFUME_ID,
      authorId: TEST_USER_ID,
      createdAt: new Date(),
    },
    mockComment: {
      id: TEST_COMMENT_ID,
      content: "좋은 글이네요",
      authorId: TEST_USER_ID,
      postId: TEST_POST_ID,
      createdAt: new Date(),
    },
    mockCollection: (userId: string = TEST_USER_ID) => ({
      id: TEST_COLLECTION_ID,
      userId,
      perfumeId: TEST_PERFUME_ID,
      comment: "내 컬렉션",
      image: {
        imageUrl: "https://example.com/collection.jpg",
        width: 800,
        height: 600,
        format: "JPG" as ImageFormat,
      },
    }),
    mockBookmark: (createdAt: Date = new Date()) => ({ createdAt }),
    mockRecentView: (viewedAt: Date = new Date()) => ({ viewedAt }),
  };
};
