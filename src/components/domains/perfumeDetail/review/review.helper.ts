import type {
  ApiReviewResponse,
  CreateReviewInput,
} from "@/lib/hono/schemas/review.schema";
import { ReviewCategory } from "./review.type";
import { ATTRIBUTE_ID_TO_CATEGORY_MAP } from "./review.constants";
import { createHttpClient } from "@/lib/utils/core-request";
import { REVIEW_CONFIG, REVIEW_UI_DETAILS } from "./review.config";

interface RawApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const apiClient = createHttpClient({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
});

export function getCategoryById(id: number): ReviewCategory | undefined {
  return ATTRIBUTE_ID_TO_CATEGORY_MAP[id];
}

export async function getReviewData(id: string): Promise<ApiReviewResponse[]> {
  try {
    const res = await apiClient.get<RawApiResponse<ApiReviewResponse[]>>(
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
    await apiClient.post<RawApiResponse<ApiReviewResponse>>(
      `/reviews/${id}`,
      formData
    );
  } catch (error) {
    console.error("Error in fetchReviewData:", error);
    return {};
  }
}

export function getLabelByKey(category: ReviewCategory, key: string) {
  const option = REVIEW_CONFIG[category];
  if (!option) return key;
  const found = option.options.find((item) => item.key === key);
  return found ? found.label : key;
}

export function getTagByKey(category: ReviewCategory, key: string): string {
  const uiDetailsForCategory = REVIEW_UI_DETAILS[category];

  if (!uiDetailsForCategory) {
    return getLabelByKey(category, key);
  }
  const detailsObject = uiDetailsForCategory as Record<
    string,
    { tag?: string }
  >;

  const details = detailsObject[key];

  return details?.tag || getLabelByKey(category, key);
}
