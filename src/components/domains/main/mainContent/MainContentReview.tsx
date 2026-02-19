import Link from "next/link";
import ReviewCard from "@/components/commons/card/reviewCard";
import { reviewApi } from "@/lib/utils/api/reviews.api";
import { DEFAULT_POPULAR_REVIEW } from "@/lib/constants/review";

export const MainContentReview = async () => {
  const review = await reviewApi.popular();
  const hasRealReview = review?.success && review.data;
  const reviewData = hasRealReview ? review.data : DEFAULT_POPULAR_REVIEW;

  return (
    <div className="flex flex-col items-start justify-center gap-5 w-full pc:px-0 px-4 ">
      <h2 className="tablet:text-headline-2 text-title-2 font-semibold text-black-100">
        인기 리뷰
      </h2>
      <div className="w-full flex items-start tablet:justify-center min-h-[280px]">
        {hasRealReview ? (
          <Link href={`/perfumes/${reviewData.perfume.id}`}>
            <ReviewCard review={reviewData} isMyPage={false} isAuthor={false} />
          </Link>
        ) : (
          <ReviewCard
            review={DEFAULT_POPULAR_REVIEW}
            isMyPage={false}
            isAuthor={false}
          />
        )}
      </div>
    </div>
  );
};
