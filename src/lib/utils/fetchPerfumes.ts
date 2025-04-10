import { Perfume } from "@/app/api/search/route";
import { SearchResponse } from "../hooks/useInfinityScroll";

const formatFilters = (filters: Map<string, Set<string>>) => {
  const result: Record<string, string[]> = {};

  Array.from(filters.entries()).forEach(([key, values]) => {
    if (values.size > 0) {
      result[`${key}_filter`] = Array.from(values);
    }
  });

  return result;
};

export async function fetchPerfumes(
  cursor: string | null,
  searchText: string,
  filters: Map<string, Set<string>>
): Promise<SearchResponse<Perfume>> {
  let response;

  const formattedFilters = formatFilters(filters);
  if (filters.size > 0) {
    const requestBody = {
      search_text: searchText || "",
      last_seen_id: cursor || null,
      result_limit: 5,
      ...formattedFilters,
    };

    response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
  } else {
    //GET 요청
    const queryParams = new URLSearchParams();
    if (searchText) queryParams.append("q", searchText);
    if (cursor) queryParams.append("cursor", cursor);

    Object.entries(formattedFilters).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, v));
        } else {
          queryParams.append(key, value);
        }
      }
    });

    response = await fetch(`/api/search?${queryParams.toString()}`, {
      next: { revalidate: 300 },
    });
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status}`);
  }

  return await response.json();
}
