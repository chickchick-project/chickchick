import { createHttpClient } from "@/client/utils/core-request";

/**
 * 중앙 API 클라이언트
 * 모든 API 요청에서 공유하는 단일 인스턴스
 */
export const apiClient = createHttpClient({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
});
