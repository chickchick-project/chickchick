import { ReviewAnalytics } from "./analytics";
import { PerfumeRecentViewList } from "./recentViewList";
import { ReviewList } from "./reviewList";

export const PerfumeReview = () => {
  return (
    <section className="flex flex-col gap-[60px] w-[760px]">
      <ReviewAnalytics />
      <ReviewList />
      <PerfumeRecentViewList />
    </section>
  );
};
