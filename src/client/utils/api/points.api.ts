import { apiClient } from "./client";
import { ApiResponse } from "@/server/hono/schemas/common.schema";
import {
  ApiPointHistoryResponse,
  ApiUserPointsResponse,
  ApiPointStatisticsResponse,
  ApiProcessLoginRequest,
  ApiProcessLoginResponse,
  GetPointHistoryQuery,
} from "@/server/hono/schemas/point.schema";

/**
 * 포인트 관련 API 클라이언트
 */
export const pointApi = {
  /**
   * 사용자 포인트 정보 조회
   */
  get: () => {
    return apiClient.get<ApiResponse<ApiUserPointsResponse>>(`/points`);
  },

  /**
   * 포인트 이력 조회 (커서 기반 페이지네이션)
   */
  history: (params?: GetPointHistoryQuery) => {
    return apiClient.get<ApiResponse<ApiPointHistoryResponse>>(
      `/points/history`,
      params
    );
  },

  /**
   * 포인트 통계 조회
   */
  statistics: () => {
    return apiClient.get<ApiResponse<ApiPointStatisticsResponse>>(
      `/points/statistics`
    );
  },

  /**
   * 연속 로그인 처리
   * 하루에 한 번만 호출되며, 중복 호출 시 "오늘 이미 로그인했습니다" 메시지 반환
   */
  processLogin: () => {
    const requestData: ApiProcessLoginRequest = {
      timestamp: new Date().toISOString(),
    };
    return apiClient.post<
      ApiProcessLoginRequest,
      ApiResponse<ApiProcessLoginResponse>
    >(`/points/login`, requestData);
  },
};
