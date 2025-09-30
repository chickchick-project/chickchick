"use client";

import { ReviewResponse } from "@/lib/hono/schemas/review.schema";
import { MyReviewList } from "../components";
import { useUserReview } from "../hooks/useUserActivity";

export default function MyReviewListLoader({
  initialData,
}: {
  initialData?: ReviewResponse[];
}) {
  const { data: reviews, error } = useUserReview(initialData);
  if (error) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p>리뷰를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return <MyReviewList reviews={reviews || []} />;
}
