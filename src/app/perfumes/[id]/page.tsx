"use client";

import { DetailClient } from "@/components/domains/perfumeDetail/DetailClient";
import { usePerfumeDetail } from "@/client/hooks/query/usePerfumeQuery";
import { usePerfumeReviews } from "@/client/hooks/query/useReviewQuery";
import { useParams } from "next/navigation";

export default function PerfumeDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: perfumeDetail = null,
    isLoading: isPerfumeLoading,
    error: perfumeError,
  } = usePerfumeDetail(id);

  const { data: reviewData = [], isLoading: isReviewLoading } =
    usePerfumeReviews(id);

  const isLoading = isPerfumeLoading || isReviewLoading;

  if (perfumeError) {
    return <div>향수를 찾을 수 없습니다.</div>;
  }

  return (
    <DetailClient
      perfumeDetail={perfumeDetail}
      isPerfumeLoading={isLoading}
      reviewData={reviewData}
      isReviewLoading={isLoading}
    />
  );
}

// temp: SEO 개선 하기

// export async function generateMetadata({ params }: { params: { id: string } }) {
//   const perfume = await getPerfumeById(params.id);
//   if (!perfume) return { title: "향수 없음" };
//   return {
//     title: perfume.name,
//     openGraph: {
//       title: perfume.name,
//       images: [`https://cdn.example.com/perfume/${perfume.id}.jpg`],
//     },
//   };
// }
