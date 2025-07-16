import { FILTER_LABELS } from "./filter/filter.constants";
import { GetPerfumeSearchResult } from "@/lib/hono/schemas/perfume.schema";
import { SearchResponse } from "@/lib/hooks/useInfinityScroll";

const API_BASE_URL = "/api/v1";

const formatFilters = (filters: Map<string, Set<string>>) => {
  const result: Record<string, string[]> = {};
  for (const [key, values] of filters.entries()) {
    if (values.size > 0) {
      result[`${key}_filter`] = Array.from(values);
    }
  }
  return result;
};

async function fetchPerfumes(
  cursor: string | null,
  searchText: string,
  filters: Map<string, Set<string>>
): Promise<SearchResponse<GetPerfumeSearchResult>> {
  try {
    let response: Response;
    const formattedFilters = formatFilters(filters);

    if (Object.keys(formattedFilters).length > 0) {
      const requestBody = {
        search_text: searchText || "",
        last_seen_id: cursor || null,
        result_limit: 15,
        ...formattedFilters,
      };
      response = await fetch(`${API_BASE_URL}/search/perfumes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
    } else {
      // 필터가 없을 경우 GET으로 처리
      const queryParams = new URLSearchParams();
      if (searchText) queryParams.append("q", searchText);
      if (cursor) queryParams.append("cursor", cursor);
      queryParams.append("limit", "15");

      response = await fetch(
        `${API_BASE_URL}/search/perfumes?${queryParams.toString()}`,
        {
          method: "GET",
          next: { revalidate: 300 },
        }
      );
    }

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "알 수 없는 에러" }));
      throw new Error(
        errorData.error || `Failed to fetch data: ${response.status}`
      );
    }

    const result = await response.json();
    return {
      data: result.data.data,
      nextCursor: result.data.nextCursor,
      totalCount: result.data.totalCount,
    };
  } catch (error) {
    console.error("fetchPerfumes 오류:", error);
    return { data: [], nextCursor: null, totalCount: 0 };
  }
}

const getLabel = (key: string) =>
  FILTER_LABELS[key as keyof typeof FILTER_LABELS] || key;

const getUniquePerfumes = (
  perfumes: GetPerfumeSearchResult[]
): GetPerfumeSearchResult[] => {
  const perfumeMap = new Map<string, GetPerfumeSearchResult>();

  perfumes.forEach((item) => {
    const existing = perfumeMap.get(item.id);
    if (!existing || existing.priority < item.priority) {
      perfumeMap.set(item.id, item);
    }
  });

  return Array.from(perfumeMap.values());
};

// const createQueryKey = (keyword: string, filters: Map<string, Set<string>>) => {
//   const searchParams = new URLSearchParams();
//   searchParams.append("q", keyword);
//   filters.forEach((values, key) => {
//     values.forEach((value) => searchParams.append(key, value));
//   });
//   return searchParams.toString();
// };

export { fetchPerfumes, getLabel, getUniquePerfumes };
