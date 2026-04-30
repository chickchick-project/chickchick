import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchApi } from "../search.api";

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
  mockFetch.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("searchApi.fetchPerfumes - 에러 처리", () => {
  it("fetch 실패 시 에러를 다시 던진다", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({ message: "서버 오류" }),
    });

    await expect(
      searchApi.fetchPerfumes(null, "샤넬", {})
    ).rejects.toThrow();
  });

  it("fetch 실패 시 console.error를 호출하지 않는다", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({ message: "서버 오류" }),
    });

    await expect(
      searchApi.fetchPerfumes(null, "샤넬", {})
    ).rejects.toThrow();

    expect(console.error).not.toHaveBeenCalled();
  });
});

describe("searchApi.fetchPerfumes - 필터 분기", () => {
  const successResponse = {
    success: true,
    data: { data: [], totalCount: 0, nextCursor: null },
  };

  it("필터가 없으면 GET 요청(perfumes)을 사용한다", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => successResponse,
    });

    await searchApi.fetchPerfumes(null, "샤넬", {});

    const [url, init] = mockFetch.mock.calls[0];
    expect(init.method).toBe("GET");
    expect(url).toContain("/search/perfumes");
  });

  it("필터가 있으면 POST 요청(perfumesWithFilters)을 사용한다", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => successResponse,
    });

    const brandId = "123e4567-e89b-12d3-a456-426614174000";
    await searchApi.fetchPerfumes(null, "샤넬", { brand: [brandId] });

    const [, init] = mockFetch.mock.calls[0];
    expect(init.method).toBe("POST");
  });

  it("gender 필터는 genderSort로 변환되어 GET 쿼리 파라미터로 전달된다", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => successResponse,
    });

    await searchApi.fetchPerfumes(null, "", { gender: ["FEMININE"] });

    // gender만 있으면 filterParams가 비어 GET 요청 사용
    const [url, init] = mockFetch.mock.calls[0];
    expect(init.method).toBe("GET");
    expect(url).toContain("genderSort=FEMININE");
  });

  it("유효하지 않은 gender 값은 무시된다", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => successResponse,
    });

    await searchApi.fetchPerfumes(null, "", { gender: ["INVALID"] });

    const [, init] = mockFetch.mock.calls[0];
    expect(init.method).toBe("GET");
    expect(init.body).toBeUndefined();
  });
});
