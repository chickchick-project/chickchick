import ReviewCard from "@/components/commons/card/reviewCard";
import { mockMainpageReviewCardData } from "@/lib/mocks/reviewCard";

export const MainContentReview = () => {
  return (
    <div className="flex flex-col items-start justify-center gap-5 w-full">
      <div className="tablet:text-headline-2 text-title-2 font-semibold text-black-100">
        인기 리뷰
      </div>
      <ReviewCard
        brand={mockMainpageReviewCardData.brand}
        title={mockMainpageReviewCardData.title}
        review={mockMainpageReviewCardData.review}
        createdAt={mockMainpageReviewCardData.createdAt}
        info={mockMainpageReviewCardData.info}
        chips={mockMainpageReviewCardData.chips}
        imageUrl={mockMainpageReviewCardData.imageUrl}
        isMyPage={mockMainpageReviewCardData.isMyPage}
        isAuthor={mockMainpageReviewCardData.isAuthor}
        author={mockMainpageReviewCardData.author}
      />
    </div>
  );
};
