import { useState, useEffect } from "react";
import { collectionApi } from "@/lib/utils/api/collections.api";
import { ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";

const initialState = { data: [] as ApiPerfumeSimpleResponse[] };

export function useSearchTag(query: string) {
  const [results, setResults] = useState(initialState);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let isActive = true;
    if (query.trim().length < 2) {
      setResults(initialState);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(async () => {
      try {
        const response = await collectionApi.searchPerfumes(query);
        if (isActive) {
          setResults({ data: response.data });
        }
      } catch (error) {
        console.error("검색 실패:", error);
        if (isActive) {
          setResults(initialState);
        }
      } finally {
        if (isActive) {
          setIsSearching(false);
        }
      }
    }, 500);

    return () => {
      clearTimeout(handler);
      isActive = false;
    };
  }, [query]);

  return { results, isSearching };
}
