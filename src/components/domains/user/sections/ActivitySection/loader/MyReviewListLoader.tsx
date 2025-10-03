"use client";

import { MyReviewList } from "../components";
import { useUserReview } from "../hooks/useUserActivity";
import { PaginatedApiReviewResponse } from "@/lib/hono/schemas/review.schema";

export default function MyReviewListLoader({
  initialData,
}: {
  initialData?: PaginatedApiReviewResponse;
}) {
  const { data: paginatedReviews, error } = useUserReview(initialData);

  if (error) {
    return <p>리뷰를 불러올 수 없습니다.</p>;
  }

  if (paginatedReviews.data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        작성한 리뷰가 없습니다.
      </div>
    );
  }

  return (
    <div>
      <MyReviewList reviews={paginatedReviews.data} />

      {paginatedReviews.nextCursor && (
        <div className="mt-4 flex justify-center">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            더 보기
          </button>
        </div>
      )}
    </div>
  );
}
