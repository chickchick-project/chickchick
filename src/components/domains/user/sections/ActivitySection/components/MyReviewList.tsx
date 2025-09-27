import React from "react";
import ReviewCard from "@/components/commons/card/reviewCard";
import { mockReviewCardData } from "@/lib/mocks/reviewCard";

export const MyReviewList = ({ reviews }: { reviews: any[] }) => {
  return reviews.length > 0 ? (
    <ul className="space-y-2">
      {reviews.map((item) => (
        <ReviewCard key={item.id} {...mockReviewCardData} />
      ))}
    </ul>
  ) : (
    <div className="text-center py-8 text-gray-500">
      작성한 리뷰가 없습니다.
    </div>
  );
};
