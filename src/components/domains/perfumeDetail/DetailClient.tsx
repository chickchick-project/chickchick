"use client";

import { SearchBar } from "@/components/commons/search/SearchBar";
import type { ApiPerfumeDetailResponse } from "@/server/hono/schemas/perfume.schema";
import { useState, useMemo } from "react";
import { MobileActionBar } from "./mobileActionBar";
import { PerfumeOverview } from "./overview";
import { PerfumeOverviewSkeleton } from "./overview/PerfumeOverviewSkeleton";
import { InteractionStates } from "./overview/perfumeInfo";
import { PerfumeRecentViewList } from "./recentViewList";
import { PerfumeReviews } from "./review";
import { PerfumeDetailSidebar } from "./sidebar";
import { PerfumeDetailSidebarSkeleton } from "./sidebar/PerfumeDetailSidebarSkeleton";
import { MobileSeparator } from "@/components/commons/mobileSeparator";
import type { ApiReviewResponse } from "@/server/hono/schemas/review.schema";
import { useLogRecentItem } from "@/client/stores/perfumeStore";
import { useRecentPerfumesStore } from "@/client/stores/perfumeStore";

// temp
// sematic tag 적용하기 (하위 컴포넌트 전부)

export const DetailClient = ({
  perfumeDetail,
  isPerfumeLoading,
  reviewData,
  isReviewLoading,
}: {
  perfumeDetail: ApiPerfumeDetailResponse | null;
  isPerfumeLoading: boolean;
  reviewData: ApiReviewResponse[];
  isReviewLoading: boolean;
}) => {
  const recentPerfumeData = useMemo(() => {
    if (!perfumeDetail) return null;
    return {
      id: perfumeDetail.id,
      perfumeName: perfumeDetail.nameKo ?? perfumeDetail.nameEn,
      brandName: perfumeDetail.brand.nameKo ?? perfumeDetail.brand.nameEn,
      imageUrl: perfumeDetail.perfumeImage?.imageUrl ?? "",
    };
  }, [perfumeDetail]);

  useLogRecentItem(recentPerfumeData, useRecentPerfumesStore);

  const [interactionStates, setInteractionStates] = useState<InteractionStates>(
    {
      liked: false,
      bookmarked: false,
    },
  );

  const toggleInteraction = (type: keyof InteractionStates) => {
    setInteractionStates((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="w-full flex flex-col items-center my-10">
      <section className="w-full px-5 flex flex-col gap-[60px] items-center">
        <SearchBar />
        <div className="w-full">
          {isPerfumeLoading || !perfumeDetail ? (
            <PerfumeOverviewSkeleton />
          ) : (
            <PerfumeOverview
              perfumeDetail={perfumeDetail}
              interactionStates={interactionStates}
              onToggleInteraction={toggleInteraction}
            />
          )}
        </div>
      </section>
      <MobileSeparator className="pc:h-px pc:bg-gray-200" mobileOnly={false} />
      <section className="w-full flex flex-col pc:flex-row pc:justify-between pc:gap-[60px]">
        <div className="flex flex-col tablet:gap-[60px]">
          <PerfumeReviews data={reviewData} isLoading={isReviewLoading} />
          <MobileSeparator />
          <PerfumeRecentViewList />
        </div>
        <MobileSeparator />
        <div>
          {isPerfumeLoading || !perfumeDetail ? (
            <PerfumeDetailSidebarSkeleton />
          ) : (
            <PerfumeDetailSidebar perfumeId={perfumeDetail.id} />
          )}
        </div>
      </section>
      <section className="w-full fixed bottom-0 tablet:hidden">
        {perfumeDetail && (
          <MobileActionBar
            interactionStates={interactionStates}
            onToggleInteraction={toggleInteraction}
          />
        )}
      </section>
    </div>
  );
};
