import React from "react";
import ReviewCard from "@/components/commons/card/reviewCard";
import { ApiReviewResponse } from "@/lib/hono/schemas/review.schema";

export const MyReviewList = ({ reviews }: { reviews: ApiReviewResponse[] }) => {
  return reviews.length > 0 ? (
    <div className="grid grid-cols-2 justify-items-center gap-5">
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
  ) : (
    <div className="text-center py-8 text-gray-500">
      작성한 리뷰가 없습니다.
    </div>
  );
};
