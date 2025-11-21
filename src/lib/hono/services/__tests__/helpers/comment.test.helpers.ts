import { DELETED_COMMENT_MESSAGE_BY_USER } from "../../../schemas/comment.schema";

export const getTestData = () => {
  const TEST_USER_ID = "123e4567-e89b-12d3-a456-426614174000";
  const TEST_POST_ID = "223e4567-e89b-12d3-a456-426614174001";
  const TEST_COMMENT_ID = "323e4567-e89b-12d3-a456-426614174002";
  const TEST_PARENT_ID = "423e4567-e89b-12d3-a456-426614174003";

  return {
    ids: {
      userId: TEST_USER_ID,
      postId: TEST_POST_ID,
      commentId: TEST_COMMENT_ID,
      parentId: TEST_PARENT_ID,
    },
    mockUser: {
      id: TEST_USER_ID,
      nickname: "테스트유저",
      imageUrl: "test-user.jpg",
    },
    mockPost: {
      id: TEST_POST_ID,
      published: true,
      commentCount: 5,
    },
    mockParentComment: {
      id: TEST_PARENT_ID,
      content: "부모 댓글",
      published: true,
      authorId: "other-user-id",
      postId: TEST_POST_ID,
    },
    createCommentPayload: () => ({
      authorId: TEST_USER_ID,
      postId: TEST_POST_ID,
      content: "훌륭한 게시글이네요!",
    }),
    createReplyPayload: () => ({
      authorId: TEST_USER_ID,
      postId: TEST_POST_ID,
      parentId: TEST_PARENT_ID,
      content: "대댓글입니다.",
    }),
    mockCreatedComment: () => ({
      id: TEST_COMMENT_ID,
      content: "훌륭한 게시글이네요!",
      published: true,
      authorId: TEST_USER_ID,
      postId: TEST_POST_ID,
      parentId: null,
      createdAt: new Date(),
      updatedAt: null,
      author: {
        id: TEST_USER_ID,
        nickname: "테스트유저",
        imageUrl: "test-user.jpg",
      },
      replies: [],
    }),
    mockCreatedReply: () => ({
      id: TEST_COMMENT_ID,
      content: "대댓글입니다.",
      published: true,
      authorId: TEST_USER_ID,
      postId: TEST_POST_ID,
      parentId: TEST_PARENT_ID,
      createdAt: new Date(),
      updatedAt: null,
      author: {
        id: TEST_USER_ID,
        nickname: "테스트유저",
        imageUrl: "test-user.jpg",
      },
      replies: [],
    }),
    mockExistingComment: () => ({
      id: TEST_COMMENT_ID,
      content: "기존 댓글",
      published: true,
      authorId: TEST_USER_ID,
      postId: TEST_POST_ID,
      parentId: null,
      createdAt: new Date(),
      updatedAt: null,
    }),
    mockDeletedComment: () => ({
      id: TEST_COMMENT_ID,
      content: DELETED_COMMENT_MESSAGE_BY_USER,
      published: false,
      authorId: TEST_USER_ID,
      postId: TEST_POST_ID,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: {
        id: TEST_USER_ID,
        nickname: "테스트유저",
        imageUrl: "test-user.jpg",
      },
      replies: [],
    }),
    mockComments: (count: number) =>
      Array.from({ length: count }, (_, i) => ({
        id: `comment-${i}`,
        content: `댓글 ${i}`,
        published: true,
        authorId: TEST_USER_ID,
        postId: TEST_POST_ID,
        parentId: null,
        createdAt: new Date(Date.now() - i * 1000),
        updatedAt: null,
        author: {
          id: TEST_USER_ID,
          nickname: "테스트유저",
          imageUrl: "test-user.jpg",
        },
        replies: [],
      })),
    mockCommentsWithReplies: () => [
      {
        id: "comment-1",
        content: "댓글 1",
        published: true,
        authorId: TEST_USER_ID,
        postId: TEST_POST_ID,
        parentId: null,
        createdAt: new Date(),
        updatedAt: null,
        author: {
          id: TEST_USER_ID,
          nickname: "테스트유저",
          imageUrl: "test-user.jpg",
        },
        replies: [
          {
            id: "reply-1",
            content: "대댓글 1",
            published: true,
            authorId: "other-user",
            postId: TEST_POST_ID,
            parentId: "comment-1",
            createdAt: new Date(),
            updatedAt: null,
            author: {
              id: "other-user",
              nickname: "다른유저",
              imageUrl: "other.jpg",
            },
          },
        ],
      },
    ],
    mockUnpublishedCommentWithReplies: () => ({
      id: "comment-deleted",
      content: DELETED_COMMENT_MESSAGE_BY_USER,
      published: false,
      authorId: TEST_USER_ID,
      postId: TEST_POST_ID,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: {
        id: TEST_USER_ID,
        nickname: "테스트유저",
        imageUrl: "test-user.jpg",
      },
      replies: [
        {
          id: "reply-1",
          content: "대댓글",
          published: true,
          authorId: "other-user",
          postId: TEST_POST_ID,
          parentId: "comment-deleted",
          createdAt: new Date(),
          updatedAt: null,
          author: {
            id: "other-user",
            nickname: "다른유저",
            imageUrl: "other.jpg",
          },
        },
      ],
    }),
  };
};
