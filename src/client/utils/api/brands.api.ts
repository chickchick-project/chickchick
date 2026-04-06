import { apiClient } from "./client";
import { ApiSuccessResponse } from "@/server/hono/schemas/common.schema";
import {
  ApiBrandDetailResponse,
  ApiBrandSimpleResponse,
  Store,
} from "@/server/hono/schemas/brand.schema";

type Region = {
  x: number;
  y: number;
  address_name: string;
  region_3depth_name: string;
};

export const brandApi = {
  /**
   * 모든 브랜드 목록 조회
   */
  list: () => {
    return apiClient.get<ApiSuccessResponse<ApiBrandSimpleResponse[]>>(
      `/brands`
    );
  },
  /**
   * 특정 브랜드 상세 조회 (ID)
   */
  getById: (id: string) => {
    return apiClient.get<ApiSuccessResponse<ApiBrandDetailResponse>>(
      `/brands/${id}`
    );
  },
  /**
   * 특정 브랜드 상세 조회 (한글 이름)
   */
  getByName: (nameKo: string) => {
    return apiClient.get<ApiSuccessResponse<ApiBrandDetailResponse>>(
      `/brands/name/${encodeURIComponent(nameKo)}`
    );
  },
  /**
   * 좌표 → 지역 정보 변환
   */
  getRegion: (x: number, y: number) => {
    return apiClient.get<{ success: true; region: Region[] }>(
      `/brands/location`,
      { x, y },
    );
  },
  /**
   * 브랜드 매장 목록 조회
   */
  getStores: (brandName: string, x: number, y: number) => {
    return apiClient.get<{ success: true; stores: Store[]; total: number }>(
      `/brands/stores/${encodeURIComponent(brandName)}`,
      { x, y },
    );
  },
};
