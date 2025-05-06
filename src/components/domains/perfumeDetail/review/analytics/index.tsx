import { ReviewBarSection } from "./ReviewBarSection";
import { ReviewDoughnutSection } from "./ReviewDoughnutSection";

export const ReviewAnalytics = () => {
  return (
    <>
      <h2>리뷰 한눈에 보기</h2>
      <ReviewDoughnutSection />
      <ReviewBarSection />
    </>
  );
};
