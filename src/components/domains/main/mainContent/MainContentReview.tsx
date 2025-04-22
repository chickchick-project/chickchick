import ReviewCard from "@/components/commons/card/reviewCard";
import { Headline2Semibold } from "@/components/commons/text/Headline2Semibold";
import { dummyReview } from "./dummyReview";

export const MainContentReview = () => {
  return (
    <div className="flex flex-col items-start justify-center gap-5">
      <Headline2Semibold>인기 리뷰</Headline2Semibold>
      <ReviewCard
        brand={dummyReview.brand}
        title={dummyReview.title}
        review={dummyReview.review}
        createdAt={dummyReview.createdAt}
        info={dummyReview.info}
        chips={dummyReview.chips}
        imageUrl={dummyReview.imageUrl}
        isMyPage={dummyReview.isMyPage}
        isAuthor={dummyReview.isAuthor}
      />
    </div>
  );
};
