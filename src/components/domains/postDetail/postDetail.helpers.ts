import { ApiPostResponse } from "@/lib/hono/schemas/community.schema";
import { ApiSuccessResponse } from "@/lib/hono/schemas/common.schema";
import { createHttpClient } from "@/lib/utils/core-request";
import { PostCategory } from "@prisma/client";

export const API_BASE_URL = "http://localhost:3000/api/v1";
export const COMMUNITY_URL = `/community/posts`;

const apiClient = createHttpClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL,
});

export async function deletePostById(
  postId: string
): Promise<{ category: PostCategory }> {
  const result = await apiClient.delete<
    ApiSuccessResponse<{ category: PostCategory }>
  >(`${COMMUNITY_URL}/${postId}`);
  if (!result || !result.success) {
    throw new Error(result?.message || "게시글 삭제에 실패했습니다.");
  }
  return result.data;
}

export async function toggleBookmarkedPostById(
  postId: string
): Promise<ApiSuccessResponse<ApiPostResponse> | null> {
  return await apiClient.post(`${COMMUNITY_URL}/${postId}/bookmark`, {});
}

export async function toggleLikedPostById(
  postId: string
): Promise<ApiSuccessResponse<ApiPostResponse> | null> {
  return await apiClient.post(`${COMMUNITY_URL}/${postId}/like`, {});
}
