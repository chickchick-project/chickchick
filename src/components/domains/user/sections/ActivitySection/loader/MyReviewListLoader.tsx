"use client";

import { useEffect, useState } from "react";
import { MyReviewList } from "../components";
import { useUserReview } from "../hooks/useUserActivity";

export default function MyReviewListLoader() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const { data: paginatedReviews, error } = useUserReview();

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
    <>
      {isMounted && <MyReviewList reviews={paginatedReviews.data} />}

      {paginatedReviews.nextCursor && (
        <div className="mt-4 flex justify-center">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            더 보기
          </button>
        </div>
      )}
    </>
  );
}
