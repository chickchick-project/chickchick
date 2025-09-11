import { BrandDetailImage } from "@/components/domains/brandDetail/image";
import { BrandDetailInfo } from "@/components/domains/brandDetail/info";
import { PageClient } from "@/components/domains/brandDetail/perfumes/PageClient";
import { BrandDetailSearchBar } from "@/components/domains/brandDetail/searchBar";
import { prisma } from "@/lib/prisma";

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params;
  const brandName = decodeURIComponent(resolvedParams.name);

  // TODO: 공식 사이트 컬럼 없음, 위치
  const brandData = await prisma.brand.findUnique({
    where: { nameKo: brandName },
    select: {
      id: true,
      nameEn: true,
      nameKo: true,
      description: true,
      imageUrl: true,
      brandUrl: true,
      mapLocation: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const brandUrl = brandData?.brandUrl;
  const brandStores = `https://map.naver.com/p/search/${brandData?.nameKo}`;
  const brandImages = {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=400&q=80",
    alt: "1",
  };

  const [notes, accords] = await Promise.all([
    prisma.perfumeNote.findMany(),
    prisma.perfumeAccord.findMany(),
  ]);

  return (
    <div className="flex flex-col items-center justify-centers w-full">
      <BrandDetailSearchBar />
      <BrandDetailInfo
        brandName={`${brandData?.nameKo} ${brandData?.nameEn}` || "브랜드 이름"}
        brandDescription={brandData?.description || ""}
        brandUrl={brandUrl || ""}
        brandStores={brandStores}
      />
      <BrandDetailImage images={brandImages} />
      {/* <BrandMap /> */}
      <PageClient
        brandName={brandData?.nameEn ?? ""}
        notes={notes}
        accords={accords}
      />
    </div>
  );
}
