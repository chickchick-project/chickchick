import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/client/utils/getQueryClient";
import { brandApi } from "@/client/utils/api/brands.api";
import { perfumeApi } from "@/client/utils/api/perfumes.api";
import { BrandDetailTitle } from "@/components/domains/brandDetail/title";
import { PageClient } from "@/components/domains/brandDetail/perfumes/PageClient";
import { BrandDetailSearchBar } from "@/components/domains/brandDetail/searchBar";
import BrandDetailTabs from "@/components/domains/brandDetail/Tabs";
import { generateSeo } from "@/shared/utils/generateSeo";

type Props = {
  params: Promise<{ name: string }>;
};

const getBrandByName = cache(async (brandName: string) => {
  return brandApi.getByName(brandName);
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const brandName = decodeURIComponent(resolvedParams.name);

  try {
    const brandResponse = await getBrandByName(brandName);

    if (!brandResponse || !brandResponse.data) {
      return generateSeo({
        title: "브랜드 없음",
        description: "존재하지 않거나 삭제된 브랜드입니다.",
      });
    }

    const brand = brandResponse.data;
    const displayName = `${brand.nameKo} ${brand.nameEn}`.trim();

    return generateSeo({
      title: `${displayName} 향수`,
      description:
        brand.description ||
        `${displayName}의 다양한 향수를 만나보세요. ChickChick에서 브랜드별 향수 정보와 리뷰를 확인하세요.`,
    });
  } catch (error) {
    console.error("메타데이터 생성 중 오류 발생:", error);
    return generateSeo({
      title: "브랜드",
      description: "ChickChick 브랜드 페이지입니다.",
    });
  }
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params;
  const brandName = decodeURIComponent(resolvedParams.name);
  const queryClient = getQueryClient();

  try {
    const brandResponse = await queryClient.fetchQuery({
      queryKey: ["brand", "detail", brandName],
      queryFn: () => getBrandByName(brandName),
    });

    if (!brandResponse) {
      return notFound();
    }

    const brandData = brandResponse.data;

    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["perfume", "notes"],
        queryFn: () => perfumeApi.notes(),
      }),
      queryClient.prefetchQuery({
        queryKey: ["perfume", "accords"],
        queryFn: () => perfumeApi.accords(),
      }),
    ]);

    const brandUrl = brandData.brandUrl;
    const brandImages = {
      src:
        brandData.imageUrl ??
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=400&q=80",
      alt: brandData.nameKo ?? brandData.nameEn,
    };

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex flex-col items-center justify-centers w-full">
          <BrandDetailSearchBar />
          <BrandDetailTitle
            brandName={`${brandData.nameKo} ${brandData.nameEn}`}
          />
          <BrandDetailTabs
            images={brandImages}
            brandName={brandData.nameKo ?? brandData.nameEn}
            brandDescription={brandData.description ?? "소개글이 없습니다."}
            brandUrl={brandUrl ?? ""}
          />
          <PageClient brandName={brandData.nameEn ?? ""} />
        </div>
      </HydrationBoundary>
    );
  } catch (error) {
    console.error("Error fetching brand data:", error);
    return notFound();
  }
}
