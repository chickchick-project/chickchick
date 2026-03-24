import { describe, it, expect, beforeEach, vi } from "vitest";
import { prisma } from "@/server/prisma";
import type { PrismaClient } from "@prisma/client";
import {
  createCommentService,
  updateCommentService,
  deleteCommentService,
  getPaginatedCommentService,
} from "../comment.service";
import { DELETED_COMMENT_MESSAGE_BY_USER } from "../../schemas/comment.schema";
import { getTestData } from "./helpers/comment.test.helpers";

// Prisma Interactive Transaction 타입 정의
type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

/**
 * Comment 서비스 테스트 (MVP)
 *
 * 핵심 로직만 검증:
 * - 댓글/대댓글 CRUD 기본 동작
 * - 트랜잭션 일관성 (commentCount 업데이트)
 * - Soft delete 처리
 * - 페이지네이션
 */

// Mock prisma
vi.mock("@/server/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    post: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    comment: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

// Mock earnPointsService
vi.mock("../point.service", () => ({
  earnPointsService: vi.fn().mockResolvedValue({ success: true }),
  validateTimestamp: vi.fn().mockReturnValue(true),
}));

describe("Comment Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createCommentService", () => {
    it("트랜잭션으로 댓글 생성과 post.commentCount 증가가 원자적으로 처리되어야 한다", async () => {
      const {
        ids,
        mockUser,
        mockPost,
        createCommentPayload,
        mockCreatedComment,
      } = getTestData();

      vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      const postUpdateSpy = vi.fn().mockResolvedValue({});
      const commentCreateSpy = vi.fn().mockResolvedValue(mockCreatedComment());

      vi.mocked(prisma.$transaction).mockImplementation((async (
        callback: (tx: PrismaTransactionClient) => Promise<unknown>
      ) => {
        return callback({
          comment: {
            create: commentCreateSpy,
          },
          post: {
            update: postUpdateSpy,
          },
        } as unknown as PrismaTransactionClient);
      }) as never);

      const result = await createCommentService(createCommentPayload());

      expect(result.success).toBe(true);
      expect(commentCreateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            authorId: ids.userId,
            postId: ids.postId,
            content: "훌륭한 게시글이네요!",
          }),
        })
      );
      expect(postUpdateSpy).toHaveBeenCalledWith({
        where: { id: ids.postId },
        data: { commentCount: { increment: 1 } },
      });
    });

    it("대댓글 생성 시 parentId가 설정되어야 한다", async () => {
      const {
        ids,
        mockUser,
        mockPost,
        mockParentComment,
        createReplyPayload,
        mockCreatedReply,
      } = getTestData();

      vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.comment.findUnique).mockResolvedValue(
        mockParentComment as never
      );

      const commentCreateSpy = vi.fn().mockResolvedValue(mockCreatedReply());

      vi.mocked(prisma.$transaction).mockImplementation((async (
        callback: (tx: PrismaTransactionClient) => Promise<unknown>
      ) => {
        return callback({
          comment: {
            create: commentCreateSpy,
          },
          post: {
            update: vi.fn().mockResolvedValue({}),
          },
        } as unknown as PrismaTransactionClient);
      }) as never);

      const result = await createCommentService(createReplyPayload());

      expect(result.success).toBe(true);
      expect(commentCreateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            parentId: ids.parentId,
          }),
        })
      );
    });

    it("삭제된 게시글에는 댓글을 작성할 수 없어야 한다", async () => {
      const { mockPost, createCommentPayload } = getTestData();

      vi.mocked(prisma.post.findUnique).mockResolvedValue({
        ...mockPost,
        published: false,
      } as never);

      const result = await createCommentService(createCommentPayload());

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("FORBIDDEN");
      }
    });
  });

  describe("deleteCommentService", () => {
    it("댓글 삭제 시 soft delete 되어야 한다", async () => {
      const { ids, mockExistingComment, mockDeletedComment } = getTestData();

      const commentUpdateSpy = vi.fn().mockResolvedValue({});

      vi.mocked(prisma.comment.findUnique)
        .mockResolvedValueOnce({
          id: ids.commentId,
        } as never)
        .mockResolvedValueOnce({
          ...mockExistingComment(),
          authorId: ids.userId,
          postId: ids.postId,
          published: true,
        } as never)
        .mockResolvedValueOnce(mockDeletedComment() as never);

      vi.mocked(prisma.$transaction).mockImplementation((async (
        callback: (tx: PrismaTransactionClient) => Promise<unknown>
      ) => {
        await callback({
          comment: {
            update: commentUpdateSpy,
          },
          post: {
            update: vi.fn().mockResolvedValue({}),
          },
        } as unknown as PrismaTransactionClient);
      }) as never);

      const result = await deleteCommentService({
        id: ids.commentId,
        authorId: ids.userId,
      });

      expect(result.success).toBe(true);
      expect(commentUpdateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: ids.commentId },
          data: expect.objectContaining({
            published: false,
            content: DELETED_COMMENT_MESSAGE_BY_USER,
          }),
        })
      );
    });

    it("댓글 soft delete와 post.commentCount 감소가 트랜잭션으로 처리되어야 한다", async () => {
      const { ids, mockExistingComment, mockDeletedComment } = getTestData();

      const commentUpdateSpy = vi.fn().mockResolvedValue({});
      const postUpdateSpy = vi.fn().mockResolvedValue({});

      vi.mocked(prisma.comment.findUnique)
        .mockResolvedValueOnce({
          id: ids.commentId,
        } as never)
        .mockResolvedValueOnce({
          ...mockExistingComment(),
          authorId: ids.userId,
          postId: ids.postId,
          published: true,
        } as never)
        .mockResolvedValueOnce(mockDeletedComment() as never);

      vi.mocked(prisma.$transaction).mockImplementation((async (
        callback: (tx: PrismaTransactionClient) => Promise<unknown>
      ) => {
        await callback({
          comment: {
            update: commentUpdateSpy,
          },
          post: {
            update: postUpdateSpy,
          },
        } as unknown as PrismaTransactionClient);
      }) as never);

      const result = await deleteCommentService({
        id: ids.commentId,
        authorId: ids.userId,
      });

      expect(result.success).toBe(true);
      expect(commentUpdateSpy).toHaveBeenCalled();
      expect(postUpdateSpy).toHaveBeenCalledWith({
        where: { id: ids.postId },
        data: { commentCount: { decrement: 1 } },
      });
    });

    it("작성자만 댓글을 삭제할 수 있어야 한다", async () => {
      const { ids, mockExistingComment } = getTestData();

      vi.mocked(prisma.comment.findUnique).mockResolvedValue({
        ...mockExistingComment(),
        authorId: "other-user-id",
        postId: ids.postId,
        published: true,
      } as never);

      const result = await deleteCommentService({
        id: ids.commentId,
        authorId: ids.userId,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("FORBIDDEN");
      }
    });
  });

  describe("getPaginatedCommentService", () => {
    it("커서 기반 페이지네이션이 정상 작동해야 한다", async () => {
      const { ids, mockPost, mockComments } = getTestData();

      vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as never);
      vi.mocked(prisma.comment.findMany).mockResolvedValue(
        mockComments(13) as never
      );
      vi.mocked(prisma.comment.count).mockResolvedValue(20);

      const result = await getPaginatedCommentService(ids.postId, {
        limit: 12,
        cursor: undefined,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.data).toHaveLength(12);
        expect(result.data.totalCount).toBe(20);
        expect(prisma.comment.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            take: 13,
          })
        );
      }
    });

    it("published=false이고 답글이 없는 댓글은 필터링되어야 한다", async () => {
      const { ids, mockPost } = getTestData();

      const mixedComments = [
        {
          id: "comment-1",
          content: "정상 댓글",
          published: true,
          authorId: ids.userId,
          postId: ids.postId,
          parentId: null,
          createdAt: new Date(),
          updatedAt: null,
          author: {
            id: ids.userId,
            nickname: "테스트유저",
            imageUrl: "test.jpg",
          },
          replies: [],
        },
        {
          id: "comment-2",
          content: DELETED_COMMENT_MESSAGE_BY_USER,
          published: false,
          authorId: ids.userId,
          postId: ids.postId,
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          author: {
            id: ids.userId,
            nickname: "테스트유저",
            imageUrl: "test.jpg",
          },
          replies: [],
        },
      ];

      vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as never);
      vi.mocked(prisma.comment.findMany).mockResolvedValue(
        mixedComments as never
      );
      vi.mocked(prisma.comment.count).mockResolvedValue(1);

      const result = await getPaginatedCommentService(ids.postId, {
        limit: 10,
        cursor: undefined,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.data).toHaveLength(1);
        expect(result.data.data[0].id).toBe("comment-1");
      }
    });

    it("published=false이지만 답글이 있는 댓글은 표시되어야 한다", async () => {
      const { ids, mockPost, mockUnpublishedCommentWithReplies } =
        getTestData();

      vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as never);
      vi.mocked(prisma.comment.findMany).mockResolvedValue([
        mockUnpublishedCommentWithReplies(),
      ] as never);
      vi.mocked(prisma.comment.count).mockResolvedValue(0);

      const result = await getPaginatedCommentService(ids.postId, {
        limit: 10,
        cursor: undefined,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.data).toHaveLength(1);
        expect(result.data.data[0].published).toBe(false);
        expect(result.data.data[0].replies).toHaveLength(1);
        expect(result.data.data[0].author.nickname).toBe("알 수 없음");
      }
    });

    it("계층 구조가 올바르게 반환되어야 한다", async () => {
      const { ids, mockPost, mockCommentsWithReplies } = getTestData();

      vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as never);
      vi.mocked(prisma.comment.findMany).mockResolvedValue(
        mockCommentsWithReplies() as never
      );
      vi.mocked(prisma.comment.count).mockResolvedValue(1);

      const result = await getPaginatedCommentService(ids.postId, {
        limit: 10,
        cursor: undefined,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.data).toHaveLength(1);
        expect(result.data.data[0].replies).toHaveLength(1);
        expect(result.data.data[0].replies[0].id).toBe("reply-1");
      }
    });
  });

  describe("updateCommentService", () => {
    it("댓글 내용이 업데이트되어야 한다", async () => {
      const { ids, mockExistingComment } = getTestData();

      vi.mocked(prisma.comment.findUnique)
        .mockResolvedValueOnce({
          ...mockExistingComment(),
          authorId: ids.userId,
          published: true,
        } as never)
        .mockResolvedValueOnce({
          ...mockExistingComment(),
          content: "수정된 내용",
        } as never);

      vi.mocked(prisma.comment.update).mockResolvedValue({
        ...mockExistingComment(),
        content: "수정된 내용",
        author: {
          id: ids.userId,
          nickname: "테스트유저",
          imageUrl: "test.jpg",
        },
        replies: [],
      } as never);

      const result = await updateCommentService({
        id: ids.commentId,
        authorId: ids.userId,
        content: "수정된 내용",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.content).toBe("수정된 내용");
      }
    });

    it("작성자만 댓글을 수정할 수 있어야 한다", async () => {
      const { ids, mockExistingComment } = getTestData();

      vi.mocked(prisma.comment.findUnique).mockResolvedValue({
        ...mockExistingComment(),
        authorId: "other-user-id",
        published: true,
      } as never);

      const result = await updateCommentService({
        id: ids.commentId,
        authorId: ids.userId,
        content: "수정된 내용",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("FORBIDDEN");
      }
    });
  });

  describe("에러 처리", () => {
    it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      const { mockPost, mockUser, createCommentPayload } = getTestData();

      vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.$transaction).mockRejectedValue(
        new Error("Database error")
      );

      const result = await createCommentService(createCommentPayload());

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });

    it("유효하지 않은 입력 시 BAD_REQUEST를 반환해야 한다", async () => {
      const { ids } = getTestData();

      const result = await updateCommentService({
        id: "invalid-uuid",
        authorId: ids.userId,
        content: "내용",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("BAD_REQUEST");
      }
    });
  });
});
