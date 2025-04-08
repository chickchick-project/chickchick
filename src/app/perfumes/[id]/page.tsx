import { DetailClient } from "@/components/domains/perfumeDetail/DetailClient";
import { getPerfumeById } from "@/lib/utils/getPerfumeById";

export default async function PerfumeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const perfume = await getPerfumeById(params.id);
  if (!perfume) return;
  return <DetailClient perfume={perfume} />;
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
