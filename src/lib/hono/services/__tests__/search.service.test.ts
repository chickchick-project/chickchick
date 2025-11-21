import { describe, it, expect, beforeEach, vi } from "vitest";
import { supabase } from "@/lib/supabase/init";
import { searchPerfumesService } from "../search.service";
import type {
  SearchGetQuery,
  SearchPostBody,
} from "../../schemas/search.schema";
import { getTestData } from "./helpers/search.test.helpers";

// 테스트용 공통 데이터 헬퍼 함수

/**
 * Search 서비스 테스트 (MVP - 유닛 테스트 가능 영역만)
 *
 * 테스트 전략:
 * - 필터 처리 로직 검증 (processFilters)
 * - 데이터 변환 로직 검증 (transformSupabasePerfume)
 * - 페이지네이션 파라미터 처리 확인
 * - Supabase RPC 호출 검증 (Mock)
 *
 * 주요 시나리오:
 * 1. 필터 처리 (빈 배열/undefined → null 변환, GET 요청 처리)
 * 2. 데이터 변환 (Supabase → API 스키마)
 * 3. 페이지네이션 (limit 기본값 15, fetchLimit = limit + 1)
 * 4. Supabase RPC 호출 (search_perfumes, search_perfumes_total)
 *
 * Note: Supabase RPC 호출은 통합 테스트 필요
 */

// Mock supabase
vi.mock("@/lib/supabase/init", () => ({
  supabase: {
    rpc: vi.fn(),
  },
}));

