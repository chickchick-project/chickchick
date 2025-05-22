"use client";

import { ChangeEvent, FormEvent, useState, useMemo, useEffect } from "react";
import { brands, perfume_accords, perfume_notes } from "@prisma/client";
import { Perfume } from "@/app/api/search/route";
import SortDropdown from "@/components/commons/dropdown/SortDropdown";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import { useTotalStore } from "@/lib/stores/useCountStore";
import { useInfiniteScroll } from "@/lib/hooks/useInfinityScroll";
import {
  getUniquePerfumes,
  createQueryKey,
  adaptedFetchPerfumes,
} from "./perfumes.helpers";

import { PerfumeSection } from "./section/PerfumeSection";
import { BrandSection } from "./section/BrandSection";
import { SearchHeader } from "./search";

export type BrandName = {
  en: string;
  ko: string;
};

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
  const memoizedAccords = useMemo(() => accords, [accords]);

  const [inputValue, setInputValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [matchedBrand, setMatchedBrand] = useState<string | null>(null);
  const filters = useFilterStore((state) => state.filters);
  const setCount = useTotalStore((state) => state.setTotalCount);

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
  const query: string = useMemo(
    () => createQueryKey(searchKeyword, filters),
    [searchKeyword, filters]
  );

  // 무한 스크롤 훅 사용
  const fetcher = useMemo(
    () => (cursor: string | null) =>
      adaptedFetchPerfumes(cursor, searchKeyword, filters),
    [searchKeyword, filters]
  );

  const { data, totalCount, isLoading, moreRef, isIdle } =
    useInfiniteScroll<Perfume>(fetcher, query);

  useEffect(() => {
    if (totalCount !== null && typeof totalCount === "number") {
      setCount(totalCount);
    }
  }, [totalCount, setCount]);

  useEffect(() => {
    const keywordWords = searchKeyword.trim().toLowerCase().split(" ");
    const match = memoizedBrands.find((brand) => {
      const brandName = brand.name as BrandName;
      return keywordWords.includes(brandName.en.toLowerCase());
    });
    setMatchedBrand(match ? (match.name as BrandName).en : null);
  }, [searchKeyword, memoizedBrands]);

  const uniquePerfumes = useMemo(() => getUniquePerfumes(data), [data]);
  return (
    <div className="flex flex-col items-center">
      <SearchHeader
        inputValue={inputValue}
        onChange={handleChange}
        onSubmit={handleSubmit}
        brands={memoizedBrands}
        notes={memoizedNotes}
        accords={memoizedAccords}
      />

      <main className="w-full max-w-[1200px] px-4">
        <div className="w-full flex justify-between items-center mb-5">
          <span className="text-headline-2 font-semibold">
            {searchKeyword
              ? `'${searchKeyword}'에 대한 검색 결과`
              : "현재 인기있는 향수들이에요!"}
          </span>
          <SortDropdown type="perfume" />
        </div>
        {matchedBrand && <BrandSection brandName={matchedBrand} />}
        <PerfumeSection
          perfumes={uniquePerfumes}
          isLoading={isLoading}
          isIdle={isIdle}
          moreRef={moreRef}
        />
      </main>
    </div>
  );
}
