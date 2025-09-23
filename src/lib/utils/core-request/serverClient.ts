import { cookies } from "next/headers";
import { createHttpClient } from "./httpClient";

export const createApiServerClient = async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("next-auth.session-token")?.value;

  const apiClient = createHttpClient({
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
    headers: sessionToken ? { cookie: sessionToken } : undefined,
  });
  apiClient.useRequestInterceptor((config) => {
    const headers = new Headers(config.headers);

    const cookieString = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
    headers.set("cookie", cookieString);
    return {
      ...config,
      headers,
    };
  });
  return apiClient;
};
