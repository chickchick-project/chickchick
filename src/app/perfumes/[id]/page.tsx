import { DetailClient } from "@/components/domains/perfumeDetail/DetailClient";
import { getReviewData } from "@/components/domains/perfumeDetail/review/review.helper";
import { TPerfumeDetailRaw } from "@/lib/types/perfumeDetail";
import { getPerfumeById } from "@/lib/utils/getPerfumeById";
import { mapPerfumeDetail } from "@/lib/utils/mapPerfumeDetail";

export default async function PerfumeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const perfumeDetailRaw: TPerfumeDetailRaw | null = await getPerfumeById(id);
  if (!perfumeDetailRaw) {
    return <div>향수를 찾을 수 없습니다.</div>;
  }
  const perfumeDetail = mapPerfumeDetail(perfumeDetailRaw);
  if (!perfumeDetail) {
    return <div>향수 정보 매핑 실패</div>;
  }

  const perfumeReviewData = await getReviewData(id);

  return (
    <DetailClient
      perfumeDetail={perfumeDetail}
      reviewData={perfumeReviewData}
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
