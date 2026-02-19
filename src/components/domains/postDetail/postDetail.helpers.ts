import type { ApiPostResponse } from "@/lib/hono/schemas/community.schema";
import type { ApiSuccessResponse } from "@/lib/hono/schemas/common.schema";
import { apiClient } from "@/lib/utils/api/client";
import { PostCategory } from "@prisma/client";

export const COMMUNITY_URL = `/community/posts`;

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
