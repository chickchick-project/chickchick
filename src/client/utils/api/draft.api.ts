import { apiClient } from "./client";
import { ApiSuccessResponse } from "@/server/hono/schemas/common.schema";
import {
  CreateDraftBody,
  ApiDraftResponse,
  DraftType,
} from "@/server/hono/schemas/draft.schema";

export const DRAFT_URL = `/drafts`;

export const draftApi = {
  /**
   * 임시 저장 생성/업데이트 (Upsert)
   */
  create: (data: CreateDraftBody) => {
    return apiClient.post<
      CreateDraftBody,
      ApiSuccessResponse<ApiDraftResponse>
    >(DRAFT_URL, data);
  },

  /**
   * 타입별 임시 저장 단일 조회
   */
  list: (type: DraftType) => {
    return apiClient.get<ApiSuccessResponse<ApiDraftResponse>>(
      DRAFT_URL,
      { type },
      { cache: "no-store" },
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
    return apiClient.delete<ApiSuccessResponse<{ message: string }>>(
      `${DRAFT_URL}/${id}`,
      { cache: "no-store" },
    );
  },
};
