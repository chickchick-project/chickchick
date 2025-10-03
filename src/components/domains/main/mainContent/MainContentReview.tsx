// import ReviewCard from "@/components/commons/card/reviewCard";
// import { mockMainpageReviewCardData } from "@/lib/mocks/reviewCard";

export const MainContentReview = () => {
  return (
    <div className="flex flex-col items-start justify-center gap-5 w-full pc:px-0 px-4">
      <div className="tablet:text-headline-2 text-title-2 font-semibold text-black-100">
        인기 리뷰
      </div>
      <ReviewCard {...mockMainpageReviewCardData} />
    </div>
  );
};
