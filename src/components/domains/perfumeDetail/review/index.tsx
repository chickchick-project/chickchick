import { MobileSeparator } from "@/components/commons/mobileSeparator";
import { ReviewAnalytics } from "./analytics";
import { ReviewList } from "./reviewList";

export const PerfumeReview = () => {
  return (
    <section className="flex flex-col pc:gap-[60px] pc:w-[760px] pc:px-0">
      <ReviewAnalytics />
      <MobileSeparator />
      <ReviewList />
    </section>
  );
};
