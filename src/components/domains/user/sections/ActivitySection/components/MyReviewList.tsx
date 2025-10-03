import React from "react";
import ReviewCard from "@/components/commons/card/reviewCard";
import { ApiReviewResponse } from "@/lib/hono/schemas/review.schema";

export const MyReviewList = ({ reviews }: { reviews: ApiReviewResponse[] }) => {
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
        return (
          <ReviewCard
            key={item.id}
            review={item}
            isMyPage={true}
            isAuthor={true}
          />
        );
      })}
    </div>
  );
};
