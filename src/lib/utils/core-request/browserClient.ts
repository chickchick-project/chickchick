import { createHttpClient } from "./httpClient";

export function createApiBrowserClient() {
  const api = createHttpClient({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1",
  });

  api.useRequestInterceptor((cfg) => {
    const headers = new Headers(cfg.headers);
    if (!headers.has("Accept")) headers.set("Accept", "application/json");
    return { ...cfg, credentials: "include", headers };
  });

  return api;
}
