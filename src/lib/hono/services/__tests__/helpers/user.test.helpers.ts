export const getTestData = () => {
  const TEST_USER_ID = "123e4567-e89b-12d3-a456-426614174000";
  const TEST_PERFUME_ID = "223e4567-e89b-12d3-a456-426614174001";
  const TEST_POST_ID = "323e4567-e89b-12d3-a456-426614174002";

  return {
    ids: {
      userId: TEST_USER_ID,
      perfumeId: TEST_PERFUME_ID,
      postId: TEST_POST_ID,
    },
    mockUser: {
      id: TEST_USER_ID,
      nickname: "테스트유저",
      imageUrl: "https://example.com/avatar.jpg",
      totalPoints: 250,
    },
    mockPosts: [
      {
        id: TEST_POST_ID,
        title: "향수 추천 게시글",
        content: "오늘의 향수 추천입니다.",
        published: true,
        userId: TEST_USER_ID,
        createdAt: new Date("2025-01-15"),
        updatedAt: new Date("2025-01-15"),
        author: {
          id: TEST_USER_ID,
          nickname: "테스트유저",
          imageUrl: "https://example.com/avatar.jpg",
        },
      },
      {
        id: "post-2",
        title: "비공개 게시글",
        content: "비공개 내용",
        published: false,
        userId: TEST_USER_ID,
        createdAt: new Date("2025-01-14"),
        updatedAt: new Date("2025-01-14"),
        author: {
          id: TEST_USER_ID,
          nickname: "테스트유저",
          imageUrl: "https://example.com/avatar.jpg",
        },
      },
    ],
    mockBookmarks: [
      {
        id: "bookmark-1",
        userId: TEST_USER_ID,
        perfumeId: TEST_PERFUME_ID,
        isPublic: true,
        createdAt: new Date("2025-01-15"),
        perfume: {
          id: TEST_PERFUME_ID,
          nameKo: "샤넬 넘버5",
          nameEn: "Chanel No.5",
          imageUrl: "https://example.com/perfume.jpg",
          brandId: "brand-1",
          brand: {
            id: "brand-1",
            nameKo: "샤넬",
            nameEn: "Chanel",
            brandUrl: "https://example.com/chanel",
          },
          perfumeImage: [
            {
              id: "img-1",
              imageUrl: "https://example.com/perfume.jpg",
              perfumeId: TEST_PERFUME_ID,
            },
          ],
        },
      },
      {
        id: "bookmark-2",
        userId: TEST_USER_ID,
        perfumeId: "perfume-2",
        isPublic: false,
        createdAt: new Date("2025-01-14"),
        perfume: {
          id: "perfume-2",
          nameKo: "디올 소바쥬",
          nameEn: "Dior Sauvage",
          imageUrl: "https://example.com/dior.jpg",
          brandId: "brand-2",
          brand: {
            id: "brand-2",
            nameKo: "디올",
            nameEn: "Dior",
            brandUrl: "https://example.com/dior",
          },
          perfumeImage: [
            {
              id: "img-2",
              imageUrl: "https://example.com/dior.jpg",
              perfumeId: "perfume-2",
            },
          ],
        },
      },
    ],
    mockCollections: [
      {
        id: "collection-1",
        userId: TEST_USER_ID,
        perfumeId: TEST_PERFUME_ID,
        isPublic: true,
        comment: null,
        createdAt: new Date("2025-01-15"),
        image: {
          id: "img-1",
          imageUrl: "https://example.com/collection.jpg",
          perfumeId: TEST_PERFUME_ID,
        },
        perfume: {
          id: TEST_PERFUME_ID,
          nameKo: "샤넬 넘버5",
          nameEn: "Chanel No.5",
          imageUrl: "https://example.com/perfume.jpg",
          brandId: "brand-1",
        },
      },
    ],
  };
};
