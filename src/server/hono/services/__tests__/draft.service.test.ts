import { describe, it, expect, beforeEach, vi } from "vitest";
import { prisma } from "@/server/prisma";
import { DraftType } from "@prisma/client";
import {
  createOrUpdateDraftService,
  getDraftService,
  listDraftsService,
  deleteDraftService,
} from "../draft.service";
import { getTestData } from "./helpers/draft.test.helpers";
import { checkResourceExists } from "../../repositories/base.repository";

/**
 * Draft 서비스 테스트
 *
 * 테스트 전략:
 * - CREATE/UPDATE 타입 분기 검증
 * - 소유권 확인 (FORBIDDEN)
 * - perfumeIds 기반 향수 조회 (batch 최적화 포함)
 * - 에러 처리 검증
 */

vi.mock("@/server/prisma", () => ({
  prisma: {
    postDraft: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      delete: vi.fn(),
    },
    perfume: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("../../repositories/base.repository", () => ({
  checkResourceExists: vi.fn(),
}));

describe("Draft Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createOrUpdateDraftService", () => {
    describe("CREATE 타입", () => {
      it("CREATE 타입 임시 저장을 생성하고 향수 정보를 반환해야 한다", async () => {
        const { ids, createDraftPayload, mockDraft, mockPerfumeRecord } = getTestData();
        vi.mocked(checkResourceExists).mockResolvedValue({ success: true, data: true });
        vi.mocked(prisma.postDraft.upsert).mockResolvedValue(mockDraft() as never);
        vi.mocked(prisma.perfume.findMany).mockResolvedValue([
          mockPerfumeRecord(ids.perfumeId1),
        ] as never);

        const result = await createOrUpdateDraftService(createDraftPayload());

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.type).toBe(DraftType.CREATE);
          expect(result.data.perfumes).toHaveLength(1);
          expect(result.data.perfumes![0].nameKo).toBe("테스트 향수");
          expect(result.data.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/); // ISO string
        }
      });

      it("perfumeIds가 빈 배열이어도 정상 생성되어야 한다", async () => {
        const { createDraftPayload, mockDraft } = getTestData();
        const emptyPerfumeDraft = { ...mockDraft(), perfumeIds: [] };
        vi.mocked(checkResourceExists).mockResolvedValue({ success: true, data: true });
        vi.mocked(prisma.postDraft.upsert).mockResolvedValue(emptyPerfumeDraft as never);
        vi.mocked(prisma.perfume.findMany).mockResolvedValue([] as never);

        const result = await createOrUpdateDraftService({
          ...createDraftPayload(),
          perfumeIds: [],
        });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.perfumes).toHaveLength(0);
        }
      });

      it("CREATE 타입은 postId가 있어도 null로 저장되어야 한다", async () => {
        const { ids, createDraftPayload, mockDraft, mockPerfumeRecord } = getTestData();
        vi.mocked(checkResourceExists).mockResolvedValue({ success: true, data: true });
        vi.mocked(prisma.postDraft.upsert).mockResolvedValue(mockDraft() as never);
        vi.mocked(prisma.perfume.findMany).mockResolvedValue([
          mockPerfumeRecord(ids.perfumeId1),
        ] as never);

        await createOrUpdateDraftService({
          ...createDraftPayload(),
        });

        // upsert 호출 시 CREATE 타입의 postId는 null이어야 함
        expect(prisma.postDraft.upsert).toHaveBeenCalledWith(
          expect.objectContaining({
            create: expect.objectContaining({ postId: null }),
            update: expect.objectContaining({ postId: null }),
          })
        );
      });
    });

    describe("UPDATE 타입", () => {
      it("UPDATE 타입에 postId가 없으면 BAD_REQUEST를 반환해야 한다", async () => {
        const { updateDraftPayload } = getTestData();
        vi.mocked(checkResourceExists).mockResolvedValue({ success: true, data: true });

        const result = await createOrUpdateDraftService({
          ...updateDraftPayload(),
          postId: undefined,
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe("BAD_REQUEST");
        }
      });

      it("UPDATE 타입에 postId와 함께 임시 저장을 생성해야 한다", async () => {
        const { ids, updateDraftPayload, mockUpdateDraft, mockPerfumeRecord } = getTestData();
        vi.mocked(checkResourceExists).mockResolvedValue({ success: true, data: true });
        vi.mocked(prisma.postDraft.upsert).mockResolvedValue(mockUpdateDraft() as never);
        vi.mocked(prisma.perfume.findMany).mockResolvedValue([
          mockPerfumeRecord(ids.perfumeId1),
          mockPerfumeRecord(ids.perfumeId2),
        ] as never);

        const result = await createOrUpdateDraftService(updateDraftPayload());

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.type).toBe(DraftType.UPDATE);
          expect(result.data.postId).toBe(ids.postId);
        }
      });

      it("UPDATE 타입에서 존재하지 않는 postId이면 NOT_FOUND를 반환해야 한다", async () => {
        const { updateDraftPayload } = getTestData();
        vi.mocked(checkResourceExists)
          .mockResolvedValueOnce({ success: true, data: true }) // user 존재
          .mockResolvedValueOnce({
            success: false,
            error: "NOT_FOUND",
            message: "게시글을(를) 찾을 수 없습니다.",
          }); // post 미존재

        const result = await createOrUpdateDraftService(updateDraftPayload());

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe("NOT_FOUND");
        }
      });
    });

    describe("에러 처리", () => {
      it("존재하지 않는 userId이면 NOT_FOUND를 반환해야 한다", async () => {
        const { createDraftPayload } = getTestData();
        vi.mocked(checkResourceExists).mockResolvedValue({
          success: false,
          error: "NOT_FOUND",
          message: "사용자을(를) 찾을 수 없습니다.",
        });

        const result = await createOrUpdateDraftService(createDraftPayload());

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe("NOT_FOUND");
        }
      });

      it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
        const { createDraftPayload } = getTestData();
        vi.mocked(checkResourceExists).mockResolvedValue({ success: true, data: true });
        vi.mocked(prisma.postDraft.upsert).mockRejectedValue(new Error("Database error"));

        const result = await createOrUpdateDraftService(createDraftPayload());

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe("INTERNAL_ERROR");
        }
      });
    });
  });

  describe("getDraftService", () => {
    it("임시 저장을 조회하고 향수 정보를 포함하여 반환해야 한다", async () => {
      const { ids, mockDraft, mockPerfumeRecord } = getTestData();

      vi.mocked(prisma.postDraft.findUnique).mockResolvedValue(mockDraft() as never);
      vi.mocked(prisma.perfume.findMany).mockResolvedValue([
        mockPerfumeRecord(ids.perfumeId1),
      ] as never);

      const result = await getDraftService(ids.draftId, ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(ids.draftId);
        expect(result.data.perfumes).toHaveLength(1);
        expect(result.data.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      }
    });

    it("perfumeIds 기반으로 향수 정보를 조회해야 한다", async () => {
      const { ids, mockDraft, mockPerfumeRecord } = getTestData();

      vi.mocked(prisma.postDraft.findUnique).mockResolvedValue(mockDraft() as never);
      vi.mocked(prisma.perfume.findMany).mockResolvedValue([
        mockPerfumeRecord(ids.perfumeId1),
      ] as never);

      await getDraftService(ids.draftId, ids.userId);

      expect(prisma.perfume.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: { in: [ids.perfumeId1] } },
        })
      );
    });

    it("존재하지 않는 draft이면 NOT_FOUND를 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.postDraft.findUnique).mockResolvedValue(null);

      const result = await getDraftService(ids.draftId, ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
      }
    });

    it("다른 사용자의 draft 조회 시 FORBIDDEN을 반환해야 한다", async () => {
      const { ids, mockDraft } = getTestData();

      vi.mocked(prisma.postDraft.findUnique).mockResolvedValue({
        ...mockDraft(),
        userId: "other-user-id",
      } as never);

      const result = await getDraftService(ids.draftId, ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("FORBIDDEN");
      }
    });

    it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.postDraft.findUnique).mockRejectedValue(new Error("Database error"));

      const result = await getDraftService(ids.draftId, ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });
  });

  describe("listDraftsService", () => {
    it("사용자의 모든 임시 저장을 최신순으로 반환해야 한다", async () => {
      const { ids, mockDraftList, mockPerfumeRecord } = getTestData();

      vi.mocked(prisma.postDraft.findMany).mockResolvedValue(mockDraftList() as never);
      vi.mocked(prisma.perfume.findMany).mockResolvedValue([
        mockPerfumeRecord(ids.perfumeId1),
        mockPerfumeRecord(ids.perfumeId2),
      ] as never);

      const result = await listDraftsService(ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(2);
        expect(prisma.postDraft.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { userId: ids.userId },
            orderBy: { updatedAt: "desc" },
          })
        );
      }
    });

    it("여러 draft의 perfumeIds를 한 번에 batch 조회해야 한다", async () => {
      const { ids, mockDraftList, mockPerfumeRecord } = getTestData();

      vi.mocked(prisma.postDraft.findMany).mockResolvedValue(mockDraftList() as never);
      vi.mocked(prisma.perfume.findMany).mockResolvedValue([
        mockPerfumeRecord(ids.perfumeId1),
        mockPerfumeRecord(ids.perfumeId2),
      ] as never);

      await listDraftsService(ids.userId);

      // 두 draft의 perfumeIds를 한 번의 쿼리로 조회
      expect(prisma.perfume.findMany).toHaveBeenCalledOnce();
      expect(prisma.perfume.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: {
              in: expect.arrayContaining([ids.perfumeId1, ids.perfumeId2]),
            },
          },
        })
      );
    });

    it("임시 저장이 없으면 빈 배열을 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.postDraft.findMany).mockResolvedValue([] as never);

      const result = await listDraftsService(ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(0);
        // perfume 조회가 호출되지 않아야 함
        expect(prisma.perfume.findMany).not.toHaveBeenCalled();
      }
    });

    it("perfumeIds가 없는 draft는 빈 perfumes 배열을 반환해야 한다", async () => {
      const { ids, mockDraft } = getTestData();
      const draftWithNoPerfumes = { ...mockDraft(), perfumeIds: [] };

      vi.mocked(prisma.postDraft.findMany).mockResolvedValue([draftWithNoPerfumes] as never);

      const result = await listDraftsService(ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data[0].perfumes).toHaveLength(0);
        // perfumeIds가 없으므로 perfume 조회가 호출되지 않아야 함
        expect(prisma.perfume.findMany).not.toHaveBeenCalled();
      }
    });

    it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.postDraft.findMany).mockRejectedValue(new Error("Database error"));

      const result = await listDraftsService(ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });
  });

  describe("deleteDraftService", () => {
    it("소유한 임시 저장을 삭제해야 한다", async () => {
      const { ids, mockDraft } = getTestData();

      vi.mocked(prisma.postDraft.findUnique).mockResolvedValue(mockDraft() as never);
      vi.mocked(prisma.postDraft.delete).mockResolvedValue({} as never);

      const result = await deleteDraftService(ids.draftId, ids.userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.message).toContain("삭제");
      }
      expect(prisma.postDraft.delete).toHaveBeenCalledWith({
        where: { id: ids.draftId },
      });
    });

    it("존재하지 않는 draft 삭제 시 NOT_FOUND를 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.postDraft.findUnique).mockResolvedValue(null);

      const result = await deleteDraftService(ids.draftId, ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
      }
    });

    it("다른 사용자의 draft 삭제 시 FORBIDDEN을 반환해야 한다", async () => {
      const { ids, mockDraft } = getTestData();

      vi.mocked(prisma.postDraft.findUnique).mockResolvedValue({
        ...mockDraft(),
        userId: "other-user-id",
      } as never);

      const result = await deleteDraftService(ids.draftId, ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("FORBIDDEN");
      }
    });

    it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      const { ids } = getTestData();

      vi.mocked(prisma.postDraft.findUnique).mockRejectedValue(new Error("Database error"));

      const result = await deleteDraftService(ids.draftId, ids.userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });
  });
});
