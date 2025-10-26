"use client";

import { Brand, PerfumeAccord, PerfumeNote } from "@prisma/client";
import { BrandSection } from "@/components/commons/perfumeList/section/BrandSection";
import { PerfumeSection } from "@/components/commons/perfumeList/section/PerfumeSection";
import { SearchHeader } from "@/components/commons/perfumeList/search";
import SortDropdown from "@/components/commons/dropdown/SortDropdown";
import { useInfinitePerfumes } from "./hook/useInfinitePerfumes";
import { usePerfumeSearchState } from "./hook/usePerfumeSearchState";
import { useInfiniteScrollTrigger } from "@/lib/hooks/useInfiniteScrollTrigger";

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
  const {
    inputValue,
    searchKeyword,
    matchedBrand,
    handleChange,
    handleSubmit,
  } = usePerfumeSearchState(brands);

  const {
    perfumes,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePerfumes(searchKeyword);

  const moreRef = useInfiniteScrollTrigger({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

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
          brands={brands}
          notes={notes}
          accords={accords}
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
            perfumes={perfumes}
            isLoading={isLoading}
            isIdle={!isLoading && perfumes.length === 0}
            moreRef={moreRef}
          />
        </main>
      </div>
    </div>
  );
}
