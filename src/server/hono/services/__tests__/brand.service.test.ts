import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { prisma } from "@/server/prisma";
import {
  getAllBrandsService,
  getBrandByIdService,
  getBrandByNameService,
  getStoresByNameService,
} from "../brand.service";

/**
 * Brand 서비스 테스트
 *
 * 테스트 전략:
 * - 브랜드 CRUD 핵심 로직 검증
 * - nameKo null 시 nameEn 대체 로직 확인
 * - 카카오 로컬 검색 API 호출 및 카테고리 필터링 검증
 * - 에러 처리 검증
 */

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
    if (
      typeof location === "object" &&
      location !== null &&
      !Array.isArray(location)
    ) {
      const obj = location as Record<string, unknown>;
      if (
        typeof obj.latitude === "number" &&
        typeof obj.longitude === "number"
      ) {
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
      vi.mocked(prisma.brand.findMany).mockRejectedValue(
        new Error("Database error"),
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

    it("mapLocation이 있으면 파싱하여 반환해야 한다", async () => {
      const { parseMapLocation } =
        await import("../../repositories/brand.repository");
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
      vi.mocked(prisma.brand.findUnique).mockRejectedValue(
        new Error("Database error"),
      );

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
      vi.mocked(prisma.brand.findUnique).mockRejectedValue(
        new Error("Database error"),
      );

      const result = await getBrandByNameService("테스트 브랜드");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });
  });

  describe("getStoresByNameService", () => {
    const perfumeStoreDocs = [
      {
        place_name: "딥티크 명동",
        address_name: "서울 중구 명동길 1",
        road_address_name: "서울 중구 명동길 1",
        phone: "02-1234-5678",
        x: "126.978",
        y: "37.5665",
        category_name: "가정,생활 > 향수",
        category_group_code: "HP8",
        distance: "500",
      },
      {
        place_name: "딥티크 강남",
        address_name: "서울 강남구 압구정로 1",
        road_address_name: "서울 강남구 압구정로 1",
        phone: "02-9876-5432",
        x: "127.054",
        y: "37.394",
        category_name: "화장품",
        category_group_code: "HP8",
        distance: "",
      },
    ];

    const makeKakaoResponse = (documents: typeof perfumeStoreDocs) => ({
      meta: { total_count: documents.length },
      documents,
    });

    beforeEach(() => {
      process.env.KAKAO_REST_KEY = "test-kakao-key";

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(makeKakaoResponse(perfumeStoreDocs)),
        }),
      );
    });

    afterEach(() => {
      vi.unstubAllGlobals();
      delete process.env.KAKAO_REST_KEY;
    });

    it("카카오 로컬 검색 API를 호출하고 매장 목록을 반환해야 한다", async () => {
      const result = await getStoresByNameService("딥티크");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.stores).toHaveLength(2);
        expect(result.data.total).toBe(2);
        expect(result.data.stores[0].name).toBe("딥티크 명동");
      }
    });

    it("x, y 좌표가 제공되면 radius 파라미터를 포함하여 API를 호출해야 한다", async () => {
      await getStoresByNameService("딥티크", "127.054", "37.394");

      const fetchCall = vi.mocked(fetch).mock.calls[0];
      const url = fetchCall[0] as string;

      expect(url).toContain("x=127.054");
      expect(url).toContain("y=37.394");
      expect(url).toContain("radius=20000");
    });

    it("x, y 좌표가 없으면 radius 파라미터를 포함하지 않아야 한다", async () => {
      await getStoresByNameService("딥티크");

      const fetchCall = vi.mocked(fetch).mock.calls[0];
      const url = fetchCall[0] as string;

      expect(url).not.toContain("radius");
    });

    it("카테고리 필터링 — '가정,생활' + '향수' 조합이 포함된 매장을 반환해야 한다", async () => {
      const docs = [
        {
          ...perfumeStoreDocs[0],
          category_name: "가정,생활 > 향수 > 니치향수",
        },
        {
          ...perfumeStoreDocs[0],
          place_name: "필터 제외 매장",
          category_name: "음식점 > 카페",
        },
      ];

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(makeKakaoResponse(docs)),
      } as never);

      const result = await getStoresByNameService("딥티크");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.stores).toHaveLength(1);
        expect(result.data.stores[0].name).toBe("딥티크 명동");
      }
    });

    it("카테고리 필터링 — '화장품'이 포함된 매장을 반환해야 한다", async () => {
      const docs = [
        {
          ...perfumeStoreDocs[0],
          place_name: "화장품 매장",
          category_name: "쇼핑 > 화장품",
        },
        {
          ...perfumeStoreDocs[0],
          place_name: "필터 제외 매장",
          category_name: "음식점 > 레스토랑",
        },
      ];

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(makeKakaoResponse(docs)),
      } as never);

      const result = await getStoresByNameService("딥티크");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.stores).toHaveLength(1);
        expect(result.data.stores[0].name).toBe("화장품 매장");
      }
    });

    it("distance가 빈 문자열이면 undefined로 변환해야 한다", async () => {
      const result = await getStoresByNameService("딥티크");

      expect(result.success).toBe(true);
      if (result.success) {
        const gangnам = result.data.stores.find(
          (s) => s.name === "딥티크 강남",
        );
        expect(gangnам?.distance).toBeUndefined();
      }
    });

    it("distance가 있으면 숫자로 변환해야 한다", async () => {
      const result = await getStoresByNameService("딥티크");

      expect(result.success).toBe(true);
      if (result.success) {
        const myeongdong = result.data.stores.find(
          (s) => s.name === "딥티크 명동",
        );
        expect(myeongdong?.distance).toBe(500);
      }
    });

    it("검색 결과가 없으면 빈 배열을 반환해야 한다", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(makeKakaoResponse([])),
      } as never);

      const result = await getStoresByNameService("존재하지않는브랜드");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.stores).toHaveLength(0);
        expect(result.data.total).toBe(0);
      }
    });

    it("카카오 API 응답 오류 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValue({ msg: "unauthorized" }),
      } as never);

      const result = await getStoresByNameService("딥티크");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });

    it("네트워크 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

      const result = await getStoresByNameService("딥티크");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });
  });
});
