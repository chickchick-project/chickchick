import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/utils/getQueryClient";
import { brandApi } from "@/lib/utils/api/brands.api";
import { perfumeApi } from "@/lib/utils/api/perfumes.api";
import { BrandDetailImage } from "@/components/domains/brandDetail/image";
import { BrandDetailInfo } from "@/components/domains/brandDetail/info";
import { PageClient } from "@/components/domains/brandDetail/perfumes/PageClient";
import { BrandDetailSearchBar } from "@/components/domains/brandDetail/searchBar";
import { notFound } from "next/navigation";

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
      queryFn: () => brandApi.getByName(brandName),
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
    const brandStores = `https://map.naver.com/p/search/${brandData.nameKo}`;
    const brandImages = {
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=400&q=80",
      alt: "1",
    };

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex flex-col items-center justify-centers w-full">
          <BrandDetailSearchBar />
          <BrandDetailInfo
            brandName={`${brandData.nameKo} ${brandData.nameEn}`}
            brandDescription={brandData.description ?? ""}
            brandUrl={brandUrl ?? ""}
            brandStores={brandStores}
          />
          <BrandDetailImage images={brandImages} />
          {/* <BrandMap /> */}
          <PageClient brandName={brandData.nameEn ?? ""} />
        </div>
      </HydrationBoundary>
    );
  } catch (error) {
    console.error("Error fetching brand data:", error);
    return notFound();
  }
}
