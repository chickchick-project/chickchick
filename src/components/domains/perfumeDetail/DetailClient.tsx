"use client";
import { MobileSeparator } from "@/components/commons/mobileSeparator";
import { SearchBar } from "@/components/commons/search/SearchBar";
import { useState } from "react";
import { PerfumeOverview } from "./overview";
import { InteractionStates } from "./overview/perfumeInfo";

// temp
// sematic tag 적용하기 (하위 컴포넌트 전부)

export const DetailClient = ({
  perfumeId,
}: // reviewData,
{
  perfumeId: string;
  // reviewData: ReviewResponse[];
}) => {
  const [interactionStates, setInteractionStates] = useState<InteractionStates>(
    {
      liked: false,
      bookmarked: false,
    }
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
          perfumeId={perfumeId}
          interactionStates={interactionStates}
          onToggleInteraction={toggleInteraction}
        />
      </section>
      <MobileSeparator className="pc:h-px pc:bg-gray-200" mobileOnly={false} />
      {/* <section className="w-full flex flex-col pc:flex-row pc:justify-between">
        <div className="flex flex-col pc:gap-[60px]">
          <PerfumeReview data={reviewData} />
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
      </section> */}
    </div>
  );
};
