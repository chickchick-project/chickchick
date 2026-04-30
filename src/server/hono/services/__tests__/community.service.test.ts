import { describe, it, expect, beforeEach, vi } from "vitest";
import { prisma } from "@/server/prisma";
import type { PrismaClient, PostCategory } from "@prisma/client";
import {
  createPostService,
  updatePostService,
  deletePostService,
  getPostByIdService,
  togglePostLikeService,
  togglePostBookmarkService,
  getPaginatedPostListService,
} from "../community";
import { getTestData } from "./helpers/community.test.helpers";

// Prisma Interactive Transaction 타입 정의
type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

/**
 * Community 서비스 테스트 (MVP)
 *
 * 핵심 로직만 검증:
 * - 게시글 CRUD 기본 동작
 * - 좋아요/북마크 토글
 * - 권한 검증
 * - 페이지네이션
 */

// Mock prisma
vi.mock("@/server/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    post: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    postLike: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    postBookmark: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    postPerfumeMapping: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

describe("Community Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createPostService", () => {
    it("게시글 생성 시 정상적으로 생성되고 perfumeIds가 연결되어야 한다", async () => {
      const { ids, mockUser, createPostInput, mockCreatedPost } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.post.create).mockResolvedValue(
        mockCreatedPost() as never
      );

      const result = await createPostService(createPostInput());

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("테스트 게시글");
      }
      expect(prisma.post.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: "테스트 게시글",
            userId: ids.userId,
          }),
        })
      );
    });

    it("존재하지 않는 사용자는 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { createPostInput } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await createPostService(createPostInput());

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
      }
    });
  });

  describe("togglePostLikeService", () => {
    it("좋아요 추가 시 likeCount가 증가하고 트랜잭션으로 처리되어야 한다", async () => {
      const { ids, mockUser, mockPost } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as never);
      vi.mocked(prisma.postLike.findUnique).mockResolvedValue(null);

      vi.mocked(prisma.$transaction).mockImplementation((async (
        callback: unknown
      ) => {
        if (Array.isArray(callback)) {
          return [{ id: ids.likeId }, { likeCount: 6 }];
        }
        return callback;
      }) as never);

      vi.mocked(prisma.postLike.create).mockResolvedValue({
        id: ids.likeId,
      } as never);
      vi.mocked(prisma.post.update).mockResolvedValue({
        likeCount: 6,
      } as never);

      const result = await togglePostLikeService(ids.postId, ids.anotherUserId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.liked).toBe(true);
        expect(result.data.likeCount).toBe(6);
      }
    });

    it("좋아요 취소 시 likeCount가 감소해야 한다", async () => {
      const { ids, mockUser, mockPost, mockLike } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as never);
      vi.mocked(prisma.postLike.findUnique).mockResolvedValue(
        mockLike as never
      );

      vi.mocked(prisma.$transaction).mockImplementation((async (
        callback: unknown
      ) => {
        if (Array.isArray(callback)) {
          return [{}, { likeCount: 4 }];
        }
        return callback;
      }) as never);

      vi.mocked(prisma.postLike.delete).mockResolvedValue({} as never);
      vi.mocked(prisma.post.update).mockResolvedValue({
        likeCount: 4,
      } as never);

      const result = await togglePostLikeService(ids.postId, ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.liked).toBe(false);
        expect(result.data.likeCount).toBe(4);
      }
    });

    it("삭제된 게시글에는 좋아요를 누를 수 없어야 한다", async () => {
      const { ids, mockUser, mockDeletedPost } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.post.findUnique).mockResolvedValue(
        mockDeletedPost as never
      );

      const result = await togglePostLikeService(ids.postId, ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("FORBIDDEN");
      }
    });
  });

  describe("updatePostService", () => {
    it("게시글 내용과 perfumeIds가 업데이트되어야 한다", async () => {
      const { ids, mockUser, mockPost, mockUpdatedPost } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.post.findUnique).mockResolvedValue({
        ...mockPost,
        author: { id: ids.userId },
      } as never);

      const updateSpy = vi.fn().mockResolvedValue(mockUpdatedPost());

      vi.mocked(prisma.$transaction).mockImplementation((async (
        callback: (tx: PrismaTransactionClient) => Promise<unknown>
      ) => {
        return callback({
          postPerfumeMapping: {
            deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
          },
          post: {
            update: updateSpy,
          },
        } as unknown as PrismaTransactionClient);
      }) as never);

      const result = await updatePostService(ids.postId, ids.userId, {
        title: "수정된 게시글",
        contentText: "수정된 내용",
        perfumeIds: [],
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("수정된 게시글");
      }
    });

    it("작성자만 게시글을 수정할 수 있어야 한다", async () => {
      const { ids, mockAnotherUser, mockPost } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(
        mockAnotherUser as never
      );
      vi.mocked(prisma.post.findUnique).mockResolvedValue({
        ...mockPost,
        author: { id: ids.userId },
      } as never);

      const result = await updatePostService(ids.postId, ids.anotherUserId, {
        title: "수정 시도",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("FORBIDDEN");
      }
    });
  });

  describe("deletePostService", () => {
    it("게시글이 soft delete 되어야 한다", async () => {
      const { ids, mockUser, mockPost } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as never);
      vi.mocked(prisma.post.update).mockResolvedValue({
        ...mockPost,
        published: false,
      } as never);

      const result = await deletePostService(ids.postId, ids.userId);

      expect(result.success).toBe(true);
      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: ids.postId },
        data: { published: false },
      });
    });

    it("작성자만 게시글을 삭제할 수 있어야 한다", async () => {
      const { ids, mockAnotherUser, mockPost } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(
        mockAnotherUser as never
      );
      vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as never);

      const result = await deletePostService(ids.postId, ids.anotherUserId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("FORBIDDEN");
      }
    });
  });

  describe("getPostByIdService", () => {
    it("게시글 조회 시 viewCount가 증가해야 한다", async () => {
      const { ids, mockFullPost } = getTestData();

      const updateSpy = vi.fn().mockResolvedValue({ id: ids.postId });
      const findUniqueSpy = vi.fn().mockResolvedValue(mockFullPost());

      vi.mocked(prisma.$transaction).mockImplementation((async (
        callback: (tx: PrismaTransactionClient) => Promise<unknown>
      ) => {
        return callback({
          post: {
            update: updateSpy,
            findUnique: findUniqueSpy,
          },
        } as unknown as PrismaTransactionClient);
      }) as never);

      const result = await getPostByIdService(ids.postId, ids.userId);

      expect(result.success).toBe(true);
      expect(updateSpy).toHaveBeenCalledWith({
        where: { id: ids.postId },
        data: { viewCount: { increment: 1 } },
      });
    });

    it("요청 사용자가 작성자인 경우 isAuthor=true를 반환해야 한다", async () => {
      const { ids, mockFullPost } = getTestData();

      vi.mocked(prisma.$transaction).mockImplementation((async (
        callback: (tx: PrismaTransactionClient) => Promise<unknown>
      ) => {
        return callback({
          post: {
            update: vi.fn().mockResolvedValue({ id: ids.postId }),
            findUnique: vi.fn().mockResolvedValue(mockFullPost()),
          },
        } as unknown as PrismaTransactionClient);
      }) as never);

      const result = await getPostByIdService(ids.postId, ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isAuthor).toBe(true);
      }
    });
  });

  describe("togglePostBookmarkService", () => {
    it("북마크 추가 시 북마크 레코드가 생성되어야 한다", async () => {
      const { ids, mockUser, mockPost } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as never);
      vi.mocked(prisma.postBookmark.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.postBookmark.create).mockResolvedValue({
        id: ids.bookmarkId,
      } as never);

      const result = await togglePostBookmarkService(ids.postId, ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.bookmarked).toBe(true);
      }
    });

    it("북마크 취소 시 북마크 레코드가 삭제되어야 한다", async () => {
      const { ids, mockUser, mockPost, mockBookmark } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as never);
      vi.mocked(prisma.postBookmark.findUnique).mockResolvedValue(
        mockBookmark as never
      );
      vi.mocked(prisma.postBookmark.delete).mockResolvedValue({} as never);

      const result = await togglePostBookmarkService(ids.postId, ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.bookmarked).toBe(false);
      }
    });
  });

  describe("getPaginatedPostListService", () => {
    it("커서 기반 페이지네이션이 정상 작동해야 한다", async () => {
      const { mockPosts } = getTestData();
      const posts = mockPosts(13);

      vi.mocked(prisma.post.findMany).mockResolvedValue(posts as never);
      vi.mocked(prisma.post.count).mockResolvedValue(20);

      const result = await getPaginatedPostListService({
        limit: 12,
        category: "FREEBOARD" as PostCategory,
        sortBy: "createdAt",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.data).toHaveLength(12);
        expect(result.data.nextCursor).toBe("post-11");
      }
    });

    it("published=true인 게시글만 조회되어야 한다", async () => {
      const { mockPosts } = getTestData();

      vi.mocked(prisma.post.findMany).mockResolvedValue(mockPosts(5) as never);
      vi.mocked(prisma.post.count).mockResolvedValue(5);

      await getPaginatedPostListService({
        limit: 12,
        category: "FREEBOARD" as PostCategory,
        sortBy: "createdAt",
      });

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            published: true,
          }),
        })
      );
    });
  });

  describe("에러 처리", () => {
    it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      const { ids, mockUser } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.post.findUnique).mockRejectedValue(
        new Error("Database error")
      );

      const result = await deletePostService(ids.postId, ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });

    it("유효하지 않은 UUID 입력 시 BAD_REQUEST를 반환해야 한다", async () => {
      const { ids } = getTestData();

      const result = await getPostByIdService("invalid-uuid", ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("BAD_REQUEST");
      }
    });
  });
});
