import { createHttpClient } from "./httpClient";

export const apiClient = createHttpClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  tokenProvider: () => localStorage.getItem("accessToken"),
  refreshToken: async () => {
    // try {
    //   // 1. 재발급 API 호출
    //   const response = await fetch("/api/refresh", { method: "POST" });
    //   const { newAccessToken } = await response.json();
    //   // 2. 새로운 토큰 저장
    //   localStorage.setItem("accessToken", newAccessToken);
    // } catch (error) {
    //   // 재발급 실패 시 로그인 페이지로 리디렉션 등
    //   console.error("Failed to refresh token:", error);
    //   window.location.href = "/login";
    // }
  },
});
