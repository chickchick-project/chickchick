"use client";

import { ChangeEvent, FormEvent, useState, useMemo, useEffect } from "react";
import { Brand, PerfumeAccord, PerfumeNote } from "@prisma/client";
import SortDropdown from "@/components/commons/dropdown/SortDropdown";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import { useTotalStore } from "@/lib/stores/useCountStore";
import { useInfiniteScroll } from "@/lib/hooks/useInfinityScroll";
import { BrandSection } from "@/components/commons/perfumeList/section/BrandSection";
import { PerfumeSection } from "@/components/commons/perfumeList/section/PerfumeSection";
import { SearchHeader } from "@/components/commons/perfumeList/search";
import {
  fetchPerfumes,
  getUniquePerfumes,
} from "@/components/commons/perfumeList/perfumes.helpers";
import { PerfumeBaseResponse } from "@/lib/hono/schemas/perfume.schema";
import { withCache } from "@/lib/utils/withCache";

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

  // 검색 제출 핸들러
  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    setSearchKeyword(inputValue);
  };

  // 검색어 변경 핸들러
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const fetcher = useMemo(
    () =>
      withCache((cursor: string | null) =>
        fetchPerfumes(cursor, searchKeyword, filters)
      ),
    [searchKeyword, filters]
  );

  const { data, totalCount, isLoading, moreRef, isIdle } =
    useInfiniteScroll<PerfumeBaseResponse>(fetcher);
  useEffect(() => {
    if (totalCount !== null && typeof totalCount === "number") {
      setCount(totalCount);
    }
  }, [totalCount, setCount]);

  useEffect(() => {
    const keywordWords = searchKeyword.trim().toLowerCase().split(" ");
    const match = memoizedBrands.find((brand) =>
      keywordWords.includes(brand.nameEn.toLowerCase())
    );
    setMatchedBrand(match ? match.nameEn : null);
  }, [searchKeyword, memoizedBrands]);

  // 중복 아이디 제거
  const uniquePerfumes = getUniquePerfumes(data);

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
            isIdle={isIdle}
            moreRef={moreRef}
          />
        </main>
      </div>
    </div>
  );
}
