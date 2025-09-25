import {
  PostDetailResponse,
  PostResponse,
  PostStatusResponse,
} from "@/lib/hono/schemas/community.schema";
import { ApiSuccessResponse } from "@/lib/hono/utils/response.constants";

export const API_BASE_URL = "http://localhost:3000/api/v1";
export const COMMUNITY_URL = `${API_BASE_URL}/community/posts`;

export async function getPostDetailById(
  postId: string,
  headers?: HeadersInit
): Promise<PostDetailResponse> {
  try {
    const response = await fetch(`${COMMUNITY_URL}/${postId}`, {
      method: "GET",
      ...(headers && { headers }),
    });

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
    return result.data;
  } catch (error) {
    console.error(`Error fetching post ${postId}:`, error);
    throw error;
  }
}

export async function getPostDetailStatusById(
  postId: string,
  headers?: HeadersInit
): Promise<PostStatusResponse> {
  try {
    const response = await fetch(`${COMMUNITY_URL}/${postId}/status`, {
      method: "GET",
      cache: "no-store",
      ...(headers && { headers }),
    });

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

    return result.data;
  } catch (error) {
    console.error("Error fetching post status:", error);
    throw error;
  }
}

export async function deletePostById(
  postId: string
): Promise<ApiSuccessResponse<PostResponse>> {
  try {
    const response = await fetch(`${COMMUNITY_URL}/${postId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "게시글 삭제에 실패했습니다.");
    }

    return response.json();
  } catch (error) {
    console.error("게시글 삭제 API 호출 실패:", error);
    throw error;
  }
}

export async function toggleBookmarkedPostById(
  postId: string
): Promise<ApiSuccessResponse<PostResponse>> {
  try {
    const response = await fetch(`${COMMUNITY_URL}/${postId}/bookmark`, {
      method: "POST",
    });
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
    console.error("Error fetching bookmarked posts:", error);
    throw error;
  }
}

export async function toggleLikedPostById(
  postId: string
): Promise<ApiSuccessResponse<PostResponse>> {
  try {
    const response = await fetch(`${COMMUNITY_URL}/${postId}/like`, {
      method: "POST",
      cache: "no-store",
    });

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
    console.error("Error fetching liked posts:", error);
    throw error;
  }
}
