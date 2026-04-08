import { describe, it, expect, beforeEach, vi } from "vitest";
import { prisma } from "@/server/prisma";
import {
  getMyProfileService,
  updateMyProfileService,
  getMyBookmarkedPostsService,
  getMyBookmarkedPerfumesService,
  getRecentPerfumesService,
  getRecentPostsService,
  syncRecentPerfumesService,
  syncRecentPostsService,
  getMyLikedPerfumesService,
  getMyLikedPostsService,
  postPhotoCollectionService,
  deletePhotoCollectionService,
  getMyReviewsService,
  getMyPostsService,
  getMyCommentsService,
} from "../me";
import { getTestData } from "./helpers/me.test.helpers";

/**
 * Me 서비스 테스트 (MVP)
 *
 * 테스트 전략:
 * - 사용자 프로필 및 데이터 관리 로직 검증
 * - 레벨/포인트 계산 로직 확인
 * - 최근 본 항목 동기화 (MAX_RECENT_ITEMS=50) 검증
 * - 컬렉션 이미지 관리 (Supabase Storage) 확인
 * - 권한 검증 및 에러 처리
 *
 * 주요 시나리오:
 * 1. 내 프로필 조회 (레벨/다음레벨포인트 계산)
 * 2. 프로필 업데이트 (부분 업데이트, 기존 이미지 삭제)
 * 3. 북마크한 게시글/향수 목록 조회
 * 4. 최근 본 향수/게시글 동기화 (MAX_RECENT_ITEMS=50 제한)
 * 5. 좋아요한 향수/게시글 목록 조회
 * 6. 컬렉션 등록 (중복 체크, 기존 이미지 삭제)
 * 7. 컬렉션 삭제 (권한 확인, 이미지 삭제)
 * 8. 내 리뷰/게시글/댓글 목록 조회 (페이지네이션)
 */

