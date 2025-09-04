import type { LibraryConfig } from "./config";
import { manageTokenRefresh } from "./token";

// --- 타입 정의 ---
export interface CustomRequestInit extends RequestInit {
  skipAuth?: boolean;
}

type RequestInterceptor = (
  config: CustomRequestInit
) => Promise<CustomRequestInit> | CustomRequestInit;
type ResponseInterceptor = (response: Response) => Promise<Response> | Response;

export interface RequestOptions<ResponseData, TransformedData>
  extends CustomRequestInit {
  url: string;
  isRetry?: boolean;
  transformResponse?: (response: ResponseData) => TransformedData;
}

// --- 커스텀 에러 클래스 ---
export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errorData?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }
}

// --- HttpClient 팩토리 함수 ---
export function createCoreClient(config: LibraryConfig) {
  const requestInterceptors: RequestInterceptor[] = [];
  const responseInterceptors: ResponseInterceptor[] = [];

  // 요청 인터셉터 함수
  const useRequestInterceptor = (interceptor: RequestInterceptor) => {
    requestInterceptors.push(interceptor);
  };

  // 응답 인터셉터 함수
  const useResponseInterceptor = (interceptor: ResponseInterceptor) => {
    responseInterceptors.push(interceptor);
  };

  // HTTP 요청을 수행하는 함수
  const request = async <RawData, TransformedData = RawData>(
    originalOptions: RequestOptions<RawData, TransformedData>
  ): Promise<TransformedData | null> => {
    const { url, transformResponse, ...options } = originalOptions;

    let reqConfig: CustomRequestInit = { ...options };
    for (const interceptor of requestInterceptors) {
      reqConfig = await interceptor(reqConfig);
    }

    const headers = new Headers(reqConfig.headers);

    if (config.debug) {
      console.log(`[Request] Calling fetch for URL: ${url}`);
      try {
        console.log(
          `[Request] Fetch options:`,
          JSON.stringify(reqConfig, null, 2)
        );
      } catch {
        console.log(`[Request] Fetch options:`, reqConfig);
      }
    }

    let response = await fetch(url, { ...reqConfig, headers });

    if (response.status === 401 && !options.isRetry && config.refreshToken) {
      await manageTokenRefresh(config.refreshToken);
      return await request({ ...originalOptions, isRetry: true });
    }

    for (const interceptor of responseInterceptors) {
      response = await interceptor(response);
    }

    // 응답 상태 체크
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText || "Unknown error" };
      }
      throw new APIError(response.status, errorData.message, errorData);
    }

    if (response.status === 204) return null;

    const data = (await response.json()) as RawData;

    if (transformResponse) {
      return transformResponse(data);
    }

    return data as unknown as TransformedData;
  };

  return {
    useRequestInterceptor,
    useResponseInterceptor,
    request,
  };
}
