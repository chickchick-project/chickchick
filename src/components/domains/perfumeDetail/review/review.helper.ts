import type {
  ApiReviewResponse,
  CreateReviewInput,
} from "@/lib/hono/schemas/review.schema";
import { createHttpClient } from "@/lib/utils/core-request";
import { ApiSuccessResponse } from "@/lib/hono/schemas/common.schema";

const apiClient = createHttpClient({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
});

export async function getReviewData(id: string): Promise<ApiReviewResponse[]> {
  try {
    const res = await apiClient.get<ApiSuccessResponse<ApiReviewResponse[]>>(
      `/reviews/${id}`
    );
    if (!res) return [];
    return res.data;
  } catch (error) {
    console.error("Error in getReviewData:", error);
    return [];
  }
}

export async function fetchReviewData(id: string, payload: CreateReviewInput) {
  try {
    const formData = new FormData();

    formData.append("content", payload.content);
    formData.append("usageStatus", payload.usageStatus);

    if (payload.attributes) {
      Object.entries(payload.attributes).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(`attributes.${key}`, item));
        } else if (value !== undefined) {
          formData.append(`attributes.${key}`, value);
        }
      });
    }
    await apiClient.post<ApiSuccessResponse<ApiReviewResponse>>(
      `/reviews/${id}`,
      formData
    );
  } catch (error) {
    console.error("Error in fetchReviewData:", error);
    return {};
  }
}
