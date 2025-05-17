import { ReviewAnalytics } from "./analytics";
import { ReviewList } from "./reviewList";

export const PerfumeReview = () => {
  return (
    <section className="flex px-5 flex-col gap-[60px] pc:w-[760px] pc:px-0">
      <ReviewAnalytics />
      <ReviewList />
    </section>
  );
};
