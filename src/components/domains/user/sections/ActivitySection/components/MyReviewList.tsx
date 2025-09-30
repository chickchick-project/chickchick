import React from "react";
import ReviewCard from "@/components/commons/card/reviewCard";
import { ReviewResponse } from "@/lib/hono/schemas/review.schema";

export const MyReviewList = ({ reviews }: { reviews: ReviewResponse[] }) => {
  //Todo: reviews에서 데이터를 가져와서 chips를 만들어야 함
  /**
   * Feeling, genderTone, longevity, pricePerception, season, sillage, timOfday, usageStatus
   */
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        작성한 리뷰가 없습니다.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 justify-items-center">
      {reviews.map((item) => {
        console.log(item);
        return (
          <ReviewCard
            key={item.id}
            reviews={item}
            isMyPage={true}
            isAuthor={true}
          />
        );
      })}
    </div>
  );
};
