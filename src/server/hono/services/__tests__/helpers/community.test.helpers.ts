import type { PostCategory } from "@prisma/client";

export const getTestData = () => {
  const TEST_USER_ID = "123e4567-e89b-12d3-a456-426614174000";
  const TEST_ANOTHER_USER_ID = "223e4567-e89b-12d3-a456-426614174001";
  const TEST_POST_ID = "323e4567-e89b-12d3-a456-426614174002";
  const TEST_PERFUME_ID = "423e4567-e89b-12d3-a456-426614174003";
  const TEST_LIKE_ID = "523e4567-e89b-12d3-a456-426614174004";
  const TEST_BOOKMARK_ID = "623e4567-e89b-12d3-a456-426614174005";

  return {
    ids: {
      userId: TEST_USER_ID,
      anotherUserId: TEST_ANOTHER_USER_ID,
      postId: TEST_POST_ID,
      perfumeId: TEST_PERFUME_ID,
      likeId: TEST_LIKE_ID,
      bookmarkId: TEST_BOOKMARK_ID,
    },
    mockUser: {
      id: TEST_USER_ID,
      nickname: "TestUser",
      imageUrl: "test.jpg",
    },
    mockAnotherUser: {
      id: TEST_ANOTHER_USER_ID,
      nickname: "AnotherUser",
      imageUrl: "another.jpg",
    },
    createPostInput: () => ({
      authorId: TEST_USER_ID,
      category: "FREEBOARD" as PostCategory,
      title: "테스트 게시글",
      content: "테스트 내용",
      contentText: "테스트 내용",
      thumbnailUrl: null,
      perfumeIds: [TEST_PERFUME_ID],
    }),
    mockCreatedPost: () => ({
      id: TEST_POST_ID,
      title: "테스트 게시글",
      contentText: "테스트 내용",
      contentJson: {},
      category: "FREE_TALK" as PostCategory,
      userId: TEST_USER_ID,
      published: true,
      likeCount: 0,
      viewCount: 0,
      commentCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: {
        id: TEST_USER_ID,
        nickname: "TestUser",
        imageUrl: "test.jpg",
      },
      perfumeMappings: [
        {
          perfume: {
            id: TEST_PERFUME_ID,
            nameKo: "테스트 향수",
            nameEn: "Test Perfume",
            perfumeImage: [{ imageUrl: "perfume.jpg" }],
          },
        },
      ],
    }),
    mockUpdatedPost: () => ({
      id: TEST_POST_ID,
      title: "수정된 게시글",
      contentText: "수정된 내용",
      contentJson: {},
      category: "FREE_TALK" as PostCategory,
      userId: TEST_USER_ID,
      published: true,
      likeCount: 0,
      viewCount: 0,
      commentCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: {
        id: TEST_USER_ID,
        nickname: "TestUser",
        imageUrl: "test.jpg",
      },
      perfumeMappings: [],
    }),
    mockPost: {
      id: TEST_POST_ID,
      title: "테스트 게시글",
      contentText: "테스트 내용",
      contentJson: {},
      category: "FREE_TALK" as PostCategory,
      userId: TEST_USER_ID,
      published: true,
      likeCount: 5,
      viewCount: 10,
      commentCount: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    mockFullPost: () => ({
      id: TEST_POST_ID,
      title: "테스트 게시글",
      contentText: "테스트 내용",
      contentJson: {},
      category: "FREE_TALK" as PostCategory,
      userId: TEST_USER_ID,
      published: true,
      likeCount: 5,
      viewCount: 10,
      commentCount: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: {
        id: TEST_USER_ID,
        nickname: "TestUser",
        imageUrl: "test.jpg",
      },
      perfumeMappings: [
        {
          perfume: {
            id: TEST_PERFUME_ID,
            nameKo: "테스트 향수",
            nameEn: "Test Perfume",
            perfumeImage: [{ imageUrl: "perfume.jpg" }],
          },
        },
      ],
      likes: [],
      bookmarks: [],
    }),
    mockDeletedPost: {
      id: TEST_POST_ID,
      userId: TEST_USER_ID,
      published: false,
      category: "FREE_TALK" as PostCategory,
    },
    mockLike: {
      id: TEST_LIKE_ID,
      postId: TEST_POST_ID,
      userId: TEST_USER_ID,
    },
    mockBookmark: {
      id: TEST_BOOKMARK_ID,
      postId: TEST_POST_ID,
      userId: TEST_USER_ID,
    },
    mockPosts: (count: number) =>
      Array.from({ length: count }, (_, i) => ({
        id: `post-${i}`,
        title: `Post ${i}`,
        contentText: `Content ${i}`,
        contentJson: {},
        category: "FREE_TALK" as PostCategory,
        userId: TEST_USER_ID,
        published: true,
        likeCount: i,
        viewCount: i * 10,
        commentCount: i,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: TEST_USER_ID,
          nickname: "TestUser",
          imageUrl: "test.jpg",
        },
        perfumeMappings: [],
      })),
  };
};
