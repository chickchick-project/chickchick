"use client";

import { ChangeEvent, useState, useCallback, useMemo, FormEvent } from "react";
import { Perfume } from "../api/search/route";
import { useInfiniteScroll } from "@/lib/hooks/useInfinityScroll";
import { fetchPerfumes } from "@/lib/utils/fetchPerfumes";
import { withCache } from "@/lib/utils/withCache";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import { SearchBar } from "@/components/commons/search/SearchBar";
import { PerfumeCard } from "@/components/commons/perfumeCard";
import PurFumeFilter from "@/components/domains/perfumes/filter";
import SortDropdown from "@/components/commons/dropdown/SortDropdown";
import Link from "next/link";

export default function SearchPage() {
  const [inputValue, setInputValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const { filters } = useFilterStore();

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

  const { data, isLoading, moreRef, hasMore, error, refetch } =
    useInfiniteScroll<Perfume>(cachedFetchPerfumes, query);

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
      <header className="w-full">
        <div className="flex flex-col items-center max-w-[1200px] mx-auto my-10">
          <SearchBar
            value={inputValue}
            onChange={handleChange}
            onClick={handleSubmit}
          />
          <nav className="w-full mt-7">
            <div className="flex justify-between">
              <PurFumeFilter />
            </div>
          </nav>
        </div>
      </header>

      <section className="w-full max-w-[1200px] px-4">
        <div className="w-full flex justify-between items-center mb-5">
          <span className="text-headline-2 font-semibold">
            {searchKeyword
              ? `'${searchKeyword}'에 대한 검색 결과`
              : "현재 인기있는 향수들이에요!"}
          </span>
          <SortDropdown />
        </div>

        {error && (
          <div className="w-full p-4 bg-red-50 text-red-500 rounded mb-5">
            검색 결과를 불러오는데 실패했습니다. 다시 시도해주세요.
            <button onClick={refetch} className="ml-2 text-blue-500 underline">
              다시 시도
            </button>
          </div>
        )}

        <main className="mt-10 px-4">
          <h3 className="text-headline-3 font-semibold">향수</h3>

          {data.length === 0 && !isLoading ? (
            <div className="flex justify-center items-center h-40">
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-x-[52px] gap-y-10 mt-5">
              {uniquePerfumes.map((item) => (
                <Link
                  key={item.perfume_id}
                  href={`/perfumes/${item.perfume_id}`}
                >
                  <PerfumeCard
                    perfumeImage={item.image_url}
                    brandName={item.brand_name.en}
                    perfumeName={item.perfume_name.en}
                  />
                </Link>
              ))}
            </div>
          )}

          {/* 로딩 및 더 보기 표시 */}
          <div ref={moreRef} className="py-10 text-center">
            {isLoading && <p className="text-gray-500">불러오는 중...</p>}
            {!hasMore && data.length > 0 && (
              <p className="text-gray-500">모든 결과를 확인했습니다.</p>
            )}
          </div>
        </main>
      </section>
    </div>
  );
}
