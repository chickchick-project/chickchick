"use client";

import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from "react";

import { brands, perfume_accords, perfume_notes } from "@prisma/client";

import { Perfume } from "@/app/api/search/route";
import SortDropdown from "@/components/commons/dropdown/SortDropdown";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import { useInfiniteScroll } from "@/lib/hooks/useInfinityScroll";
import { fetchPerfumes } from "@/lib/utils/fetchPerfumes";
import { withCache } from "@/lib/utils/withCache";

import { PerfumeSection } from "./section";
import { SearchHeader } from "./search";

export default function PageClient({
  brands,
  notes,
  accords,
}: {
  brands: brands[];
  notes: perfume_notes[];
  accords: perfume_accords[];
}) {
  const memoizedBrands = useMemo(() => brands, [brands]);
  const memoizedNotes = useMemo(() => notes, [notes]);
  const memoizeAccords = useMemo(() => accords, [accords]);

  const [inputValue, setInputValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const filters = useFilterStore((state) => state.filters);

  const adaptedFetchPerfumes = useCallback(
    async (cursor: string | null, queryStr: string) => {
      try {
        const params = new URLSearchParams(queryStr);
        const searchText = params.get("q") || "";

        const newFilters = new Map<string, Set<string>>();

        params.forEach((value, key) => {
          if (key !== "q" && key !== "cursor") {
            if (!newFilters.has(key)) newFilters.set(key, new Set());
            newFilters.get(key)!.add(value);
          }
        });

        const result = await fetchPerfumes(cursor, searchText, newFilters);

        return {
          data: result.data || [],
          nextCursor: result.nextCursor
            ? { last_seen_id: result.nextCursor.last_seen_id }
            : null,
        };
      } catch (error) {
        console.error("adaptedFetchPerfumes 오류:", error);
        return { data: [], nextCursor: null };
      }
    },
    []
  );

  // 검색 제출 핸들러
  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    setSearchKeyword(inputValue);
  };

  // 검색어 변경 핸들러
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // 검색 파라미터 생성 (메모이제이션)
  const query = useMemo(() => {
    const searchParams = new URLSearchParams();
    searchParams.append("q", searchKeyword);

    filters.forEach((values, key) => {
      if (values.size > 0) {
        values.forEach((value) => searchParams.append(key, value));
      }
    });

    return searchParams.toString();
  }, [searchKeyword, filters]);

  // 무한 스크롤 훅 사용
  const cachedFetchPerfumes = useMemo(
    () => withCache(adaptedFetchPerfumes),
    [adaptedFetchPerfumes]
  );

  const { data, isLoading, moreRef, isIdle } = useInfiniteScroll<Perfume>(
    cachedFetchPerfumes,
    query
  );

  const uniquePerfumes = useMemo(() => {
    const perfumeMap = new Map<string, Perfume>();

    data.forEach((item) => {
      if (
        !perfumeMap.has(item.perfume_id) ||
        perfumeMap.get(item.perfume_id)!.priority < item.priority
      ) {
        perfumeMap.set(item.perfume_id, item);
      }
    });

    return Array.from(perfumeMap.values());
  }, [data]);

  return (
    <div className="flex flex-col items-center">
      <SearchHeader
        inputValue={inputValue}
        onChange={handleChange}
        onSubmit={handleSubmit}
        brands={memoizedBrands}
        notes={memoizedNotes}
        accords={memoizeAccords}
      />

      <section className="w-full max-w-[1200px] px-4">
        <div className="w-full flex justify-between items-center mb-5">
          <span className="text-headline-2 font-semibold">
            {searchKeyword
              ? `'${searchKeyword}'에 대한 검색 결과`
              : "현재 인기있는 향수들이에요!"}
          </span>
          <SortDropdown />
        </div>

        <PerfumeSection
          perfumes={uniquePerfumes}
          isLoading={isLoading}
          isIdle={isIdle}
          moreRef={moreRef}
        />
      </section>
    </div>
  );
}
