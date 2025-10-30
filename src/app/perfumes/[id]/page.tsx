"use client";

import { DetailClient } from "@/components/domains/perfumeDetail/DetailClient";
import { usePerfumeDetail } from "@/lib/hooks/query/usePerfumeQuery";
import { usePerfumeReviews } from "@/lib/hooks/query/useReviewQuery";
import { useParams } from "next/navigation";
import { Spinner } from "@/components/commons/loading/Spinner";

export default function PerfumeDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // 향수 상세 정보 조회
  const {
    data: perfumeDetail,
    isLoading: isPerfumeLoading,
    error: perfumeError,
  } = usePerfumeDetail(id);

  // 리뷰 데이터 조회
  const { data: reviewData = [], isLoading: isReviewLoading } =
    usePerfumeReviews(id);

  if (isPerfumeLoading || isReviewLoading) {
    return <Spinner />;
  }

  if (perfumeError || !perfumeDetail) {
    return <div>향수를 찾을 수 없습니다.</div>;
  }

  return <DetailClient perfumeDetail={perfumeDetail} reviewData={reviewData} />;
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