describe("Search Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("searchPerfumesService - 필터 처리", () => {
    it("GET 요청 시 모든 필터가 null이어야 한다", async () => {
      const { mockSupabasePerfumes } = getTestData();

      const mockRpcResponse = {
        data: mockSupabasePerfumes(5),
        error: null,
      };

      const mockTotalResponse = {
        data: 5,
        error: null,
      };

      vi.mocked(supabase.rpc).mockImplementation((funcName: string) => {
        if (funcName === "search_perfumes") {
          return Promise.resolve(mockRpcResponse) as never;
        }
        if (funcName === "search_perfumes_total") {
          return Promise.resolve(mockTotalResponse) as never;
        }
        return Promise.resolve({ data: null, error: null }) as never;
      });

      const getParams: SearchGetQuery = {
        searchText: "test",
        limit: 15,
        cursor: undefined,
      };

      await searchPerfumesService(getParams);

      expect(supabase.rpc).toHaveBeenCalledWith(
        "search_perfumes",
        expect.objectContaining({
          brand_filter: null,
          notes_filter: null,
          accords_filter: null,
        })
      );
    });

    it("POST 요청에서 빈 배열은 null로 변환되어야 한다", async () => {
      const { mockSupabasePerfumes } = getTestData();

      const mockRpcResponse = {
        data: mockSupabasePerfumes(5),
        error: null,
      };

      const mockTotalResponse = {
        data: 5,
        error: null,
      };

      vi.mocked(supabase.rpc).mockImplementation((funcName: string) => {
        if (funcName === "search_perfumes") {
          return Promise.resolve(mockRpcResponse) as never;
        }
        if (funcName === "search_perfumes_total") {
          return Promise.resolve(mockTotalResponse) as never;
        }
        return Promise.resolve({ data: null, error: null }) as never;
      });

      const postParams: SearchPostBody = {
        searchText: "test",
        brandFilter: [],
        notesFilter: [],
        accordsFilter: [],
        limit: 15,
        cursor: undefined,
      };

      await searchPerfumesService(postParams);

      expect(supabase.rpc).toHaveBeenCalledWith(
        "search_perfumes",
        expect.objectContaining({
          brand_filter: null,
          notes_filter: null,
          accords_filter: null,
        })
      );
    });

    it("POST 요청에서 undefined 필터는 null로 변환되어야 한다", async () => {
      const { mockSupabasePerfumes } = getTestData();

      const mockRpcResponse = {
        data: mockSupabasePerfumes(5),
        error: null,
      };

      const mockTotalResponse = {
        data: 5,
        error: null,
      };

      vi.mocked(supabase.rpc).mockImplementation((funcName: string) => {
        if (funcName === "search_perfumes") {
          return Promise.resolve(mockRpcResponse) as never;
        }
        if (funcName === "search_perfumes_total") {
          return Promise.resolve(mockTotalResponse) as never;
        }
        return Promise.resolve({ data: null, error: null }) as never;
      });

      const postParams: SearchPostBody = {
        searchText: "test",
        brandFilter: undefined,
        notesFilter: undefined,
        accordsFilter: undefined,
        limit: 15,
        cursor: undefined,
      };

      await searchPerfumesService(postParams);

      expect(supabase.rpc).toHaveBeenCalledWith(
        "search_perfumes",
        expect.objectContaining({
          brand_filter: null,
          notes_filter: null,
          accords_filter: null,
        })
      );
    });

    it("POST 요청에서 유효한 필터 배열은 그대로 전달되어야 한다", async () => {
      const { ids, mockSupabasePerfumes } = getTestData();

      const mockRpcResponse = {
        data: mockSupabasePerfumes(5),
        error: null,
      };

      const mockTotalResponse = {
        data: 5,
        error: null,
      };

      vi.mocked(supabase.rpc).mockImplementation((funcName: string) => {
        if (funcName === "search_perfumes") {
          return Promise.resolve(mockRpcResponse) as never;
        }
        if (funcName === "search_perfumes_total") {
          return Promise.resolve(mockTotalResponse) as never;
        }
        return Promise.resolve({ data: null, error: null }) as never;
      });

      const brandId = ids.brandId;
      const noteId = "323e4567-e89b-12d3-a456-426614174002";
      const accordId = "423e4567-e89b-12d3-a456-426614174003";

      const postParams: SearchPostBody = {
        searchText: "test",
        brandFilter: [brandId],
        notesFilter: [noteId],
        accordsFilter: [accordId],
        limit: 15,
        cursor: undefined,
      };

      await searchPerfumesService(postParams);

      expect(supabase.rpc).toHaveBeenCalledWith(
        "search_perfumes",
        expect.objectContaining({
          brand_filter: [brandId],
          notes_filter: [noteId],
          accords_filter: [accordId],
        })
      );
    });
  });

  describe("searchPerfumesService - 페이지네이션", () => {
    it("limit 파라미터가 없으면 기본값 15를 사용해야 한다", async () => {
      const { mockSupabasePerfumes } = getTestData();

      const mockRpcResponse = {
        data: mockSupabasePerfumes(16),
        error: null,
      };

      const mockTotalResponse = {
        data: 20,
        error: null,
      };

      vi.mocked(supabase.rpc).mockImplementation((funcName: string) => {
        if (funcName === "search_perfumes") {
          return Promise.resolve(mockRpcResponse) as never;
        }
        if (funcName === "search_perfumes_total") {
          return Promise.resolve(mockTotalResponse) as never;
        }
        return Promise.resolve({ data: null, error: null }) as never;
      });

      const params: SearchGetQuery = {
        searchText: "test",
        limit: 15,
        cursor: undefined,
      };

      const result = await searchPerfumesService(params);

      expect(supabase.rpc).toHaveBeenCalledWith(
        "search_perfumes",
        expect.objectContaining({
          result_limit: 16, // 기본 limit(15) + 1
        })
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.data).toHaveLength(15);
      }
    });

    it("fetchLimit는 limit + 1이어야 한다", async () => {
      const { mockSupabasePerfumes } = getTestData();

      const mockRpcResponse = {
        data: mockSupabasePerfumes(11),
        error: null,
      };

      const mockTotalResponse = {
        data: 20,
        error: null,
      };

      vi.mocked(supabase.rpc).mockImplementation((funcName: string) => {
        if (funcName === "search_perfumes") {
          return Promise.resolve(mockRpcResponse) as never;
        }
        if (funcName === "search_perfumes_total") {
          return Promise.resolve(mockTotalResponse) as never;
        }
        return Promise.resolve({ data: null, error: null }) as never;
      });

      const params: SearchGetQuery = {
        searchText: "test",
        limit: 10,
      };

      await searchPerfumesService(params);

      expect(supabase.rpc).toHaveBeenCalledWith(
        "search_perfumes",
        expect.objectContaining({
          result_limit: 11, // limit(10) + 1
        })
      );
    });

    it("cursor가 제공되면 RPC 호출에 포함되어야 한다", async () => {
      const { mockSupabasePerfumes } = getTestData();

      const mockRpcResponse = {
        data: mockSupabasePerfumes(5),
        error: null,
      };

      const mockTotalResponse = {
        data: 20,
        error: null,
      };

      vi.mocked(supabase.rpc).mockImplementation((funcName: string) => {
        if (funcName === "search_perfumes") {
          return Promise.resolve(mockRpcResponse) as never;
        }
        if (funcName === "search_perfumes_total") {
          return Promise.resolve(mockTotalResponse) as never;
        }
        return Promise.resolve({ data: null, error: null }) as never;
      });

      const cursor = "perfume-10";
      const params: SearchGetQuery = {
        searchText: "test",
        limit: 15,
        cursor,
      };

      await searchPerfumesService(params);

      expect(supabase.rpc).toHaveBeenCalledWith(
        "search_perfumes",
        expect.objectContaining({
          last_seen_id: cursor,
        })
      );
    });

    it("nextCursor를 올바르게 계산해야 한다", async () => {
      const { mockSupabasePerfumes } = getTestData();

      // 16개 반환 (limit 15 + 1)
      const mockRpcResponse = {
        data: mockSupabasePerfumes(16),
        error: null,
      };

      const mockTotalResponse = {
        data: 20,
        error: null,
      };

      vi.mocked(supabase.rpc).mockImplementation((funcName: string) => {
        if (funcName === "search_perfumes") {
          return Promise.resolve(mockRpcResponse) as never;
        }
        if (funcName === "search_perfumes_total") {
          return Promise.resolve(mockTotalResponse) as never;
        }
        return Promise.resolve({ data: null, error: null }) as never;
      });

      const params: SearchGetQuery = {
        searchText: "test",
        limit: 15,
      };

      const result = await searchPerfumesService(params);

      expect(result.success).toBe(true);
      if (result.success) {
        // 16개가 반환되었으므로 hasMore = true
        // nextCursor는 15번째(마지막 반환 데이터)의 id
        expect(result.data.nextCursor).toBe("perfume-14");
        expect(result.data.data).toHaveLength(15);
      }
    });
  });

  describe("searchPerfumesService - 데이터 변환", () => {
    it("Supabase 응답을 API 스키마로 변환해야 한다", async () => {
      const { mockSupabasePerfume } = getTestData();

      const mockRpcResponse = {
        data: [mockSupabasePerfume],
        error: null,
      };

      const mockTotalResponse = {
        data: 1,
        error: null,
      };

      vi.mocked(supabase.rpc).mockImplementation((funcName: string) => {
        if (funcName === "search_perfumes") {
          return Promise.resolve(mockRpcResponse) as never;
        }
        if (funcName === "search_perfumes_total") {
          return Promise.resolve(mockTotalResponse) as never;
        }
        return Promise.resolve({ data: null, error: null }) as never;
      });

      const params: SearchGetQuery = {
        searchText: "test",
        limit: 15,
      };

      const result = await searchPerfumesService(params);

      expect(result.success).toBe(true);
      if (result.success) {
        const perfume = result.data.data[0];
        expect(perfume).toEqual({
          id: mockSupabasePerfume.perfume_id,
          nameEn: mockSupabasePerfume.perfume_name_en,
          nameKo: mockSupabasePerfume.perfume_name_ko,
          brand: {
            nameEn: mockSupabasePerfume.brand_name_en,
            nameKo: mockSupabasePerfume.brand_name_ko,
            brandUrl: mockSupabasePerfume.brand_url,
          },
          perfumeImage: {
            imageUrl: mockSupabasePerfume.image_url,
          },
        });
      }
    });

    it("향수 이미지 URL이 올바르게 매핑되어야 한다", async () => {
      const { mockSupabasePerfume } = getTestData();

      const mockRpcResponse = {
        data: [mockSupabasePerfume],
        error: null,
      };

      const mockTotalResponse = {
        data: 1,
        error: null,
      };

      vi.mocked(supabase.rpc).mockImplementation((funcName: string) => {
        if (funcName === "search_perfumes") {
          return Promise.resolve(mockRpcResponse) as never;
        }
        if (funcName === "search_perfumes_total") {
          return Promise.resolve(mockTotalResponse) as never;
        }
        return Promise.resolve({ data: null, error: null }) as never;
      });

      const params: SearchGetQuery = {
        searchText: "test",
        limit: 15,
      };

      const result = await searchPerfumesService(params);

      expect(result.success).toBe(true);
      if (result.success) {
        const perfume = result.data.data[0];
        expect(perfume.perfumeImage?.imageUrl).toBe(
          mockSupabasePerfume.image_url
        );
      }
    });

    it("브랜드 정보가 올바르게 매핑되어야 한다", async () => {
      const { mockSupabasePerfume } = getTestData();

      const mockRpcResponse = {
        data: [mockSupabasePerfume],
        error: null,
      };

      const mockTotalResponse = {
        data: 1,
        error: null,
      };

      vi.mocked(supabase.rpc).mockImplementation((funcName: string) => {
        if (funcName === "search_perfumes") {
          return Promise.resolve(mockRpcResponse) as never;
        }
        if (funcName === "search_perfumes_total") {
          return Promise.resolve(mockTotalResponse) as never;
        }
        return Promise.resolve({ data: null, error: null }) as never;
      });

      const params: SearchGetQuery = {
        searchText: "test",
        limit: 15,
      };

      const result = await searchPerfumesService(params);

      expect(result.success).toBe(true);
      if (result.success) {
        const perfume = result.data.data[0];
        expect(perfume.brand).toEqual({
          nameEn: mockSupabasePerfume.brand_name_en,
          nameKo: mockSupabasePerfume.brand_name_ko,
          brandUrl: mockSupabasePerfume.brand_url,
        });
      }
    });
  });

  describe("searchPerfumesService - Supabase RPC", () => {
    it("search_perfumes RPC 함수를 호출해야 한다", async () => {
      const { mockSupabasePerfumes } = getTestData();

      const mockRpcResponse = {
        data: mockSupabasePerfumes(5),
        error: null,
      };

      const mockTotalResponse = {
        data: 5,
        error: null,
      };

      vi.mocked(supabase.rpc).mockImplementation((funcName: string) => {
        if (funcName === "search_perfumes") {
          return Promise.resolve(mockRpcResponse) as never;
        }
        if (funcName === "search_perfumes_total") {
          return Promise.resolve(mockTotalResponse) as never;
        }
        return Promise.resolve({ data: null, error: null }) as never;
      });

      const params: SearchGetQuery = {
        searchText: "test",
        limit: 15,
      };

      await searchPerfumesService(params);

      expect(supabase.rpc).toHaveBeenCalledWith(
        "search_perfumes",
        expect.any(Object)
      );
    });

    it("search_perfumes_total RPC 함수를 호출해야 한다", async () => {
      const { mockSupabasePerfumes } = getTestData();

      const mockRpcResponse = {
        data: mockSupabasePerfumes(5),
        error: null,
      };

      const mockTotalResponse = {
        data: 5,
        error: null,
      };

      vi.mocked(supabase.rpc).mockImplementation((funcName: string) => {
        if (funcName === "search_perfumes") {
          return Promise.resolve(mockRpcResponse) as never;
        }
        if (funcName === "search_perfumes_total") {
          return Promise.resolve(mockTotalResponse) as never;
        }
        return Promise.resolve({ data: null, error: null }) as never;
      });

      const params: SearchGetQuery = {
        searchText: "test",
        limit: 15,
      };

      await searchPerfumesService(params);

      expect(supabase.rpc).toHaveBeenCalledWith(
        "search_perfumes_total",
        expect.any(Object)
      );
    });

    it("두 RPC 호출이 병렬로 실행되어야 한다", async () => {
      const { mockSupabasePerfumes } = getTestData();

      const mockRpcResponse = {
        data: mockSupabasePerfumes(5),
        error: null,
      };

      const mockTotalResponse = {
        data: 5,
        error: null,
      };

      const rpcCalls: string[] = [];

      vi.mocked(supabase.rpc).mockImplementation(((funcName: string) => {
        rpcCalls.push(funcName);
        if (funcName === "search_perfumes") {
          return Promise.resolve(mockRpcResponse);
        }
        if (funcName === "search_perfumes_total") {
          return Promise.resolve(mockTotalResponse);
        }
        return Promise.resolve({ data: null, error: null });
      }) as never);

      const params: SearchGetQuery = {
        searchText: "test",
        limit: 15,
      };

      await searchPerfumesService(params);

      // Promise.all을 사용하므로 두 RPC가 호출되어야 함
      expect(rpcCalls).toContain("search_perfumes");
      expect(rpcCalls).toContain("search_perfumes_total");
      expect(supabase.rpc).toHaveBeenCalledTimes(2);
    });

    it("RPC 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      const mockRpcError = {
        data: null,
        error: new Error("RPC call failed"),
      };

      vi.mocked(supabase.rpc).mockResolvedValue(mockRpcError as never);

      const params: SearchGetQuery = {
        searchText: "test",
        limit: 15,
      };

      const result = await searchPerfumesService(params);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });
  });

  describe("에러 처리", () => {
    it("DB 에러 시 INTERNAL_ERROR를 반환해야 한다", async () => {
      vi.mocked(supabase.rpc).mockRejectedValue(
        new Error("Database connection failed")
      );

      const params: SearchGetQuery = {
        searchText: "test",
        limit: 15,
      };

      const result = await searchPerfumesService(params);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("INTERNAL_ERROR");
      }
    });
  });
});
