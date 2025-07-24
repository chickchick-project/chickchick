import { PerfumeBaseResponse } from "@/lib/hono/schemas/perfume.schema";
import { FILTER_LABELS } from "./filter/filter.constants";
import { SearchResponse } from "@/lib/hooks/useInfinityScroll";

const API_BASE_URL = "/api/v1";

// 필터를 서버 스키마에 맞게 변환
const formatFilters = (filters: Map<string, Set<string>>) => {
  const result: {
    brandFilter?: string[];
    notesFilter?: string[];
    accordsFilter?: string[];
  } = {};

  for (const [key, values] of filters.entries()) {
    if (values.size > 0) {
      const valueArray = Array.from(values);

      // 키 이름을 서버 스키마에 맞게 매핑
      switch (key) {
        case "brand":
          result.brandFilter = valueArray;
          break;
        case "notes":
          result.notesFilter = valueArray;
          break;
        case "accords":
          result.accordsFilter = valueArray;
          break;
        default:
          console.warn(`알 수 없는 필터 키: ${key}`);
          break;
      }
    }
  }

  return result;
};

async function fetchPerfumes(
  cursor: string | null,
  searchText: string,
  filters: Map<string, Set<string>>
): Promise<SearchResponse<PerfumeBaseResponse>> {
  try {
    let response: Response;
    const formattedFilters = formatFilters(filters);
    const hasFilters = Object.keys(formattedFilters).length > 0;

    if (hasFilters) {
      // 필터가 있을 경우 POST 요청
      const requestBody = {
        searchText: searchText || "",
        cursor: cursor || undefined,
        limit: 15,
        ...formattedFilters,
      };

      response = await fetch(`${API_BASE_URL}/search/perfumes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
    } else {
      // 필터가 없을 경우 GET 요청
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

    return {
      data: result.data.data || [],
      nextCursor: result.data.nextCursor || null,
      totalCount: result.data.totalCount || 0,
    };
  } catch (error) {
    console.error("fetchPerfumes 오류:", error);
    return { data: [], nextCursor: null, totalCount: 0 };
  }
}

const getLabel = (key: string) =>
  FILTER_LABELS[key as keyof typeof FILTER_LABELS] || key;

const getUniquePerfumes = (
  perfumes: PerfumeBaseResponse[]
): PerfumeBaseResponse[] => {
  const perfumeMap = new Map<string, PerfumeBaseResponse>();

  perfumes.forEach((item) => {
    const existing = perfumeMap.get(item.id);
    if (!existing) {
      perfumeMap.set(item.id, item);
    }
  });

  return Array.from(perfumeMap.values());
};

export { fetchPerfumes, getLabel, getUniquePerfumes };
