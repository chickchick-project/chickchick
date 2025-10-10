import { DetailClient } from "@/components/domains/perfumeDetail/DetailClient";
import {
  IPerfumeDetail,
  IPerfumeDetailResponse,
} from "@/lib/types/perfumeDetail";
import { IReviewItem, IReviewsResponse } from "@/lib/types/perfumeReview";
import { makeQueryClient } from "@/lib/utils/core-request/queryClient";
import { createApiServerClient } from "@/lib/utils/core-request/serverClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function PerfumeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const api = await createApiServerClient();
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["perfume", id, "detail"],
    queryFn: () =>
      api.get<IPerfumeDetailResponse, IPerfumeDetail>(
        `/perfumes/${id}`,
        undefined,
        {
          transformResponse: (res) => res.data,
        }
      ),
  });

  await queryClient.prefetchQuery({
    queryKey: ["perfume", id, "review"],
    queryFn: () =>
      api.get<IReviewsResponse, IReviewItem[]>(`/reviews/${id}`, undefined, {
        transformResponse: (res) => res.data,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DetailClient perfumeId={id} />
    </HydrationBoundary>
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
