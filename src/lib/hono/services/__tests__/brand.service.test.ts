import { describe, it, expect, beforeEach, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  getAllBrandsService,
  getBrandByIdService,
  getBrandByNameService,
} from "../brand.service";

/**
 * Brand 서비스 테스트 (MVP)
 *
 * 테스트 전략:
 * - 브랜드 CRUD 핵심 로직 검증
 * - nameKo null 시 nameEn 대체 로직 확인
 * - 에러 처리 검증
 *
 * 주요 시나리오:
 * 1. 전체 브랜드 목록 조회
 * 2. ID로 브랜드 조회 (존재/미존재)
 * 3. 이름으로 브랜드 조회 (존재/미존재)
 * 4. nameKo null 시 nameEn 대체
 */

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    brand: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("../utils/prisma.utils", () => ({
  brandDetailSelect: {
    id: true,
    nameEn: true,
    nameKo: true,
    description: true,
    imageUrl: true,
    brandUrl: true,
    mapLocation: true,
  },
  parseMapLocation: vi.fn((location) => location),
}));

describe("Brand Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllBrandsService", () => {
    it("모든 브랜드를 조회해야 한다", async () => {
      const mockBrands = [
        {
          id: "brand-1",
          nameEn: "Brand One",
          nameKo: "브랜드 원",
          description: "Description 1",
          imageUrl: "brand1.jpg",
          brandUrl: "https://brand1.com",
          mapLocation: null,
        },
        {
          id: "brand-2",
          nameEn: "Brand Two",
          nameKo: null,
          description: "Description 2",
          imageUrl: "brand2.jpg",
          brandUrl: null,
          mapLocation: null,
        },
      ];

      vi.mocked(prisma.brand.findMany).mockResolvedValue(mockBrands as never);

      const result = await getAllBrandsService();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(2);
        expect(result.data[0].nameKo).toBe("브랜드 원");
        expect(result.data[1].nameKo).toBe("Brand Two"); // nameKo가 null이면 nameEn 사용
      }
    });

    it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      vi.mocked(prisma.brand.findMany).mockRejectedValue(
        new Error("Database error")
      );

      const result = await getAllBrandsService();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });
  });

  describe("getBrandByIdService", () => {
    it("ID로 브랜드를 조회해야 한다", async () => {
      const mockBrand = {
        id: "brand-1",
        nameEn: "Test Brand",
        nameKo: "테스트 브랜드",
        description: "Test Description",
        imageUrl: "test.jpg",
        brandUrl: "https://test.com",
        mapLocation: null,
      };

      vi.mocked(prisma.brand.findUnique).mockResolvedValue(mockBrand as never);

      const result = await getBrandByIdService("brand-1");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe("brand-1");
        expect(result.data.nameKo).toBe("테스트 브랜드");
      }
    });

    it("nameKo가 null이면 nameEn을 사용해야 한다", async () => {
      const mockBrand = {
        id: "brand-1",
        nameEn: "Test Brand",
        nameKo: null,
        description: "Test Description",
        imageUrl: "test.jpg",
        brandUrl: null,
        mapLocation: null,
      };

      vi.mocked(prisma.brand.findUnique).mockResolvedValue(mockBrand as never);

      const result = await getBrandByIdService("brand-1");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.nameKo).toBe("Test Brand");
      }
    });

    it("존재하지 않는 브랜드는 NOT_FOUND 에러를 반환해야 한다", async () => {
      vi.mocked(prisma.brand.findUnique).mockResolvedValue(null);

      const result = await getBrandByIdService("non-existent");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
      }
    });
  });

  describe("getBrandByNameService", () => {
    it("이름으로 브랜드를 조회해야 한다", async () => {
      const mockBrand = {
        id: "brand-1",
        nameEn: "Test Brand",
        nameKo: "테스트 브랜드",
        description: "Test Description",
        imageUrl: "test.jpg",
        brandUrl: "https://test.com",
        mapLocation: null,
      };

      vi.mocked(prisma.brand.findUnique).mockResolvedValue(mockBrand as never);

      const result = await getBrandByNameService("Test Brand");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.nameEn).toBe("Test Brand");
      }
    });

    it("존재하지 않는 브랜드는 NOT_FOUND 에러를 반환해야 한다", async () => {
      vi.mocked(prisma.brand.findUnique).mockResolvedValue(null);

      const result = await getBrandByNameService("Non Existent Brand");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
      }
    });
  });
});
