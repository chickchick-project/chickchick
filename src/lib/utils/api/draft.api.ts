import { apiClient } from "./client";
import { ApiSuccessResponse } from "@/lib/hono/schemas/common.schema";
import {
  CreateDraftBody,
  ApiDraftResponse,
  ApiDraftListResponse,
} from "@/lib/hono/schemas/draft.schema";

export const DRAFT_URL = `/drafts`;

export const draftApi = {
  /**
   * 임시 저장 생성/업데이트 (Upsert)
   */
  create: (data: CreateDraftBody) => {
    return apiClient.post<
      CreateDraftBody,
      ApiSuccessResponse<ApiDraftResponse>
    >(`${DRAFT_URL}`, data);
  },

  /**
   * 임시 저장 목록 조회
   */
  list: () => {
    return apiClient.get<ApiSuccessResponse<ApiDraftListResponse>>(
      `${DRAFT_URL}`,
      undefined,
      { cache: "no-store" }
    );
  },

  /**
   * 특정 임시 저장 조회
   */
  get: (id: string) => {
    return apiClient.get<ApiSuccessResponse<ApiDraftResponse>>(
      `${DRAFT_URL}/${id}`,
      undefined,
      { cache: "no-store" }
    );
  },

  /**
   * 임시 저장 삭제
   */
  delete: (id: string) => {
    const url = `${DRAFT_URL}/${id}`;
    console.log("[draftApi.delete] DELETE 요청:", url);
    return apiClient
      .delete<ApiSuccessResponse<{ message: string }>>(url, {
        cache: "no-store", // 캐시 비활성화
      })
      .then((response) => {
        console.log("[draftApi.delete] DELETE 응답:", response);
        return response;
      })
      .catch((error) => {
        console.error("[draftApi.delete] DELETE 에러:", error);
        throw error;
      });
  },
};
