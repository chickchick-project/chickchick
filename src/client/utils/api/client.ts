function getBaseUrl() {
  if (typeof window !== "undefined") return "/api/v1";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api/v1`;
  return "http://localhost:3000/api/v1";
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || getBaseUrl();
export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errorData?: unknown,
  ) {
    super(message);
    this.name = "APIError";
  }
}

function objectToQueryString(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null,
  );
  return new URLSearchParams(
    Object.fromEntries(entries) as Record<string, string>,
  ).toString();
}

async function fetchApi<T>(url: string, init?: RequestInit): Promise<T | null> {
  const { cache, ...restInit } = init ?? {};
  const response = await fetch(url, {
    cache: cache ?? "no-store",
    ...restInit,
  });

  if (!response.ok) {
    let errorData: { message?: string } = {};
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText || "Unknown error" };
    }
    throw new APIError(
      response.status,
      errorData.message ?? "Unknown error",
      errorData,
    );
  }

  if (response.status === 204) return null;

  return response.json() as Promise<T>;
}

/**
 * 중앙 API 클라이언트
 * 모든 API 요청에서 공유하는 단일 인스턴스
 */
export const apiClient = {
  get<T>(
    path: string,
    params?: Record<string, unknown>,
    options?: { cache?: RequestCache; headers?: HeadersInit },
  ): Promise<T | null> {
    let url = `${BASE_URL}${path}`;
    if (params && Object.keys(params).length > 0) {
      url += `?${objectToQueryString(params)}`;
    }
    return fetchApi<T>(url, {
      method: "GET",
      cache: options?.cache,
      headers: options?.headers,
    });
  },

  post<_RequestData, ResponseData = _RequestData>(
    path: string,
    data: FormData | object,
    options?: { headers?: HeadersInit; cache?: RequestCache },
  ): Promise<ResponseData | null> {
    const url = `${BASE_URL}${path}`;
    if (data instanceof FormData) {
      return fetchApi<ResponseData>(url, {
        method: "POST",
        body: data,
        headers: options?.headers,
        cache: options?.cache,
      });
    }
    const headers = new Headers({ "Content-Type": "application/json" });
    if (options?.headers) {
      new Headers(options.headers).forEach((value, key) =>
        headers.set(key, value),
      );
    }
    return fetchApi<ResponseData>(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers,
      cache: options?.cache,
    });
  },

  patch<_RequestData, ResponseData = _RequestData>(
    path: string,
    data: _RequestData,
    options?: { headers?: HeadersInit },
  ): Promise<ResponseData | null> {
    const url = `${BASE_URL}${path}`;
    const headers = new Headers({ "Content-Type": "application/json" });
    if (options?.headers) {
      new Headers(options.headers).forEach((value, key) =>
        headers.set(key, value),
      );
    }
    return fetchApi<ResponseData>(url, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers,
    });
  },

  put<_RequestData, ResponseData = _RequestData>(
    path: string,
    data: _RequestData,
    options?: { headers?: HeadersInit },
  ): Promise<ResponseData | null> {
    const url = `${BASE_URL}${path}`;
    const headers = new Headers({ "Content-Type": "application/json" });
    if (options?.headers) {
      new Headers(options.headers).forEach((value, key) =>
        headers.set(key, value),
      );
    }
    return fetchApi<ResponseData>(url, {
      method: "PUT",
      body: JSON.stringify(data),
      headers,
    });
  },

  delete<T>(
    path: string,
    options?: { cache?: RequestCache; headers?: HeadersInit },
  ): Promise<T | null> {
    const url = `${BASE_URL}${path}`;
    return fetchApi<T>(url, {
      method: "DELETE",
      cache: options?.cache,
      headers: options?.headers,
    });
  },
};
