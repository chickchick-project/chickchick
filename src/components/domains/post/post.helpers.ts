import {
  CreatePostInput,
  ApiPostResponse,
  UpdatePostInput,
} from "@/lib/hono/schemas/community.schema";
import { API_BASE_URL, COMMUNITY_URL } from "../postDetail/postDetail.helpers";
import { ApiSuccessResponse } from "@/lib/hono/utils/response.constants";
import { ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";
import { createHttpClient } from "@/lib/utils/core-request";

const apiClient = createHttpClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL,
});

export async function submitNewPost(
  postFormData: CreatePostInput
): Promise<ApiSuccessResponse<ApiPostResponse>> {
  const response = await fetch(`${COMMUNITY_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postFormData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `API Error: ${response.status}`);
  }

  return data;
}

export async function searchPerfumesByName(
  searchText: string
): Promise<ApiSuccessResponse<ApiPerfumeSimpleResponse[]>> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("q", searchText);
    queryParams.append("limit", "50");
    const response = await fetch(
      `${API_BASE_URL}/search/perfumes?${queryParams.toString()}`
    );
    if (!response.ok) {
      throw new Error("향수 검색에 실패했습니다.");
    }

    const result = await response.json();

    return result.data;
  } catch (error) {
    console.error("searchPerfumesByName 오류:", error);
    throw error;
  }
}

export async function editPostById(
  postId: string,
  postFormData: UpdatePostInput
): Promise<ApiPostResponse | null> {
  return await apiClient.patch(`/community/posts/${postId}`, postFormData);
}
