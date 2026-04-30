import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import getQueryClient from "@/client/utils/getQueryClient";
import { brandApi } from "@/client/utils/api/brands.api";
import { perfumeApi } from "@/client/utils/api/perfumes.api";
import { queryKeys } from "@/client/utils/queryKeys";
import PageClient from "@/components/domains/perfumes/PageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "향수 탐색 | ChickChick",
  description:
    "다양한 브랜드의 향수를 탐색하고, 노트와 어코드로 필터링하여 나에게 맞는 향수를 찾아보세요. ChickChick에서 수천 개의 향수 정보를 확인하세요.",
  openGraph: {
    title: "향수 탐색",
    description:
      "다양한 브랜드의 향수를 탐색하고, 노트와 어코드로 필터링하여 나에게 맞는 향수를 찾아보세요.",
    type: "website",
  },
};

// 동적 렌더링으로 전환 (빌드 시 타임아웃 방지)
export const dynamic = "force-dynamic";

export default async function Page() {
  const queryClient = getQueryClient();

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.filter.brands(),
        queryFn: () => brandApi.list(),
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.filter.notes(),
        queryFn: () => perfumeApi.notes(),
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.filter.accords(),
        queryFn: () => perfumeApi.accords(),
      }),
    ]);
  } catch (error) {
    console.error("Failed to prefetch perfume data:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <PageClient />
      </Suspense>
    </HydrationBoundary>
  );
}
