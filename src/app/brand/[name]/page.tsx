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
  const brandUrl = "https://www.jomalone.co.kr/";
  const brandStores = "https://www.naver.com/";
  const brandImages = [
    { order: 1, src: "https://picsum.photos/seed/picsum/1200/400", alt: "1" },
    { order: 2, src: "https://picsum.photos/seed/picsum/1200/400", alt: "2" },
    { order: 3, src: "https://picsum.photos/seed/picsum/1200/400", alt: "3" },
  ];

  const resolvedParams = await params;
  const brandName = decodeURIComponent(resolvedParams.name);

  // TODO: 공식 사이트 컬럼 없음, 위치
  const brandData = await prisma.brand.findUnique({
    where: { nameEn: brandName },
    select: {
      id: true,
      nameEn: true,
      nameKo: true,
      description: true,
      imageUrl: true,
      mapLocation: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const [notes, accords] = await Promise.all([
    prisma.perfumeNote.findMany(),
    prisma.perfumeAccord.findMany(),
  ]);

  return (
    <div className="flex flex-col items-center justify-center py-10 w-full">
      <BrandDetailSearchBar />
      <BrandDetailInfo
        brandName={brandData?.nameKo || brandData?.nameEn || "브랜드 이름"}
        brandDescription={brandData?.description || "브랜드 설명"}
        brandUrl={brandUrl}
        brandStores={brandStores}
      />
      <BrandDetailImage images={brandImages} />
      <PageClient
        brandName={brandData?.nameEn ?? ""}
        notes={notes}
        accords={accords}
      />
    </div>
  );
}
