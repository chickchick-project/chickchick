import { createCoreClient } from "./core";
import type { LibraryConfig } from "./config";

export interface BaseApiOptions {
  cache?: RequestCache;
}

export interface GetApiOptions<RawData, TransformedData>
  extends BaseApiOptions {
  skipAuth?: boolean;
  transformResponse?: (response: RawData) => TransformedData;
}

export interface MutateApiOptions<RawData, TransformedData>
  extends BaseApiOptions {
  headers?: HeadersInit;
  transformResponse?: (response: RawData) => TransformedData;
}

function objectToQueryString(params: Record<string, unknown>): string {
  return new URLSearchParams(params as Record<string, string>).toString();
}

export function createHttpClient(config: LibraryConfig) {
  const core = createCoreClient(config);

  const mergeHeaders = (
    baseHeaders: HeadersInit,
    userHeaders?: HeadersInit
  ): Headers => {
    const result = new Headers(baseHeaders);
    if (userHeaders) {
      new Headers(userHeaders).forEach((value, key) => {
        result.set(key, value);
      });
    }
    return result;
  };

  const mutate = <
    RequestData extends object,
    RawData,
    TransformedData = RawData
  >(
    method: "PUT" | "PATCH",
    path: string,
    data: RequestData,
    options?: MutateApiOptions<RawData, TransformedData>
  ) => {
    const finalUrl = `${config.baseUrl}${path}`;

    const headers = mergeHeaders(
      { "Content-Type": "application/json" },
      options?.headers
    );

    return core.request<RawData, TransformedData>({
      ...options,
      url: finalUrl,
      method,
      body: JSON.stringify(data),
      headers,
    });
  };

  const get = <RawData, TransformedData = RawData>(
    path: string,
    params?: Record<string, unknown>,
    options?: GetApiOptions<RawData, TransformedData>
  ) => {
    let finalUrl = `${config.baseUrl}${path}`;
    if (params && Object.keys(params).length > 0) {
      finalUrl += `?${objectToQueryString(params)}`;
    }
    return core.request<RawData, TransformedData>({
      ...options,
      url: finalUrl,
      method: "GET",
    });
  };

  // Overloading 정의
  function post<RawData, TransformedData = RawData>(
    path: string,
    data: FormData,
    options?: MutateApiOptions<RawData, TransformedData>
  ): Promise<TransformedData | null>;
  function post<RequestData extends object, RawData, TransformedData = RawData>(
    path: string,
    data: RequestData,
    options?: MutateApiOptions<RawData, TransformedData>
  ): Promise<TransformedData | null>;

  // Overloading 구현 코드
  function post<RequestData, RawData, TransformedData = RawData>(
    path: string,
    data: RequestData | FormData,
    options?: MutateApiOptions<RawData, TransformedData>
  ): Promise<TransformedData | null> {
    const finalUrl = `${config.baseUrl}${path}`;

    if (data instanceof FormData) {
      return core.request<RawData, TransformedData>({
        ...options,
        url: finalUrl,
        method: "POST",
        body: data,
      });
    } else {
      const headers = mergeHeaders(
        { "Content-Type": "application/json" },
        options?.headers
      );
      return core.request<RawData, TransformedData>({
        ...options,
        url: finalUrl,
        method: "POST",
        body: JSON.stringify(data),
        headers,
      });
    }
  }

  const put = <RequestData extends object, RawData, TransformedData = RawData>(
    path: string,
    data: RequestData,
    options?: MutateApiOptions<RawData, TransformedData>
  ) => {
    return mutate<RequestData, RawData, TransformedData>(
      "PUT",
      path,
      data,
      options
    );
  };

  const patch = <
    RequestData extends object,
    RawData,
    TransformedData = RawData
  >(
    path: string,
    data: RequestData,
    options?: MutateApiOptions<RawData, TransformedData>
  ) => {
    return mutate<RequestData, RawData, TransformedData>(
      "PATCH",
      path,
      data,
      options
    );
  };

  const remove = <RawData, TransformedData = RawData>(
    path: string,
    options?: MutateApiOptions<RawData, TransformedData>
  ) => {
    const finalUrl = `${config.baseUrl}${path}`;
    return core.request<RawData, TransformedData>({
      ...options,
      url: finalUrl,
      method: "DELETE",
    });
  };

  return Object.freeze({
    request: core.request,
    useRequestInterceptor: core.useRequestInterceptor,
    useResponseInterceptor: core.useResponseInterceptor,
    get,
    post,
    put,
    patch,
    delete: remove,
  });
}
