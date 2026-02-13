import { useState, useEffect } from "react";
import { useCollectionPerfumeSearch } from "@/lib/hooks/query/useCollectionQuery";
import type { ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";

const initialState = { data: [] as ApiPerfumeSimpleResponse[] };

export function useSearchTag(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState(initialState);

  useEffect(() => {
    if (query.trim().length < 2) {
      setDebouncedQuery("");
      setResults(initialState);
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const { data, isLoading } = useCollectionPerfumeSearch(debouncedQuery);

  useEffect(() => {
    if (data?.data) {
      setResults({ data: data.data });
    } else if (!debouncedQuery) {
      setResults(initialState);
    }
  }, [data, debouncedQuery]);

  return { results, isSearching: isLoading };
}
