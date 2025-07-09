import { SearchResponse } from "@/lib/hooks/useInfinityScroll";
import {
  GetPostListParams,
  PostListItemResult,
} from "@/lib/schemas/post.schema";

const API_BASE_URL = "/api/v1";

type FetchCommunityPostListParams = Omit<GetPostListParams, "limit" | "q"> & {
  searchText?: string;
};

async function fetchCommunityPostList(
  params: FetchCommunityPostListParams
): Promise<SearchResponse<PostListItemResult>> {
  try {
    const queryParams = new URLSearchParams();

    if (params.category) {
      queryParams.append("category", params.category);
    }
    if (params.sortBy) {
      queryParams.append("sortBy", params.sortBy);
    }
    if (params.searchText) {
      queryParams.append("q", params.searchText);
    }
    if (params.cursor) {
      queryParams.append("cursor", params.cursor);
    }
    queryParams.append("limit", "12");

    const response = await fetch(
      `${API_BASE_URL}/posts?${queryParams.toString()}`,
      { method: "GET", next: { revalidate: 300 } }
    );
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: response.statusText }));
      throw new Error(
        errorData.message || `Failed to fetch data: ${response.status}`
      );
    }
    const result = await response.json();
    return {
      data: result.data,
      nextCursor: result.nextCursor,
      totalCount: result.totalCount,
    };
  } catch (error) {
    console.error("Error fetching community post list:", error);
    throw error;
  }
}

export { fetchCommunityPostList };
