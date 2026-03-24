"use client";

import {
  useBrandFilter,
  usePerfumeNoteFilter,
  usePerfumeAccordFilter,
  useAvailableFilters,
} from "@/lib/hooks/query/useFilterQuery";
import { BrandSection } from "@/components/commons/perfumeList/section/BrandSection";
import { PerfumeSection } from "@/components/commons/perfumeList/section/PerfumeSection";
import { SearchHeader } from "@/components/commons/perfumeList/search";
// import SortDropdown from "@/components/commons/dropdown/SortDropdown";
import { useInfinitePerfumes } from "@/lib/hooks/useInfinitePerfumes";
import { usePerfumeSearchState } from "./hook/usePerfumeSearchState";
import { useInfiniteScrollTrigger } from "@/lib/hooks/useInfiniteScrollTrigger";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import { useMemo } from "react";

export default function PageClient() {
  // 실제 적용된 필터 상태 (committed)
  const selectedFilters = useFilterStore((state) => state.committedFilters);

  // 브랜드는 항상 조회
  const { data: allBrands } = useBrandFilter();

  const {
    inputValue,
    searchKeyword,
    matchedBrand,
    handleChange,
    handleSubmit,
  } = usePerfumeSearchState(allBrands ?? []);

  const {
    perfumes,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePerfumes(searchKeyword);

  // 동적 필터 파라미터
  const filterParams = useMemo(() => {
    return {
      searchText: searchKeyword || "",
      brandFilter: selectedFilters.brand,
      notesFilter: selectedFilters.notes,
      accordsFilter: selectedFilters.accords,
    };
  }, [searchKeyword, selectedFilters]);

  // Idle 상태 확인: 필터가 선택 안 됨 AND 검색어 없음
  const isIdle = Object.keys(selectedFilters).length === 0 && !searchKeyword;

  // 노트/어코드는 Idle 상태에서만 조회
  const { data: allNotes } = usePerfumeNoteFilter(isIdle);
  const { data: allAccords } = usePerfumeAccordFilter(isIdle);

  // 동적 필터: Idle이 아니고, 로딩 완료 후에만 조회
  const { data: availableFilters } = useAvailableFilters(
    filterParams,
    !isIdle && !isLoading,
  );

  // 필터 정렬 함수: 선택된 항목은 맨 위, 나머지는 count 내림차순
  const sortFilters = <T extends { id: string; count?: number }>(
    items: T[],
    selectedIds: string[] = [],
  ): T[] => {
    const selected = items.filter((item) => selectedIds.includes(item.id));
    const unselected = items.filter((item) => !selectedIds.includes(item.id));

    // 선택되지 않은 항목만 count 기준 정렬
    unselected.sort((a, b) => (b.count ?? 0) - (a.count ?? 0));

    // 선택된 항목 먼저, 그 다음 정렬된 미선택 항목
    return [...selected, ...unselected];
  };

  // 필터 데이터 결정: Idle이면 전체 데이터, 아니면 동적 필터
  // 브랜드는 항상 전체 목록 유지 (선택 여부와 무관)
  const brands = useMemo(() => {
    return allBrands;
  }, [allBrands]);

  const notes = useMemo(() => {
    if (isIdle) return allNotes;
    if (availableFilters) {
      const mapped = availableFilters.notes.map(
        (item: {
          id: string;
          nameKo: string;
          nameEn: string;
          count: number;
        }) => ({
          id: item.id,
          nameKo: item.nameKo,
          nameEn: item.nameEn,
          description: null,
          count: item.count,
        }),
      );
      return sortFilters(mapped, selectedFilters.notes);
    }
    // 로딩 중이거나 에러 시: 선택된 항목만 상단으로 정렬
    if (selectedFilters.notes && selectedFilters.notes.length > 0) {
      return sortFilters(allNotes ?? [], selectedFilters.notes);
    }
    return allNotes;
  }, [isIdle, availableFilters, allNotes, selectedFilters.notes]);

  const accords = useMemo(() => {
    if (isIdle) return allAccords;
    if (availableFilters) {
      const mapped = availableFilters.accords.map(
        (item: {
          id: string;
          nameKo: string;
          nameEn: string;
          count: number;
        }) => ({
          id: item.id,
          nameKo: item.nameKo,
          nameEn: item.nameEn,
          count: item.count,
        }),
      );
      return sortFilters(mapped, selectedFilters.accords);
    }
    // 로딩 중이거나 에러 시: 선택된 항목만 상단으로 정렬
    if (selectedFilters.accords && selectedFilters.accords.length > 0) {
      return sortFilters(allAccords ?? [], selectedFilters.accords);
    }
    return allAccords;
  }, [isIdle, availableFilters, allAccords, selectedFilters.accords]);

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
        <h1 className="sr-only">향수 탐색</h1>
        <SearchHeader
          inputValue={inputValue}
          onChange={handleChange}
          onSubmit={handleSubmit}
          brands={brands ?? undefined}
          notes={notes ?? []}
          accords={accords ?? []}
        />
        <main className="flex flex-col w-full max-w-[1200px] px-4 h-full">
          <div className="w-full flex justify-between items-center mb-5">
            <h2 className="tablet:text-headline-2 text-title-2 font-semibold">
              {searchKeyword
                ? `'${searchKeyword}'에 대한 검색 결과`
                : "현재 인기있는 향수들이에요!"}
            </h2>
            {/* <SortDropdown type="perfume" onSortChange={() => {}} /> */}
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
