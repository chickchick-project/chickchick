import { describe, it, expect, beforeEach, vi } from "vitest";
import { supabase } from "@/lib/supabase/init";
import {
  getAvailableFiltersService,
  getAvailableFiltersTotalService,
} from "../filter.service";
import type { RawFilterOption } from "../../schemas/filter.schema";
import { getTestData } from "./helpers/filter.test.helpers";

/**
 * Filter 서비스 테스트 (MVP - 유닛 테스트 가능 영역만)
 *
 * 테스트 전략:
 * - 필터 배열 처리 로직 검증 (processFilters)
 * - RawFilterOption 데이터 변환 로직 검증
 * - 카멜케이스 변환 확인 (name_ko → nameKo)
 * - Supabase RPC 호출 검증 (Mock)
 *
 * 주요 시나리오:
 * 1. 필터 배열 처리 (빈 배열/undefined → null 변환)
 * 2. 데이터 변환 및 분류 (notes/accords/brands)
 * 3. Supabase RPC 호출 (get_available_filters, get_available_filters_total)
 *
 * Note: Supabase RPC 호출은 통합 테스트 필요
 */

// Mock supabase
vi.mock("@/lib/supabase/init", () => ({
  supabase: {
    rpc: vi.fn(),
  },
}));

describe("Filter Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAvailableFiltersService - 필터 처리", () => {
    it("빈 배열은 null로 변환되어야 한다", async () => {
      const { mockRawFilters } = getTestData();

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockRawFilters,
        error: null,
      } as never);

      await getAvailableFiltersService({
        searchText: "",
        brandFilter: [],
        notesFilter: [],
        accordsFilter: [],
      });

      expect(supabase.rpc).toHaveBeenCalledWith("get_available_filters", {
        search_text: "",
        brand_filter: null,
        notes_filter: null,
        accords_filter: null,
      });
    });

    it("undefined 필터는 null로 변환되어야 한다", async () => {
      const { mockRawFilters } = getTestData();

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockRawFilters,
        error: null,
      } as never);

      await getAvailableFiltersService({
        searchText: "",
        brandFilter: undefined,
        notesFilter: undefined,
        accordsFilter: undefined,
      });

      expect(supabase.rpc).toHaveBeenCalledWith("get_available_filters", {
        search_text: "",
        brand_filter: null,
        notes_filter: null,
        accords_filter: null,
      });
    });

    it("유효한 필터 배열은 그대로 전달되어야 한다", async () => {
      const { mockRawFilters } = getTestData();

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockRawFilters,
        error: null,
      } as never);

      await getAvailableFiltersService({
        searchText: "",
        brandFilter: ["brand-1", "brand-2"],
        notesFilter: ["note-1"],
        accordsFilter: ["accord-1", "accord-2"],
      });

      expect(supabase.rpc).toHaveBeenCalledWith("get_available_filters", {
        search_text: "",
        brand_filter: ["brand-1", "brand-2"],
        notes_filter: ["note-1"],
        accords_filter: ["accord-1", "accord-2"],
      });
    });
  });

  describe("getAvailableFiltersService - 데이터 변환", () => {
    it("RawFilterOption을 category별로 분류해야 한다", async () => {
      const { mockRawFilters } = getTestData();

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockRawFilters,
        error: null,
      } as never);

      const result = await getAvailableFiltersService({
        searchText: "",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.notes).toHaveLength(2);
        expect(result.data.accords).toHaveLength(2);
        expect(result.data.brands).toHaveLength(2);
      }
    });

    it("notes 카테고리 데이터가 올바르게 매핑되어야 한다", async () => {
      const { mockRawFilters } = getTestData();

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockRawFilters,
        error: null,
      } as never);

      const result = await getAvailableFiltersService({
        searchText: "",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.notes[0]).toEqual({
          id: "note-1",
          nameKo: "장미",
          nameEn: "Rose",
          count: 15,
        });
        expect(result.data.notes[1]).toEqual({
          id: "note-2",
          nameKo: "바닐라",
          nameEn: "Vanilla",
          count: 20,
        });
      }
    });

    it("accords 카테고리 데이터가 올바르게 매핑되어야 한다", async () => {
      const { mockRawFilters } = getTestData();

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockRawFilters,
        error: null,
      } as never);

      const result = await getAvailableFiltersService({
        searchText: "",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.accords[0]).toEqual({
          id: "accord-1",
          nameKo: "플로럴",
          nameEn: "Floral",
          count: 30,
        });
        expect(result.data.accords[1]).toEqual({
          id: "accord-2",
          nameKo: "우디",
          nameEn: "Woody",
          count: 25,
        });
      }
    });

    it("brands 카테고리 데이터가 올바르게 매핑되어야 한다", async () => {
      const { mockRawFilters } = getTestData();

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockRawFilters,
        error: null,
      } as never);

      const result = await getAvailableFiltersService({
        searchText: "",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.brands[0]).toEqual({
          id: "brand-1",
          nameKo: "샤넬",
          nameEn: "Chanel",
          count: 10,
        });
        expect(result.data.brands[1]).toEqual({
          id: "brand-2",
          nameKo: "디올",
          nameEn: "Dior",
          count: 12,
        });
      }
    });

    it("스네이크케이스를 카멜케이스로 변환해야 한다 (name_ko → nameKo)", async () => {
      const mockRawData: RawFilterOption[] = [
        {
          id: "test-1",
          name_ko: "테스트 한글",
          name_en: "Test English",
          count: 5,
          category: "notes",
        },
      ];

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockRawData,
        error: null,
      } as never);

      const result = await getAvailableFiltersService({
        searchText: "",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        const note = result.data.notes[0];
        expect(note).toHaveProperty("nameKo");
        expect(note).toHaveProperty("nameEn");
        expect(note).not.toHaveProperty("name_ko");
        expect(note).not.toHaveProperty("name_en");
        expect(note.nameKo).toBe("테스트 한글");
        expect(note.nameEn).toBe("Test English");
      }
    });

    it("빈 응답은 빈 객체를 반환해야 한다", async () => {
      vi.mocked(supabase.rpc).mockResolvedValue({
        data: null,
        error: null,
      } as never);

      const result = await getAvailableFiltersService({
        searchText: "",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          notes: [],
          accords: [],
          brands: [],
        });
      }
    });
  });

  describe("getAvailableFiltersService - Supabase RPC", () => {
    it("get_available_filters RPC 함수를 호출해야 한다", async () => {
      const { mockRawFilters } = getTestData();

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockRawFilters,
        error: null,
      } as never);

      await getAvailableFiltersService({
        searchText: "",
      });

      expect(supabase.rpc).toHaveBeenCalledWith(
        "get_available_filters",
        expect.any(Object)
      );
    });

    it("RPC 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      vi.mocked(supabase.rpc).mockResolvedValue({
        data: null,
        error: new Error("Database connection failed"),
      } as never);

      const result = await getAvailableFiltersService({
        searchText: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });

    it("searchText가 RPC 파라미터에 포함되어야 한다", async () => {
      const { mockRawFilters } = getTestData();

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockRawFilters,
        error: null,
      } as never);

      await getAvailableFiltersService({
        searchText: "샤넬",
      });

      expect(supabase.rpc).toHaveBeenCalledWith("get_available_filters", {
        search_text: "샤넬",
        brand_filter: null,
        notes_filter: null,
        accords_filter: null,
      });
    });
  });

  describe("getAvailableFiltersTotalService", () => {
    it("get_available_filters_total RPC 함수를 호출해야 한다", async () => {
      const { mockFilterTotals } = getTestData();

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockFilterTotals,
        error: null,
      } as never);

      await getAvailableFiltersTotalService({
        searchText: "",
      });

      expect(supabase.rpc).toHaveBeenCalledWith(
        "get_available_filters_total",
        expect.any(Object)
      );
    });

    it("필터 처리 로직이 동일하게 적용되어야 한다", async () => {
      const { mockFilterTotals } = getTestData();

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockFilterTotals,
        error: null,
      } as never);

      await getAvailableFiltersTotalService({
        searchText: "테스트",
        brandFilter: [],
        notesFilter: ["note-1"],
        accordsFilter: undefined,
      });

      expect(supabase.rpc).toHaveBeenCalledWith("get_available_filters_total", {
        search_text: "테스트",
        brand_filter: null,
        notes_filter: ["note-1"],
        accords_filter: null,
      });
    });

    it("RPC 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      vi.mocked(supabase.rpc).mockResolvedValue({
        data: null,
        error: new Error("Database connection failed"),
      } as never);

      const result = await getAvailableFiltersTotalService({
        searchText: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });

    it("빈 응답은 빈 배열을 반환해야 한다", async () => {
      vi.mocked(supabase.rpc).mockResolvedValue({
        data: null,
        error: null,
      } as never);

      const result = await getAvailableFiltersTotalService({
        searchText: "",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([]);
      }
    });
  });

  describe("에러 처리", () => {
    it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      vi.mocked(supabase.rpc).mockRejectedValue(
        new Error("Connection timeout")
      );

      const result = await getAvailableFiltersService({
        searchText: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });
  });
});
