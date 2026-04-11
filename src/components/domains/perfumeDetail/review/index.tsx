import { cn } from "@/shared/utils/cn";
import { MobileSeparator } from "@/components/commons/mobileSeparator";
import { ReviewAnalytics } from "./analytics";
import { ReviewList } from "./reviewList";
import { PerfumeReviewsProps } from "./review.type";
import { PerfumeReviewsSkeleton } from "./PerfumeReviewsSkeleton";

export const PerfumeReviews = ({ data, isLoading }: PerfumeReviewsProps) => {
  return (
    <section className="flex flex-col tablet:gap-[60px] pc:w-[760px] pc:px-0">
      <div className="relative">
        <div
          className={cn(
            "transition-opacity duration-300",
            !isLoading ? "absolute inset-0 opacity-0 pointer-events-none" : "",
          )}
        >
          <PerfumeReviewsSkeleton />
        </div>
        {!isLoading && (
          <>
            <ReviewAnalytics data={data} />
            <MobileSeparator />
            <ReviewList data={data} />
          </>
        )}
      </div>
    </section>
  );
};
