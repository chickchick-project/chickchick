"use client";

import { ChangeEvent, FormEvent, useState, useMemo, useEffect } from "react";

import { brands, perfume_accords, perfume_notes } from "@prisma/client";

import { Perfume } from "@/app/api/search/route";
import SortDropdown from "@/components/commons/dropdown/SortDropdown";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import { useInfiniteScroll } from "@/lib/hooks/useInfinityScroll";
import { withCache } from "@/lib/utils/withCache";

import { PerfumeSection } from "./section";
import { SearchHeader } from "./search";
import {
  getUniquePerfumes,
  createQueryKey,
  adaptedFetchPerfumes,
} from "./perfumes.helpers";
import { useTotalStore } from "@/lib/stores/useCountStore";

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
    () =>
      withCache((cursor: string | null) =>
        adaptedFetchPerfumes(cursor, searchKeyword, filters)
      ),
    [searchKeyword, filters]
  );

  const { data, totalCount, isLoading, moreRef, isIdle } =
    useInfiniteScroll<Perfume>(fetcher, query);

  useEffect(() => {
    if (totalCount !== null && typeof totalCount === "number") {
      setCount(totalCount);
    }
  }, [totalCount, setCount]);

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
