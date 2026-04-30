export const getTestData = () => {
  const TEST_USER_ID = "user-123";
  const TEST_PERFUME_ID = "perfume-456";
  const TEST_POST_ID = "post-789";

  return {
    ids: {
      userId: TEST_USER_ID,
      perfumeId: TEST_PERFUME_ID,
      postId: TEST_POST_ID,
    },
    mockUser: {
      id: TEST_USER_ID,
      nickname: "테스트유저",
      imageUrl: "user.jpg",
    },
    mockPerfume: {
      id: TEST_PERFUME_ID,
      nameKo: "샤넬 No.5",
      nameEn: "Chanel No.5",
      brandId: "brand-1",
      brand: { nameKo: "샤넬", nameEn: "Chanel", brandUrl: "chanel.com" },
      perfumeImage: [{ imageUrl: "perfume.jpg" }],
    },
    mockFullPerfume: {
      id: TEST_PERFUME_ID,
      nameKo: "샤넬 No.5",
      nameEn: "Chanel No.5",
      brandId: "brand-1",
      brand: { nameKo: "샤넬", nameEn: "Chanel", brandUrl: "chanel.com" },
      perfumeImage: [{ imageUrl: "perfume.jpg" }],
      noteMappings: [
        { note: { id: "note-1", nameKo: "장미", nameEn: "Rose" } },
      ],
      accordMappings: [
        { accord: { id: "accord-1", nameKo: "플로럴", nameEn: "Floral" } },
      ],
    },
    mockPerfumes: (count: number) =>
      Array.from({ length: count }, (_, i) => ({
        id: `perfume-${i}`,
        nameKo: `향수 ${i}`,
        nameEn: `Perfume ${i}`,
        brandId: "brand-1",
        brand: { nameKo: "브랜드", nameEn: "Brand", brandUrl: "brand.com" },
        perfumeImage: [{ imageUrl: `perfume-${i}.jpg` }],
      })),
    mockPost: {
      id: TEST_POST_ID,
      content: "향수 추천 게시글",
      authorId: TEST_USER_ID,
      createdAt: new Date(),
      author: {
        id: TEST_USER_ID,
        nickname: "테스트유저",
        imageUrl: "user.jpg",
      },
    },
    mockPostPerfumeMappings: (count: number) =>
      Array.from({ length: count }, (_, i) => ({
        id: `mapping-${i}`,
        perfumeId: TEST_PERFUME_ID,
        postId: `post-${i}`,
        createdAt: new Date(Date.now() - i * 1000),
        post: {
          id: `post-${i}`,
          content: `게시글 ${i}`,
          authorId: TEST_USER_ID,
          createdAt: new Date(Date.now() - i * 1000),
          author: {
            id: TEST_USER_ID,
            nickname: "테스트유저",
            imageUrl: "user.jpg",
          },
        },
      })),
    mockBookmark: {
      id: "bookmark-1",
      userId: TEST_USER_ID,
      perfumeId: TEST_PERFUME_ID,
    },
    mockLike: {
      id: "like-1",
      userId: TEST_USER_ID,
      perfumeId: TEST_PERFUME_ID,
    },
    mockNotes: [
      { id: "note-1", nameKo: "장미", nameEn: "Rose" },
      { id: "note-2", nameKo: "자스민", nameEn: "Jasmine" },
      { id: "note-3", nameKo: "바닐라", nameEn: "Vanilla" },
    ],
    mockAccords: [
      { id: "accord-1", nameKo: "플로럴", nameEn: "Floral" },
      { id: "accord-2", nameKo: "우디", nameEn: "Woody" },
      { id: "accord-3", nameKo: "시트러스", nameEn: "Citrus" },
    ],
  };
};
