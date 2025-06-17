import { BrandDetailImage } from "@/components/domains/brandDetail/image";
import { BrandDetailInfo } from "@/components/domains/brandDetail/info";
import { BrandPerfumes } from "@/components/domains/brandDetail/perfumes";
import { BrandDetailSearchBar } from "@/components/domains/brandDetail/searchBar";
import { prisma } from "@/lib/prisma";

// TODO: 크롤링 완료 후 데이터로 변경 필요, brand id 연결
export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const brandUrl = "https://www.jomalone.co.kr/";
  const brandStores = "https://www.naver.com/";
  const brandImages = [
    { order: 1, src: "https://picsum.photos/1000/400", alt: "1" },
    { order: 2, src: "https://picsum.photos/1000/400", alt: "2" },
    { order: 3, src: "https://picsum.photos/1000/400", alt: "3" },
  ];

  const resolvedParams = await params;
  const brandId = resolvedParams.id;

  // TODO: 공식 사이트 컬럼 없음
  const brandData = await prisma.brand.findUnique({
    where: { id: brandId },
    select: {
      nameEn: true,
      nameKo: true,
      description: true,
      imageUrl: true,
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
      <BrandPerfumes notes={notes} accords={accords} />
    </div>
  );
}
