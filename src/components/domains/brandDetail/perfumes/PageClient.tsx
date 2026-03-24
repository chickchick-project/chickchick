"use client";

import { useMemo } from "react";
import SortDropdown from "@/components/commons/dropdown/SortDropdown";
import {
  usePerfumeNoteFilter,
  usePerfumeAccordFilter,
} from "@/client/hooks/query/useFilterQuery";
import { SearchHeader } from "../../../commons/perfumeList/search";
import { PerfumeSection } from "../../../commons/perfumeList/section/PerfumeSection";
import { getUniquePerfumes } from "@/components/commons/perfumeList/perfumes.helpers";
import { useInfiniteScrollTrigger } from "@/client/hooks/useInfiniteScrollTrigger";
import { useInfinitePerfumes } from "@/client/hooks/useInfinitePerfumes";

export const PageClient = ({ brandName }: { brandName: string }) => {
  const { data: notes } = usePerfumeNoteFilter();
  const { data: accords } = usePerfumeAccordFilter();

  const memoizedNotes = useMemo(() => notes ?? [], [notes]);
  const memoizedAccords = useMemo(() => accords ?? [], [accords]);

  const {
    perfumes,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePerfumes(brandName);

  // 중복 아이디 제거
  const uniquePerfumes = useMemo(() => {
    return getUniquePerfumes(perfumes);
  }, [perfumes]);

  const moreRef = useInfiniteScrollTrigger({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return (
    <div className="flex flex-col items-center w-full h-full">
      <SearchHeader
        notes={memoizedNotes}
        accords={memoizedAccords}
        isSearch={false}
      />
      <main className="flex flex-col w-full max-w-[1200px] px-4">
        <div className="w-full flex justify-end items-center mb-5">
          <SortDropdown type="perfume" onSortChange={() => {}} />
        </div>
        <PerfumeSection
          perfumes={uniquePerfumes}
          isLoading={isLoading}
          isIdle={!isLoading && uniquePerfumes.length === 0}
          moreRef={moreRef}
        />
      </main>
    </div>
  );
};
