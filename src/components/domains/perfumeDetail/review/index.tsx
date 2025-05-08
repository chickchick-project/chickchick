import { ReviewAnalytics } from "./analytics";
import { ReviewList } from "./reviewList";

export const PerfumeReview = () => {
  return (
    <section className="flex flex-col gap-[60px]">
      <ReviewAnalytics />
      <ReviewList />
    </section>
  );
};
