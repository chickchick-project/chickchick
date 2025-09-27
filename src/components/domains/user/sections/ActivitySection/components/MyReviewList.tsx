import React from "react";
import ReviewCard from "@/components/commons/card/reviewCard";
import { ReviewResponse } from "@/lib/hono/schemas/review.schema";
import { mockReviewCardData } from "@/lib/mocks/reviewCard";

export const MyReviewList = ({ reviews }: { reviews: ReviewResponse[] }) => {
  return reviews.length > 0 ? (
    <div className="grid grid-cols-2 justify-items-center">
      {reviews.map((item) => (
        <ReviewCard key={item.id} {...mockReviewCardData} />
      ))}
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      작성한 리뷰가 없습니다.
    </div>
  );
};
