"use client";

import { ChangeEvent, useState, useCallback, useMemo, FormEvent } from "react";
import Image from "next/image";
import { useInfiniteScroll } from "@/lib/hooks/useInfinityScroll";
import { Perfume } from "../api/search/route";
import { SearchBar } from "@/components/commons/search/SearchBar";
import { fetchPerfumes } from "@/lib/utils/fetchPerfumes";
import { useFilters } from "@/lib/hooks/useFilters";

// 필터 옵션 정의(Mock)
const FILTER_OPTIONS = {
  gender: [
    { label: "남성", value: "male" },
    { label: "여성", value: "female" },
  ],
  brand: [
    { label: "Dior", value: "2c88f47d-47b5-4127-bcce-c54400b52dd4" },
    {
      label: "Frederic Malle",
      value: "608b9ece-7c4c-487b-bfe8-5646ec35fc98",
    },
  ],
  notes: [
    { label: "Vanilla", value: "vanilla" },
    { label: "Lemon", value: "Lemon" },
  ],
};

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
  const { filters, handleFilterChange, resetFilters } = useFilters();

  const adaptedFetchPerfumes = async (
    cursor: string | null,
    queryStr: string
  ) => {
    try {
      const params = new URLSearchParams(queryStr);
      const searchText = params.get("q") || "";

      const newFilters = new Map<string, Set<string>>();

      params.forEach((value, key) => {
        if (key !== "q" && key !== "cursor") {
          if (!newFilters.has(key)) {
            newFilters.set(key, new Set());
          }
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
  };

  // 검색 제출 핸들러
  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    setSubmittedSearchTerm(searchTerm);
  };

  // 검색어 변경 핸들러
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 검색 파라미터 생성 (메모이제이션)
  const query = useMemo(() => {
    const searchParams = new URLSearchParams();
    searchParams.append("q", submittedSearchTerm);

    filters.forEach((values, key) => {
      if (values.size > 0) {
        values.forEach((value) => searchParams.append(key, value));
      }
    });

    return searchParams.toString();
  }, [submittedSearchTerm, filters]);

  // 무한 스크롤 훅 사용
  const { data, isLoading, moreRef, hasMore, error, refetch } =
    useInfiniteScroll<Perfume>(adaptedFetchPerfumes, query);

  // 🔹 중복된 perfume_id 제거 로직 추가
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

  // 필터 스타일 계산
  const getFilterStyle = useCallback(
    (key: string, value: string) => {
      return filters.get(key)?.has(value)
        ? "bg-gray-200 font-bold"
        : "bg-white";
    },
    [filters]
  );

  return (
    <div className="flex flex-col items-center">
      <header className="w-full">
        <div className="flex flex-col items-center max-w-[1200px] mx-auto my-10">
          <SearchBar
            value={searchTerm}
            onChange={handleChange}
            onClick={handleSubmit}
          />
          <nav className="w-full mt-7">
            <div className="flex justify-between">
              <div className="flex gap-5">
                {/* 필터 버튼 렌더링 */}
                {Object.entries(FILTER_OPTIONS).map(([category, options]) => (
                  <div key={category} className="flex gap-2">
                    {options.map((option) => (
                      <button
                        key={`${category}-${option.value}`}
                        type="button"
                        onClick={() =>
                          handleFilterChange(category, option.value)
                        }
                        className={`px-3 py-1 rounded ${getFilterStyle(
                          category,
                          option.value
                        )}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="px-3 py-1 rounded border"
              >
                필터 초기화
              </button>
            </div>
          </nav>
        </div>
      </header>

      <section className="w-full max-w-[1200px] px-4">
        <div className="w-full flex justify-between items-center mb-5">
          <span className="text-headline-2 font-semibold">
            {submittedSearchTerm
              ? `'${submittedSearchTerm}'에 대한 검색 결과`
              : "현재 인기있는 향수들이에요!"}
          </span>
          <button className="px-3 py-1 rounded border">베스트</button>
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
                <figure
                  key={item.perfume_id}
                  className="flex flex-col overflow-hidden rounded w-full max-w-[180px] mx-auto"
                >
                  <div className="relative w-full aspect-square shadow-md">
                    <Image
                      src={item.image_url}
                      alt={item.perfume_name.en}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width:1200px) 50vw, 33vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <figcaption className="w-full text-left mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      {item.brand_name.en}
                    </p>
                    <p className="font-medium">{item.perfume_name.en}</p>
                  </figcaption>
                </figure>
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
