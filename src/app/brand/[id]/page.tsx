import { SearchBar } from "@/components/commons/search/SearchBar";
import { BrandDetailImage } from "@/components/domains/brandDetail/image";
import { BrandDetailInfo } from "@/components/domains/brandDetail/info";
import { BrandPerfumes } from "@/components/domains/brandDetail/perfumes";
import { prisma } from "@/lib/prisma";

// TODO: 크롤링 완료 후 데이터로 변경 필요, brand id 연결
export default async function BrandDetailPage() {
  const brandName = "JO MALONE";
  const brandDescription =
    "모든 국민은 법률이 정하는 바에 의하여 선거권을 가진다. 공무원인 근로자는 법률이 정하는 자에 한하여 단결권·단체교섭권 및 단체행동권을 가진다.\n국군은 국가의 안전보장과 국토방위의 신성한 의무를 수행함을 사명으로 하며, 그 정치적 중립성은 준수된다. 나는 헌법을 준수하고 국가를 보위하며 조국의 평화적 통일과 국민의 자유와 복리의 증진 및 민족문화의 창달에 노력하여 대통령으로서의 직책을 성실히 수행할 것을 국민 앞에 엄숙히 선서합니다.";
  const brandUrl = "https://www.jomalone.co.kr/";
  const brandStores = "https://www.naver.com/";
  const brandImages = [
    { order: 1, src: "https://picsum.photos/1000/400", alt: "1" },
    { order: 2, src: "https://picsum.photos/1000/400", alt: "2" },
    { order: 3, src: "https://picsum.photos/1000/400", alt: "3" },
  ];

  const [notes, accords] = await Promise.all([
    prisma.perfumeNote.findMany(),
    prisma.perfumeAccord.findMany(),
  ]);

  return (
    <div className="flex flex-col items-center justify-center py-10 w-full">
      <SearchBar />
      <BrandDetailInfo
        brandName={brandName}
        brandDescription={brandDescription}
        brandUrl={brandUrl}
        brandStores={brandStores}
      />
      <BrandDetailImage images={brandImages} />
      <BrandPerfumes notes={notes} accords={accords} />
    </div>
  );
}
