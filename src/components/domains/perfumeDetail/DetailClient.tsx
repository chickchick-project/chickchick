import { TPerfumeDetail } from "@/lib/types/perfumeDetail";
import { PerfumeOverview } from "./overview";
import { PerfumeReview } from "./review";
import { SearchBar } from "@/components/commons/search/SearchBar";
import { PerfumeDetailSidebar } from "./sidebar";
import { PerfumeRecentViewList } from "./recentViewList";

// temp
// sematic tag 적용하기 (하위 컴포넌트 전부)

export const DetailClient = ({
  perfumeDetail,
}: {
  perfumeDetail: TPerfumeDetail;
}) => {
  return (
    <div className="w-full flex flex-col items-center my-10">
      <section className="w-full px-5 flex flex-col gap-[60px] items-center">
        <SearchBar />
        <PerfumeOverview perfumeDetail={perfumeDetail} />
      </section>
      <hr className="w-full h-px bg-gray-200 my-10" />
      <section className="w-full flex flex-col pc:flex-row pc:justify-between">
        <div className="flex flex-col gap-[60px]">
          <PerfumeReview />
          <PerfumeRecentViewList />
        </div>
        <PerfumeDetailSidebar />
      </section>
    </div>
  );
};
