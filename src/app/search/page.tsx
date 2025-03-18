"use client";

import { useInfiniteScroll } from "@/lib/hooks/useInfinityScroll";
import { Perfume, SearchResponse } from "../api/search/route";
import Image from "next/image";
import { SearchBar } from "@/components/commons/search/SearchBar";
import { ChangeEvent, useState, useCallback, useMemo, FormEvent } from "react";

// 서버 요청 함수를 컴포넌트 외부로 분리
const fetchPerfumes = async (
  cursor: string | null,
  query: string
): Promise<SearchResponse> => {
  const url = cursor
    ? `/api/search?${query}&cursor=${cursor}`
    : `/api/search?${query}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status}`);
  }

  return await response.json();
};

// 필터 옵션 정의
const FILTER_OPTIONS = {
  gender: [
    { label: "남성", value: "male" },
    { label: "여성", value: "female" },
  ],
  brand: [{ label: "Dior", value: "Dior" }],
  note: [{ label: "Vanilla", value: "Vanilla" }],
};

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  // 검색 제출 핸들러
  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      if (e) e.preventDefault();
      setSubmittedSearchTerm(searchTerm);
    },
    [searchTerm]
  );

  // 필터 변경 핸들러
  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      setFilters((prevFilters) => {
        // 이미 선택된 필터를 다시 클릭하면 해제
        if (prevFilters[key] === value) {
          const newFilters = { ...prevFilters };
          delete newFilters[key];
          return newFilters;
        }
        return { ...prevFilters, [key]: value };
      });

      // 필터 변경 시 자동으로 검색 실행
      setTimeout(() => handleSubmit(), 0);
    },
    [handleSubmit]
  );

  // 필터 초기화 핸들러
  const resetFilters = useCallback(() => {
    setFilters({});

    // 필터 초기화 시 자동으로 검색 실행
    setTimeout(() => handleSubmit(), 0);
  }, [handleSubmit]);

  // 검색어 변경 핸들러
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // 검색 파라미터 생성 (메모이제이션)
  const query = useMemo(() => {
    const searchParams = { q: submittedSearchTerm, ...filters };
    return new URLSearchParams(
      Object.entries(searchParams).filter(([key, v]) => {
        void key;
        return v;
      })
    ).toString();
  }, [submittedSearchTerm, filters]);

  // 무한 스크롤 훅 사용
  const { data, isLoading, moreRef, hasMore, error, refetch } =
    useInfiniteScroll<Perfume>(fetchPerfumes, query);

  // 필터 스타일 계산
  const getFilterStyle = useCallback(
    (key: string, value: string) => {
      return filters[key] === value ? "bg-gray-200 font-bold" : "bg-white";
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

        <div className="mt-10 px-4">
          <h3 className="text-headline-3 font-semibold">향수</h3>

          {data.length === 0 && !isLoading ? (
            <div className="flex justify-center items-center h-40">
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-x-[52px] gap-y-10 mt-5">
              {data.map((item) => (
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
        </div>
      </section>
    </div>
  );
}
