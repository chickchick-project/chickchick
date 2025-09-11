import {
  CommentResponse,
  CreateCommentBody,
} from "@/lib/hono/schemas/comment.schema";
import { ApiSuccessResponse } from "@/lib/hono/utils/response.constants";
import { SearchResponse } from "@/lib/hooks/useInfinityScroll";

const API_BASE_URL = "http://localhost:3000/api/v1";

export async function createNewComment(
  postId: string,
  commentData: CreateCommentBody
): Promise<ApiSuccessResponse<CommentResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    });
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: response.statusText }));
      throw new Error(
        errorData.message || `Failed to fetch data: ${response.status}`
      );
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating new comment:", error);
    throw error;
  }
}

export async function getCommentsByPostId(
  postId: string,
  cursor?: string | null
): Promise<ApiSuccessResponse<SearchResponse<CommentResponse>>> {
  try {
    const queryParams = new URLSearchParams();
    if (cursor) {
      queryParams.append("cursor", cursor);
    }
    queryParams.append("limit", "7");
    const response = await fetch(
      `${API_BASE_URL}/comments/${postId}/cursor?${queryParams.toString()}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error("서버 응답 오류:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = {
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      throw new Error(
        errorData.error || `Failed to fetch data: ${response.status}`
      );
    }
    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
}