// Mock prisma
vi.mock("@/server/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    postBookmark: {
      findMany: vi.fn(),
    },
    perfumeBookmark: {
      findMany: vi.fn(),
    },
    recentPerfumeView: {
      upsert: vi.fn(),
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    recentPostView: {
      upsert: vi.fn(),
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    perfumeLike: {
      findMany: vi.fn(),
    },
    postLike: {
      findMany: vi.fn(),
    },
    userCollection: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      delete: vi.fn(),
    },
    review: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    post: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    comment: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

// Mock file service
vi.mock("../file.service", () => ({
  deleteImageByUrl: vi.fn(),
}));

// Mock level utils
vi.mock("../../utils/level.utils", () => ({
  calculateLevel: vi.fn((points: number) => Math.floor(points / 100)),
  getPointsForNextLevel: vi.fn((points: number) => 100 - (points % 100)),
}));

describe("Me Service", () => {
  const MAX_RECENT_ITEMS = 50;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getMyProfileService", () => {
    it("내 프로필을 조회하고 레벨/다음레벨포인트를 계산해야 한다", async () => {
      const { ids, mockUser } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      const result = await getMyProfileService(ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          ...mockUser,
          level: 2, // 250 / 100 = 2
          nextLevelPoints: 50, // 100 - (250 % 100) = 50
        });
      }
    });

    it("존재하지 않는 사용자는 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await getMyProfileService(ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
        expect(result.message).toContain("사용자");
      }
    });
  });

  describe("updateMyProfileService", () => {
    it("프로필 정보가 업데이트되어야 한다", async () => {
      const { ids, mockUser } = getTestData();
      const updateData = {
        id: ids.userId,
        nickname: "새로운닉네임",
        age: 30,
      };
      const updatedUser = { ...mockUser, ...updateData };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as never);

      const result = await updateMyProfileService(updateData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.nickname).toBe("새로운닉네임");
        expect(result.data.age).toBe(30);
      }
    });

    it("기존 프로필 이미지가 있으면 삭제해야 한다", async () => {
      const { ids, mockUser } = getTestData();
      const { deleteImageByUrl } = await import("../file.service");
      const updateData = {
        id: ids.userId,
        imageUrl: "https://example.com/new-profile.jpg",
      };
      const updatedUser = { ...mockUser, ...updateData };

      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        imageUrl: "https://supabase.co/profile_image/old-image.jpg",
      } as never);
      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as never);

      const result = await updateMyProfileService(updateData);

      expect(result.success).toBe(true);
      expect(deleteImageByUrl).toHaveBeenCalledWith(
        "profile_image",
        "https://supabase.co/profile_image/old-image.jpg"
      );
    });
  });

  describe("getMyBookmarkedPostsService", () => {
    it("북마크한 게시글 목록을 조회해야 한다", async () => {
      const { ids, mockPost } = getTestData();

      vi.mocked(prisma.postBookmark.findMany).mockResolvedValue([
        { post: mockPost, createdAt: new Date() },
      ] as never);

      const result = await getMyBookmarkedPostsService(ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1);
        expect(result.data[0].id).toBe(mockPost.id);
      }
    });
  });

  describe("getMyBookmarkedPerfumesService", () => {
    it("북마크한 향수 목록을 조회해야 한다", async () => {
      const { ids, mockPerfume } = getTestData();

      vi.mocked(prisma.perfumeBookmark.findMany).mockResolvedValue([
        { perfume: mockPerfume, createdAt: new Date() },
      ] as never);

      const result = await getMyBookmarkedPerfumesService(ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1);
        expect(result.data[0].id).toBe(mockPerfume.id);
      }
    });
  });

  describe("getRecentPerfumesService", () => {
    it("최근 본 향수 목록을 조회해야 한다", async () => {
      const { ids, mockPerfume } = getTestData();

      vi.mocked(prisma.recentPerfumeView.findMany).mockResolvedValue([
        {
          perfumeId: mockPerfume.id,
          viewedAt: new Date(),
          perfume: mockPerfume,
        },
      ] as never);

      const result = await getRecentPerfumesService(ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items).toHaveLength(1);
        expect(result.data.items[0].id).toBe(mockPerfume.id);
        expect(result.data.items[0].perfume.nameKo).toBe("테스트 향수");
      }
    });
  });

  describe("getRecentPostsService", () => {
    it("최근 본 게시글 목록을 조회해야 한다", async () => {
      const { ids, mockPost } = getTestData();

      vi.mocked(prisma.recentPostView.findMany).mockResolvedValue([
        {
          postId: mockPost.id,
          viewedAt: new Date(),
          post: mockPost,
        },
      ] as never);

      const result = await getRecentPostsService(ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items).toHaveLength(1);
        expect(result.data.items[0].id).toBe(mockPost.id);
        expect(result.data.items[0].post.title).toBe("테스트 게시글");
      }
    });
  });

  describe("syncRecentPerfumesService", () => {
    it("최근 본 향수를 동기화(upsert)해야 한다", async () => {
      const { ids } = getTestData();
      const perfumeIds = [ids.perfumeId];

      vi.mocked(prisma.recentPerfumeView.upsert).mockResolvedValue({} as never);
      vi.mocked(prisma.recentPerfumeView.findMany).mockResolvedValue(
        [] as never
      );

      const result = await syncRecentPerfumesService({
        userId: ids.userId,
        perfumeIds,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.syncedCount).toBe(1);
      }
      expect(prisma.recentPerfumeView.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            recent_perfume_user_id_perfume_id_key: {
              userId: ids.userId,
              perfumeId: ids.perfumeId,
            },
          },
        })
      );
    });

    it("50개 초과 시 오래된 항목을 삭제해야 한다", async () => {
      const { ids } = getTestData();
      const perfumeIds = [ids.perfumeId];

      // 51개의 항목이 있다고 가정
      const oldItems = Array.from({ length: 51 }, (_, i) => ({
        id: `old-${i}`,
      }));

      vi.mocked(prisma.recentPerfumeView.upsert).mockResolvedValue({} as never);
      vi.mocked(prisma.recentPerfumeView.findMany).mockResolvedValue([
        oldItems[50],
      ] as never); // skip 50 후 1개
      vi.mocked(prisma.recentPerfumeView.deleteMany).mockResolvedValue({
        count: 1,
      } as never);

      const result = await syncRecentPerfumesService({
        userId: ids.userId,
        perfumeIds,
      });

      expect(result.success).toBe(true);
      expect(prisma.recentPerfumeView.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: MAX_RECENT_ITEMS,
        })
      );
      expect(prisma.recentPerfumeView.deleteMany).toHaveBeenCalled();
    });
  });

  describe("syncRecentPostsService", () => {
    it("최근 본 게시글을 동기화(upsert)해야 한다", async () => {
      const { ids } = getTestData();
      const postIds = [ids.postId];

      vi.mocked(prisma.recentPostView.upsert).mockResolvedValue({} as never);
      vi.mocked(prisma.recentPostView.findMany).mockResolvedValue([] as never);

      const result = await syncRecentPostsService({
        userId: ids.userId,
        postIds,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.syncedCount).toBe(1);
      }
      expect(prisma.recentPostView.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            recent_post_user_id_post_id_key: {
              userId: ids.userId,
              postId: ids.postId,
            },
          },
        })
      );
    });

    it("50개 초과 시 오래된 항목을 삭제해야 한다", async () => {
      const { ids } = getTestData();
      const postIds = [ids.postId];

      const oldItems = Array.from({ length: 51 }, (_, i) => ({
        id: `old-${i}`,
      }));

      vi.mocked(prisma.recentPostView.upsert).mockResolvedValue({} as never);
      vi.mocked(prisma.recentPostView.findMany).mockResolvedValue([
        oldItems[50],
      ] as never);
      vi.mocked(prisma.recentPostView.deleteMany).mockResolvedValue({
        count: 1,
      } as never);

      const result = await syncRecentPostsService({
        userId: ids.userId,
        postIds,
      });

      expect(result.success).toBe(true);
      expect(prisma.recentPostView.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: MAX_RECENT_ITEMS,
        })
      );
      expect(prisma.recentPostView.deleteMany).toHaveBeenCalled();
    });
  });

  describe("getMyLikedPerfumesService", () => {
    it("좋아요한 향수 목록을 조회해야 한다", async () => {
      const { ids, mockPerfume } = getTestData();

      vi.mocked(prisma.perfumeLike.findMany).mockResolvedValue([
        { perfume: mockPerfume, createdAt: new Date() },
      ] as never);

      const result = await getMyLikedPerfumesService(ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1);
        expect(result.data[0].nameKo).toBe("테스트 향수");
      }
    });

    it("생성일 기준 내림차순 정렬이어야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.perfumeLike.findMany).mockResolvedValue([] as never);

      await getMyLikedPerfumesService(ids.userId);

      expect(prisma.perfumeLike.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: "desc" },
        })
      );
    });
  });

  describe("getMyLikedPostsService", () => {
    it("좋아요한 게시글 목록을 조회해야 한다", async () => {
      const { ids, mockPost } = getTestData();

      vi.mocked(prisma.postLike.findMany).mockResolvedValue([
        { post: mockPost, createdAt: new Date() },
      ] as never);

      const result = await getMyLikedPostsService(ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1);
        expect(result.data[0].title).toBe("테스트 게시글");
      }
    });

    it("생성일 기준 내림차순 정렬이어야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.postLike.findMany).mockResolvedValue([] as never);

      await getMyLikedPostsService(ids.userId);

      expect(prisma.postLike.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: "desc" },
        })
      );
    });
  });

  describe("postPhotoCollectionService", () => {
    it("컬렉션을 등록해야 한다", async () => {
      const { ids, mockCollection } = getTestData();

      vi.mocked(prisma.userCollection.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.userCollection.upsert).mockResolvedValue(
        mockCollection() as never
      );

      const result = await postPhotoCollectionService({
        userId: ids.userId,
        perfumeId: ids.perfumeId,
        comment: "내 컬렉션",
        imageInfo: {
          imageUrl: "https://example.com/collection.jpg",
          width: 800,
          height: 600,
          format: "JPEG",
        },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.comment).toBe("내 컬렉션");
      }
    });

    it("중복 시 기존 이미지를 삭제하고 새 이미지로 교체(upsert)해야 한다", async () => {
      const { ids, mockCollection } = getTestData();
      const { deleteImageByUrl } = await import("../file.service");

      vi.mocked(prisma.userCollection.findUnique).mockResolvedValue(
        mockCollection() as never
      );
      vi.mocked(prisma.userCollection.upsert).mockResolvedValue(
        mockCollection() as never
      );

      const result = await postPhotoCollectionService({
        userId: ids.userId,
        perfumeId: ids.perfumeId,
        imageInfo: {
          imageUrl: "https://example.com/new-collection.jpg",
          width: 1000,
          height: 800,
          format: "PNG",
        },
      });

      expect(result.success).toBe(true);
      expect(deleteImageByUrl).toHaveBeenCalledWith(
        "collection_image",
        "https://example.com/collection.jpg"
      );
    });

    it("perfumeId 유효성을 검증해야 한다 (UUID 형식)", async () => {
      const { ids } = getTestData();

      const result = await postPhotoCollectionService({
        userId: ids.userId,
        perfumeId: "invalid-uuid",
        imageInfo: {
          imageUrl: "https://example.com/collection.jpg",
          width: 800,
          height: 600,
          format: "JPEG",
        },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
        expect(result.message).toContain("향수 ID");
      }
    });

    it("imageUrl이 없으면 에러를 반환해야 한다", async () => {
      const { ids } = getTestData();

      const result = await postPhotoCollectionService({
        userId: ids.userId,
        perfumeId: ids.perfumeId,
        imageInfo: {
          imageUrl: "",
          width: 800,
          height: 600,
          format: "JPEG",
        },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
        expect(result.message).toContain("이미지 URL");
      }
    });
  });

  describe("deletePhotoCollectionService", () => {
    it("컬렉션을 삭제해야 한다", async () => {
      const { ids, mockCollection } = getTestData();

      vi.mocked(prisma.userCollection.findUnique).mockResolvedValue(
        mockCollection() as never
      );
      vi.mocked(prisma.userCollection.delete).mockResolvedValue({} as never);

      const result = await deletePhotoCollectionService({
        userId: ids.userId,
        collectionId: ids.collectionId,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.message).toContain("컬렉션을 삭제");
      }
    });

    it("컬렉션 이미지가 Supabase Storage에서 삭제되어야 한다", async () => {
      const { ids, mockCollection } = getTestData();
      const { deleteImageByUrl } = await import("../file.service");

      vi.mocked(prisma.userCollection.findUnique).mockResolvedValue(
        mockCollection() as never
      );
      vi.mocked(prisma.userCollection.delete).mockResolvedValue({} as never);

      const result = await deletePhotoCollectionService({
        userId: ids.userId,
        collectionId: ids.collectionId,
      });

      expect(result.success).toBe(true);
      expect(deleteImageByUrl).toHaveBeenCalledWith(
        "collection_image",
        "https://example.com/collection.jpg"
      );
    });

    it("작성자만 컬렉션을 삭제할 수 있어야 한다", async () => {
      const { ids, mockCollection } = getTestData();

      vi.mocked(prisma.userCollection.findUnique).mockResolvedValue(
        mockCollection() as never
      );
      vi.mocked(prisma.userCollection.delete).mockResolvedValue({} as never);

      const result = await deletePhotoCollectionService({
        userId: ids.userId,
        collectionId: ids.collectionId,
      });

      expect(result.success).toBe(true);
    });

    it("존재하지 않는 컬렉션은 NOT_FOUND 에러를 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.userCollection.findUnique).mockResolvedValue(null);

      const result = await deletePhotoCollectionService({
        userId: ids.userId,
        collectionId: ids.collectionId,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
        expect(result.message).toContain("컬렉션");
      }
    });

    it("작성자가 아닌 경우 FORBIDDEN 에러를 반환해야 한다", async () => {
      const { ids, mockCollection } = getTestData();

      vi.mocked(prisma.userCollection.findUnique).mockResolvedValue(
        mockCollection("other-user-id") as never
      );

      const result = await deletePhotoCollectionService({
        userId: ids.userId,
        collectionId: ids.collectionId,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("FORBIDDEN");
        expect(result.message).toContain("권한");
      }
    });
  });

  describe("getMyReviewsService", () => {
    it("내가 작성한 리뷰 목록을 조회해야 한다", async () => {
      const { ids, mockReview } = getTestData();

      vi.mocked(prisma.review.findMany).mockResolvedValue([
        mockReview,
      ] as never);
      vi.mocked(prisma.review.count).mockResolvedValue(1);

      const result = await getMyReviewsService(ids.userId, {});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.data).toHaveLength(1);
        expect(result.data.totalCount).toBe(1);
      }
    });

    it("커서 기반 페이지네이션이 작동해야 한다", async () => {
      const { ids, mockReview } = getTestData();

      vi.mocked(prisma.review.findMany).mockResolvedValue([
        mockReview,
      ] as never);
      vi.mocked(prisma.review.count).mockResolvedValue(20);

      const result = await getMyReviewsService(ids.userId, {
        limit: 12,
        cursor: "cursor-id",
      });

      expect(result.success).toBe(true);
      expect(prisma.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 13,
          cursor: { id: "cursor-id" },
          skip: 1,
        })
      );
    });

    it("생성일 기준 내림차순 정렬이어야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.review.findMany).mockResolvedValue([] as never);
      vi.mocked(prisma.review.count).mockResolvedValue(0);

      await getMyReviewsService(ids.userId, {});

      expect(prisma.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: "desc" },
        })
      );
    });
  });

  describe("getMyPostsService", () => {
    it("내가 작성한 게시글 목록을 조회해야 한다", async () => {
      const { ids, mockPost } = getTestData();

      vi.mocked(prisma.post.findMany).mockResolvedValue([mockPost] as never);
      vi.mocked(prisma.post.count).mockResolvedValue(1);

      const result = await getMyPostsService(ids.userId, {});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.data).toHaveLength(1);
        expect(result.data.totalCount).toBe(1);
      }
    });

    it("커서 기반 페이지네이션이 작동해야 한다", async () => {
      const { ids, mockPost } = getTestData();

      vi.mocked(prisma.post.findMany).mockResolvedValue([mockPost] as never);
      vi.mocked(prisma.post.count).mockResolvedValue(20);

      const result = await getMyPostsService(ids.userId, {
        limit: 12,
        cursor: "cursor-id",
      });

      expect(result.success).toBe(true);
      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 13,
          cursor: { id: "cursor-id" },
          skip: 1,
        })
      );
    });

    it("생성일 기준 내림차순 정렬이어야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.post.findMany).mockResolvedValue([] as never);
      vi.mocked(prisma.post.count).mockResolvedValue(0);

      await getMyPostsService(ids.userId, {});

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: "desc" },
        })
      );
    });
  });

  describe("getMyCommentsService", () => {
    it("내가 작성한 댓글 목록을 조회해야 한다", async () => {
      const { ids, mockComment } = getTestData();

      vi.mocked(prisma.comment.findMany).mockResolvedValue([
        mockComment,
      ] as never);
      vi.mocked(prisma.comment.count).mockResolvedValue(1);

      const result = await getMyCommentsService(ids.userId, {});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.data).toHaveLength(1);
        expect(result.data.totalCount).toBe(1);
      }
    });

    it("커서 기반 페이지네이션이 작동해야 한다", async () => {
      const { ids, mockComment } = getTestData();

      vi.mocked(prisma.comment.findMany).mockResolvedValue([
        mockComment,
      ] as never);
      vi.mocked(prisma.comment.count).mockResolvedValue(20);

      const result = await getMyCommentsService(ids.userId, {
        limit: 12,
        cursor: "cursor-id",
      });

      expect(result.success).toBe(true);
      expect(prisma.comment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 13,
          cursor: { id: "cursor-id" },
          skip: 1,
        })
      );
    });

    it("생성일 기준 내림차순 정렬이어야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.comment.findMany).mockResolvedValue([] as never);
      vi.mocked(prisma.comment.count).mockResolvedValue(0);

      await getMyCommentsService(ids.userId, {});

      expect(prisma.comment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: "desc" },
        })
      );
    });
  });

  describe("에러 처리", () => {
    it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.user.findUnique).mockRejectedValue(
        new Error("Database connection failed")
      );

      const result = await getMyProfileService(ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });
  });
});
