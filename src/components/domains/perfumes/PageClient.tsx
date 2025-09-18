"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { Brand, PerfumeAccord, PerfumeNote } from "@prisma/client";
import SortDropdown from "@/components/commons/dropdown/SortDropdown";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import { useTotalStore } from "@/lib/stores/useCountStore";
import { BrandSection } from "@/components/commons/perfumeList/section/BrandSection";
import { PerfumeSection } from "@/components/commons/perfumeList/section/PerfumeSection";
import { SearchHeader } from "@/components/commons/perfumeList/search";
import {
  fetchPerfumes,
  getUniquePerfumes,
} from "@/components/commons/perfumeList/perfumes.helpers";
import { PerfumeBaseResponse } from "@/lib/hono/schemas/perfume.schema";
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";

export interface SearchResponse<T> {
  data: T[]; // 검색된 목록
  nextCursor: string | null; // 다음 페이지를 위한 커서 (없으면 null)
  totalCount?: number | null;
}

export type BrandName = {
  en: string;
  ko: string;
};

export default function PageClient({
  brands,
  notes,
  accords,
}: {
  brands: Brand[];
  notes: PerfumeNote[];
  accords: PerfumeAccord[];
}) {
  const memoizedBrands = useMemo(() => brands, [brands]);
  const memoizedNotes = useMemo(() => notes, [notes]);
  const memoizedAccords = useMemo(() => accords, [accords]);

  const [inputValue, setInputValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [matchedBrand, setMatchedBrand] = useState<string | null>(null);
  const filters = useFilterStore((state) => state.filters);
  const setCount = useTotalStore((state) => state.setTotalCount);
  const moreRef = useRef<HTMLDivElement>(null);

  // 검색 제출 핸들러
  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    setSearchKeyword(inputValue);
  };

  // 검색어 변경 핸들러
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    SearchResponse<PerfumeBaseResponse>,
    Error,
    InfiniteData<SearchResponse<PerfumeBaseResponse>>,
    (string | typeof filters)[],
    string | null
  >({
    queryKey: ["perfumes", searchKeyword, filters],
    queryFn: ({ pageParam }) =>
      fetchPerfumes(pageParam, searchKeyword, filters),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
  });

  useEffect(() => {
    const keywordWords = searchKeyword.trim().toLowerCase().split(" ");
    const match = memoizedBrands.find((brand) =>
      keywordWords.includes(brand.nameEn.toLowerCase())
    );
    setMatchedBrand(match ? match.nameEn : null);
  }, [searchKeyword, memoizedBrands]);

  // 중복 아이디 제거
  const uniquePerfumes = useMemo(() => {
    const allPerfumes = data?.pages.flatMap((page) => page.data) ?? [];
    return getUniquePerfumes(allPerfumes);
  }, [data]);

  useEffect(() => {
    if (data?.pages[0]?.totalCount) {
      setCount(data.pages[0].totalCount);
    }
  }, [data, setCount]);

  const isIntersecting = useIntersectionObserver(moreRef);

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const keywordWords = searchKeyword.trim().toLowerCase().split(" ");
    const match = memoizedBrands.find((brand) =>
      keywordWords.includes(brand.nameEn.toLowerCase())
    );
    setMatchedBrand(match ? match.nameEn : null);
  }, [searchKeyword, memoizedBrands]);

  if (isError) {
    return (
      <div>
        에러가 발생했습니다:
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center h-full">
        <SearchHeader
          inputValue={inputValue}
          onChange={handleChange}
          onSubmit={handleSubmit}
          brands={memoizedBrands}
          notes={memoizedNotes}
          accords={memoizedAccords}
        />
        <main className="flex flex-col w-full max-w-[1200px] px-4 h-full">
          <div className="w-full flex justify-between items-center mb-5">
            <span className="tablet:text-headline-2 text-title-2 font-semibold">
              {searchKeyword
                ? `'${searchKeyword}'에 대한 검색 결과`
                : "현재 인기있는 향수들이에요!"}
            </span>
            <SortDropdown type="perfume" onSortChange={() => {}} />
          </div>
          {matchedBrand && <BrandSection brandName={matchedBrand} />}
          <PerfumeSection
            perfumes={uniquePerfumes}
            isLoading={isLoading}
            isIdle={!isLoading && uniquePerfumes.length === 0}
            moreRef={moreRef}
          />
        </main>
      </div>
    </div>
  );
}
