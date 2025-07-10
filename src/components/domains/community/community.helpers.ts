import {
  SORT_MAPPING_COMMUNITY_FOR_API,
  TApiSortBy,
  TSortBy,
} from "@/lib/constants/options";
import { SearchResponse } from "@/lib/hooks/useInfinityScroll";
import {
  GetPostListParams,
  PostListItemResult,
} from "@/lib/schemas/post.schema";

const API_BASE_URL = "/api/v1";

type FetchCommunityPostListParams = {
  category?: GetPostListParams["category"];
  sortBy?: GetPostListParams["sortBy"];
  searchText?: string;
  cursor?: string | null;
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

const getUniquePostList = (postList: PostListItemResult[]) => {
  const postMap = new Map<string, PostListItemResult>();
  postList.forEach((post) => {
    if (!postMap.has(post.id)) {
      postMap.set(post.id, post);
    }
  });
  return Array.from(postMap.values());
};

const getApiSortBy = (tab: string, sortFromUrl: TSortBy | null): TApiSortBy => {
  if (tab === "BEST") {
    return "popular";
  }
  return (
    (sortFromUrl && SORT_MAPPING_COMMUNITY_FOR_API[sortFromUrl]) || "createdAt"
  );
};

export { fetchCommunityPostList, getUniquePostList, getApiSortBy };
