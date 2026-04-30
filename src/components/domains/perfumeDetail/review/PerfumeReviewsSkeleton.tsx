import { ReviewAnalyticsSkeleton } from "./analytics/ReviewAnalyticsSkeleton";
import { ReviewListSkeleton } from "./reviewList/ReviewListSkeleton";

export const PerfumeReviewsSkeleton = () => {
  return (
    <div className="flex flex-col tablet:gap-[60px]">
      <section className="flex flex-col gap-4 tablet:gap-5 w-full">
        <div className="h-7 w-44 bg-gray-200 rounded animate-pulse pl-5 pc:pl-0" />
        <ReviewAnalyticsSkeleton />
      </section>
      <section className="flex flex-col gap-5">
        <div className="h-7 w-16 bg-gray-200 rounded animate-pulse pl-5 pc:pl-0" />
        <ReviewListSkeleton />
      </section>
    </div>
  );
};
