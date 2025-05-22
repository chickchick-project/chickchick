import ReviewCard from "@/components/commons/card/reviewCard";
import { Headline2Semibold } from "@/components/commons/text/Headline2Semibold";
import { mockReviewCardData } from "@/lib/mocks/reviewCard";

export const MainContentReview = () => {
  return (
    <div className="flex flex-col items-start justify-center gap-5">
      <Headline2Semibold>인기 리뷰</Headline2Semibold>
      <ReviewCard
        brand={mockReviewCardData.brand}
        title={mockReviewCardData.title}
        review={mockReviewCardData.review}
        createdAt={mockReviewCardData.createdAt}
        info={mockReviewCardData.info}
        chips={mockReviewCardData.chips}
        imageUrl={mockReviewCardData.imageUrl}
        isMyPage={mockReviewCardData.isMyPage}
        isAuthor={mockReviewCardData.isAuthor}
        author={mockReviewCardData.author}
      />
    </div>
  );
};
