"use client";
import { SearchBar } from "@/components/commons/search/SearchBar";
import { ApiPerfumeDetailResponse } from "@/lib/hono/schemas/perfume.schema";
import { useState, useMemo } from "react";
import { MobileActionBar } from "./mobileActionBar";
import { PerfumeOverview } from "./overview";
import { InteractionStates } from "./overview/perfumeInfo";
import { PerfumeRecentViewList } from "./recentViewList";
import { PerfumeReviews } from "./review";
import { PerfumeDetailSidebar } from "./sidebar";
import { MobileSeparator } from "@/components/commons/mobileSeparator";
import { ApiReviewResponse } from "@/lib/hono/schemas/review.schema";
import { useLogRecentItem } from "@/lib/stores/useLogRecentItem";
import { useRecentPerfumesStore } from "@/lib/stores/useRecentPerfumesStore";

// temp
// sematic tag 적용하기 (하위 컴포넌트 전부)

export const DetailClient = ({
  perfumeDetail,
  reviewData,
}: {
  perfumeDetail: ApiPerfumeDetailResponse;
  reviewData: ApiReviewResponse[];
}) => {
  const recentPerfumeData = useMemo(() => {
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
        <PerfumeOverview
          perfumeDetail={perfumeDetail}
          interactionStates={interactionStates}
          onToggleInteraction={toggleInteraction}
        />
      </section>
      <MobileSeparator className="pc:h-px pc:bg-gray-200" mobileOnly={false} />
      <section className="w-full flex flex-col pc:flex-row pc:justify-between">
        <div className="flex flex-col pc:gap-[60px]">
          <PerfumeReviews data={reviewData} />
          <MobileSeparator />
          <PerfumeRecentViewList />
        </div>
        <MobileSeparator />
        <PerfumeDetailSidebar />
      </section>
      <section className="w-full fixed bottom-0 tablet:hidden">
        <MobileActionBar
          interactionStates={interactionStates}
          onToggleInteraction={toggleInteraction}
        />
      </section>
    </div>
  );
};
