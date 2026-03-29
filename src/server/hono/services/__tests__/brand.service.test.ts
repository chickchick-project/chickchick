import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { prisma } from "@/server/prisma";
import {
  getAllBrandsService,
  getBrandByIdService,
  getBrandByNameService,
  getStoresByNameService,
} from "../brand.service";

/**
 * Brand 서비스 테스트 (MVP)
 *
 * 테스트 전략:
 * - 브랜드 CRUD 핵심 로직 검증
 * - nameKo null 시 nameEn 대체 로직 확인
 * - 네이버 API 호출 및 거리 계산 검증
 * - 에러 처리 검증
 */

// Mock Prisma
vi.mock("@/server/prisma", () => ({
  prisma: {
    brand: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("../../repositories/brand.repository", () => ({
  brandDetailSelect: {
    id: true,
    nameEn: true,
    nameKo: true,
    description: true,
    imageUrl: true,
    brandUrl: true,
    mapLocation: true,
  },
  parseMapLocation: vi.fn((location) => {
    if (location === null) return null;
    if (typeof location === "object" && location !== null && !Array.isArray(location)) {
      const obj = location as Record<string, unknown>;
      if (typeof obj.latitude === "number" && typeof obj.longitude === "number") {
        return { latitude: obj.latitude, longitude: obj.longitude };
      }
    }
    return null;
  }),
}));

describe("Brand Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllBrandsService", () => {
    it("모든 브랜드를 조회해야 한다", async () => {
      const mockBrands = [
        { id: "brand-1", nameEn: "Brand One", nameKo: "브랜드 원" },
        { id: "brand-2", nameEn: "Brand Two", nameKo: null },
      ];

      vi.mocked(prisma.brand.findMany).mockResolvedValue(mockBrands as never);

      const result = await getAllBrandsService();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(2);
        expect(result.data[0].nameKo).toBe("브랜드 원");
        expect(result.data[1].nameKo).toBe("Brand Two"); // nameKo null → nameEn 사용
      }
    });

    it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      vi.mocked(prisma.brand.findMany).mockRejectedValue(new Error("Database error"));

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

    it("mapLocation이 있으면 파싱하여 반환해야 한다", async () => {
      const { parseMapLocation } = await import("../../repositories/brand.repository");
      const mockBrand = {
        id: "brand-1",
        nameEn: "Test Brand",
        nameKo: "테스트 브랜드",
        description: null,
        imageUrl: null,
        brandUrl: null,
        mapLocation: { latitude: 37.5665, longitude: 126.978 },
      };

      vi.mocked(prisma.brand.findUnique).mockResolvedValue(mockBrand as never);

      await getBrandByIdService("brand-1");

      expect(parseMapLocation).toHaveBeenCalledWith(mockBrand.mapLocation);
    });

    it("존재하지 않는 브랜드는 NOT_FOUND 에러를 반환해야 한다", async () => {
      vi.mocked(prisma.brand.findUnique).mockResolvedValue(null);

      const result = await getBrandByIdService("non-existent");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("NOT_FOUND");
      }
    });

    it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      vi.mocked(prisma.brand.findUnique).mockRejectedValue(new Error("Database error"));

      const result = await getBrandByIdService("brand-1");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
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

      const result = await getBrandByNameService("테스트 브랜드");

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

    it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      vi.mocked(prisma.brand.findUnique).mockRejectedValue(new Error("Database error"));

      const result = await getBrandByNameService("테스트 브랜드");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });
  });

  describe("getStoresByNameService", () => {
    const mockNaverResponse = {
      total: 3,
      items: [
        {
          title: "<b>샤넬</b> 명동",
          address: "서울 중구 명동길 1",
          roadAddress: "서울 중구 명동길 1",
          telephone: "02-1234-5678",
          mapx: "1269780000",
          mapy: "375665000",
          category: "쇼핑,화장품",
          link: "https://chanel.com",
        },
        {
          title: "샤넬 강남",
          address: "서울 강남구 압구정로 1",
          roadAddress: "서울 강남구 압구정로 1",
          telephone: "02-9876-5432",
          mapx: "1270540000",
          mapy: "373936000",
          category: "쇼핑,화장품",
          link: "",
        },
      ],
    };

    beforeEach(() => {
      // 환경변수 설정
      process.env.NAVER_CLIENT_ID = "test-client-id";
      process.env.NAVER_CLIENT_SECRET = "test-client-secret";

      // global fetch mock
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(mockNaverResponse),
        })
      );
    });

    afterEach(() => {
      vi.unstubAllGlobals();
      delete process.env.NAVER_CLIENT_ID;
      delete process.env.NAVER_CLIENT_SECRET;
    });

    it("네이버 API를 호출하고 매장 목록을 반환해야 한다", async () => {
      const result = await getStoresByNameService("샤넬");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.stores).toHaveLength(2);
        expect(result.data.total).toBe(3);
        // HTML 태그 제거 확인
        expect(result.data.stores[0].name).toBe("샤넬 명동");
      }
    });

    it("coords가 제공되면 거리순 정렬이 적용되어야 한다", async () => {
      // 강남점 근처 좌표 (decimal 형식, service에서 parseFloat으로 파싱)
      const coords = { x: "127.054", y: "37.3936" };

      const result = await getStoresByNameService("샤넬", coords);

      expect(result.success).toBe(true);
      if (result.success) {
        // distance 필드가 추가되어야 함
        expect(result.data.stores[0]).toHaveProperty("distance");
        // 강남에서 가까운 강남점이 먼저 와야 함
        expect(result.data.stores[0].name).toBe("샤넬 강남");
      }
    });

    it("검색 결과가 없으면 빈 배열을 반환해야 한다", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({ total: 0, items: [] }),
        })
      );

      const result = await getStoresByNameService("존재하지않는브랜드");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.stores).toHaveLength(0);
        expect(result.data.total).toBe(0);
      }
    });

    it("NAVER API 자격증명이 없으면 INTERNAL_ERROR를 반환해야 한다", async () => {
      delete process.env.NAVER_CLIENT_ID;
      delete process.env.NAVER_CLIENT_SECRET;

      const result = await getStoresByNameService("샤넬");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });

    it("네이버 API 응답 오류 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
        })
      );

      const result = await getStoresByNameService("샤넬");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });

    it("네트워크 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

      const result = await getStoresByNameService("샤넬");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });
  });
});
