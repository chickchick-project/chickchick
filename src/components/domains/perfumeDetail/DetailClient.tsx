"use client";
import { SearchBar } from "@/components/commons/search/SearchBar";
import { TPerfumeDetail } from "@/lib/types/perfumeDetail";
import { useState } from "react";
import { MobileActionBar } from "./mobileActionBar";
import { PerfumeOverview } from "./overview";
import { InteractionStates } from "./overview/perfumeInfo";
import { PerfumeRecentViewList } from "./recentViewList";
import { PerfumeReview } from "./review";
import { PerfumeDetailSidebar } from "./sidebar";

// temp
// sematic tag 적용하기 (하위 컴포넌트 전부)

export const DetailClient = ({
  perfumeDetail,
}: {
  perfumeDetail: TPerfumeDetail;
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
          perfumeDetail={perfumeDetail}
          interactionStates={interactionStates}
          onToggleInteraction={toggleInteraction}
        />
      </section>
      <hr className="w-full h-2 bg-gray-300 pc:h-px pc:bg-gray-200 my-10 border-0" />
      <section className="w-full flex flex-col pc:flex-row pc:justify-between">
        <div className="flex flex-col pc:gap-[60px]">
          <PerfumeReview />
          <hr className="w-full h-2 bg-gray-300 my-10 border-0 pc:hidden" />
          <PerfumeRecentViewList />
        </div>
        <hr className="w-full h-2 bg-gray-300 my-10 border-0 pc:hidden" />
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
