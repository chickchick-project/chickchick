import { MobileSeparator } from "@/components/commons/mobileSeparator";
import { ReviewAnalytics } from "./analytics";
import { ReviewList } from "./reviewList";
import { PerfumeReviewsProps } from "./review.type";

export const PerfumeReviews = ({ data }: PerfumeReviewsProps) => {
  return (
    <section className="flex flex-col pc:gap-[60px] pc:w-[760px] pc:px-0">
      <ReviewAnalytics data={data} />
      <MobileSeparator />
      <ReviewList data={data} />
    </section>
  );
};
