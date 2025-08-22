import { MobileSeparator } from "@/components/commons/mobileSeparator";
import { ReviewAnalytics } from "./analytics";
import { ReviewList } from "./reviewList";
import { ReviewResponse } from "@/lib/hono/schemas/review.schema";

export const PerfumeReview = ({ data }: { data: ReviewResponse[] }) => {
  return (
    <section className="flex flex-col pc:gap-[60px] pc:w-[760px] pc:px-0">
      <ReviewAnalytics data={data} />
      <MobileSeparator />
      <ReviewList data={data} />
    </section>
  );
};
