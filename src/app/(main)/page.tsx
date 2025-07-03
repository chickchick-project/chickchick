import { MainBanner } from "@/components/domains/main/mainBanner/MainBanner";
import { MainContent } from "@/components/domains/main/mainContent/MainContent";
import { MainLogo } from "@/components/domains/main/MainLogo";
import { MainSearchBar } from "@/components/domains/main/MainSearchBar";
import { prisma } from "@/lib/prisma";

// TODO: 배너에 보여줄 테마에 맞는 필터 적용 필요
export default async function Home() {
  const data = await prisma.perfume.findMany({
    select: {
      id: true,
      nameKo: true,
      nameEn: true,
      brand: {
        select: {
          id: true,
          nameKo: true,
          nameEn: true,
        },
      },
      perfumeImage: {
        select: {
          image_url: true,
        },
      },
    },
    take: 5,
    skip: 1,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <MainLogo />
      <MainBanner data={data} />
      <MainSearchBar />
      <MainContent />
    </>
  );
}
