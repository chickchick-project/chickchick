import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient, APIError } from "../client";

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
  mockFetch.mockReset();
});

describe("apiClient - cache 옵션", () => {
  it("cache 옵션을 지정하지 않으면 no-store를 기본값으로 사용한다", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    await apiClient.get("/test");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ cache: "no-store" })
    );
  });

  it("cache 옵션을 지정하면 기본값 no-store보다 우선한다", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    await apiClient.get("/test", undefined, { cache: "force-cache" });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ cache: "force-cache" })
    );
  });
});

describe("apiClient - 에러 처리", () => {
  it("응답이 ok가 아니면 APIError를 던진다", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({ message: "Resource not found" }),
    });

    await expect(apiClient.get("/test")).rejects.toThrow(APIError);
  });

  it("APIError에 status와 message가 포함된다", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({ message: "서버 오류" }),
    });

    await expect(apiClient.get("/test")).rejects.toMatchObject({
      status: 500,
      message: "서버 오류",
    });
  });

  it("204 응답은 null을 반환한다", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 204,
      json: async () => null,
    });

    const result = await apiClient.get("/test");
    expect(result).toBeNull();
  });
});
